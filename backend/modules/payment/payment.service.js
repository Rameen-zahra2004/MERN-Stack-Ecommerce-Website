import Stripe from "stripe";
import paypalSDK from "@paypal/checkout-server-sdk";

// ─── Stripe Client ───────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// ─── PayPal Client ───────────────────────────────────────────────────────────
const paypalEnv =
  process.env.NODE_ENV === "production"
    ? new paypalSDK.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET,
      )
    : new paypalSDK.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET,
      );

const paypalClient = new paypalSDK.core.PayPalHttpClient(paypalEnv);

/**
 * PayPal SDK errors come back with a JSON string in err.message (or
 * err.message wrapping a `details`/`name` payload). This pulls out a
 * human-readable message instead of letting a raw stack trace bubble up.
 */
const parsePayPalError = (err) => {
  try {
    const parsed = JSON.parse(err.message);
    return parsed?.details?.[0]?.description || parsed?.message || err.message;
  } catch {
    return err.message || "Unknown PayPal error";
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  STRIPE METHODS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a Stripe PaymentIntent
 * @param {number} amount  - Amount in smallest currency unit (e.g. cents)
 * @param {string} currency - ISO currency code e.g. "usd"
 * @param {object} metadata - Arbitrary key-value pairs (orderId, userId, etc.)
 *
 * Uses orderId as the Stripe idempotency key (when provided) so that
 * accidental double-submits (double-click, retry after timeout) reuse
 * the same PaymentIntent instead of creating duplicate charges.
 */
export const createStripePaymentIntent = async (
  amount,
  currency = "usd",
  metadata = {},
) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid amount passed to createStripePaymentIntent");
  }

  const idempotencyKey = metadata.orderId
    ? `pi_create_${metadata.orderId}`
    : undefined;

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    },
    idempotencyKey ? { idempotencyKey } : undefined,
  );

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

export const retrieveStripePaymentIntent = async (paymentIntentId) => {
  if (!paymentIntentId) throw new Error("paymentIntentId is required");
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

/**
 * Issue a full or partial Stripe refund
 */
export const createStripeRefund = async (paymentIntentId, amount = null) => {
  if (!paymentIntentId)
    throw new Error("paymentIntentId is required for refund");

  const refundData = { payment_intent: paymentIntentId };
  if (amount) refundData.amount = amount;

  const idempotencyKey = `refund_${paymentIntentId}_${amount || "full"}`;

  return stripe.refunds.create(refundData, { idempotencyKey });
};

/**
 * Verify Stripe webhook signature — call this in your webhook route
 */
export const constructStripeEvent = (rawBody, sig) => {
  if (!sig) throw new Error("Missing Stripe-Signature header");
  return stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  PAYPAL METHODS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a PayPal order
 */
export const createPayPalOrder = async (amount, currency = "USD", orderId) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid amount passed to createPayPalOrder");
  }

  const request = new paypalSDK.orders.OrdersCreateRequest();
  request.prefer("return=representation");

  // PayPal-Request-Id provides idempotency: retried create-order calls
  // for the same orderId won't spawn duplicate PayPal orders.
  if (orderId) {
    request.headers["PayPal-Request-Id"] = `create_${orderId}`;
  }

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: orderId,
        amount: {
          currency_code: currency,
          value: (amount / 100).toFixed(2), // PayPal uses decimal, not cents
        },
      },
    ],
  });

  try {
    const response = await paypalClient.execute(request);
    return {
      paypalOrderId: response.result.id,
      status: response.result.status,
      approveLink: response.result.links.find((l) => l.rel === "approve")?.href,
    };
  } catch (err) {
    throw new Error(parsePayPalError(err));
  }
};

/**
 * Capture a PayPal order after buyer approval
 */
export const capturePayPalOrder = async (paypalOrderId) => {
  if (!paypalOrderId) throw new Error("paypalOrderId is required");

  const request = new paypalSDK.orders.OrdersCaptureRequest(paypalOrderId);
  // Idempotent on PayPal's side per-order, but set explicitly for clarity
  request.headers["PayPal-Request-Id"] = `capture_${paypalOrderId}`;
  request.requestBody({});

  try {
    const response = await paypalClient.execute(request);
    return response.result;
  } catch (err) {
    // PayPal returns 422 ORDER_ALREADY_CAPTURED if retried after success —
    // surface that distinctly so the controller can treat it as a non-fatal
    // "already done" case rather than a hard failure.
    const message = parsePayPalError(err);
    if (message.includes("ORDER_ALREADY_CAPTURED")) {
      const alreadyCapturedErr = new Error(message);
      alreadyCapturedErr.code = "ORDER_ALREADY_CAPTURED";
      throw alreadyCapturedErr;
    }
    throw new Error(message);
  }
};

/**
 * Issue a PayPal refund on a captured payment
 */
export const refundPayPalPayment = async (
  captureId,
  amount = null,
  currency = "USD",
) => {
  if (!captureId) throw new Error("captureId is required for refund");

  const request = new paypalSDK.payments.CapturesRefundRequest(captureId);
  request.headers["PayPal-Request-Id"] =
    `refund_${captureId}_${amount || "full"}`;

  const body = {};
  if (amount) {
    body.amount = { value: (amount / 100).toFixed(2), currency_code: currency };
  }
  request.requestBody(body);

  try {
    const response = await paypalClient.execute(request);
    return response.result;
  } catch (err) {
    throw new Error(parsePayPalError(err));
  }
};
