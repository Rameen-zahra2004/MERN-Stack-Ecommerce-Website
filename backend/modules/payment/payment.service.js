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
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypalSDK.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );

const paypalClient = new paypalSDK.core.PayPalHttpClient(paypalEnv);

// ─────────────────────────────────────────────────────────────────────────────
//  STRIPE METHODS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a Stripe PaymentIntent
 * @param {number} amount  - Amount in smallest currency unit (e.g. cents)
 * @param {string} currency - ISO currency code e.g. "usd"
 * @param {object} metadata - Arbitrary key-value pairs (orderId, userId, etc.)
 */
export const createStripePaymentIntent = async (amount, currency = "usd", metadata = {}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

/**
 * Retrieve a Stripe PaymentIntent (to verify status server-side)
 */
export const retrieveStripePaymentIntent = async (paymentIntentId) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

/**
 * Issue a full or partial Stripe refund
 */
export const createStripeRefund = async (paymentIntentId, amount = null) => {
  const refundData = { payment_intent: paymentIntentId };
  if (amount) refundData.amount = amount;
  return stripe.refunds.create(refundData);
};

/**
 * Verify Stripe webhook signature — call this in your webhook route
 */
export const constructStripeEvent = (rawBody, sig) => {
  return stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  PAYPAL METHODS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a PayPal order
 */
export const createPayPalOrder = async (amount, currency = "USD", orderId) => {
  const request = new paypalSDK.orders.OrdersCreateRequest();
  request.prefer("return=representation");
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

  const response = await paypalClient.execute(request);
  return {
    paypalOrderId: response.result.id,
    status: response.result.status,
    approveLink: response.result.links.find((l) => l.rel === "approve")?.href,
  };
};

/**
 * Capture a PayPal order after buyer approval
 */
export const capturePayPalOrder = async (paypalOrderId) => {
  const request = new paypalSDK.orders.OrdersCaptureRequest(paypalOrderId);
  request.requestBody({});
  const response = await paypalClient.execute(request);
  return response.result;
};

/**
 * Issue a PayPal refund on a captured payment
 */
export const refundPayPalPayment = async (captureId, amount = null, currency = "USD") => {
  const request = new paypalSDK.payments.CapturesRefundRequest(captureId);
  const body = {};
  if (amount) {
    body.amount = { value: (amount / 100).toFixed(2), currency_code: currency };
  }
  request.requestBody(body);
  const response = await paypalClient.execute(request);
  return response.result;
};