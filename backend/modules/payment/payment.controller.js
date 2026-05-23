import asyncHandler from "express-async-handler";
import {
  createStripePaymentIntent,
  retrieveStripePaymentIntent,
  createStripeRefund,
  constructStripeEvent,
  createPayPalOrder,
  capturePayPalOrder,
  refundPayPalPayment,
} from "../services/payment.service.js";
import Order from "../modules/order/Order.model.js";

// ─────────────────────────────────────────────────────────────────────────────
//  STRIPE CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/payments/stripe/intent
 * Body: { orderId }
 * Creates a PaymentIntent for a given order
 */
export const stripeCreateIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.paymentStatus === "paid") {
    return res.status(400).json({ message: "Order already paid" });
  }

  const amountInCents = Math.round(order.totalPrice * 100);

  const { clientSecret, paymentIntentId } = await createStripePaymentIntent(
    amountInCents,
    "usd",
    { orderId: order._id.toString(), userId: req.user._id.toString() }
  );

  // Persist the intent ID so we can verify on webhook
  order.paymentIntentId = paymentIntentId;
  await order.save();

  res.json({ clientSecret });
});

/**
 * POST /api/payments/stripe/verify
 * Body: { paymentIntentId }
 * Verify payment status server-side (fallback if webhook is delayed)
 */
export const stripeVerifyPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;

  const intent = await retrieveStripePaymentIntent(paymentIntentId);

  if (intent.status === "succeeded") {
    const order = await Order.findOne({ paymentIntentId });
    if (order) {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
      await order.save();
    }
    return res.json({ success: true, status: intent.status });
  }

  res.json({ success: false, status: intent.status });
});

/**
 * POST /api/payments/stripe/refund
 * Body: { orderId, amount? }  (amount in cents, omit for full refund)
 */
export const stripeRefund = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!order.paymentIntentId) {
    return res.status(400).json({ message: "No payment intent found for order" });
  }

  const refund = await createStripeRefund(order.paymentIntentId, amount);

  order.paymentStatus = "refunded";
  order.refundedAt = new Date();
  await order.save();

  res.json({ success: true, refundId: refund.id });
});

/**
 * POST /api/payments/stripe/webhook
 * Raw body required — mount BEFORE express.json() middleware
 */
export const stripeWebhook = (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = constructStripeEvent(req.body, sig);
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object;
      handleStripeSuccess(intent);
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      handleStripeFailure(intent);
      break;
    }
    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  res.json({ received: true });
};

const handleStripeSuccess = async (intent) => {
  const order = await Order.findOne({ paymentIntentId: intent.id });
  if (order) {
    order.paymentStatus = "paid";
    order.paidAt = new Date();
    await order.save();
  }
};

const handleStripeFailure = async (intent) => {
  const order = await Order.findOne({ paymentIntentId: intent.id });
  if (order) {
    order.paymentStatus = "failed";
    await order.save();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PAYPAL CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/payments/paypal/create-order
 * Body: { orderId }
 */
export const paypalCreateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.paymentStatus === "paid") {
    return res.status(400).json({ message: "Order already paid" });
  }

  const amountInCents = Math.round(order.totalPrice * 100);

  const { paypalOrderId, approveLink } = await createPayPalOrder(
    amountInCents,
    "USD",
    order._id.toString()
  );

  order.paypalOrderId = paypalOrderId;
  await order.save();

  res.json({ paypalOrderId, approveLink });
});

/**
 * POST /api/payments/paypal/capture
 * Body: { paypalOrderId }
 */
export const paypalCaptureOrder = asyncHandler(async (req, res) => {
  const { paypalOrderId } = req.body;

  const capture = await capturePayPalOrder(paypalOrderId);

  if (capture.status === "COMPLETED") {
    const order = await Order.findOne({ paypalOrderId });
    if (order) {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
      order.paypalCaptureId = capture.purchase_units[0]?.payments?.captures[0]?.id;
      await order.save();
    }
    return res.json({ success: true, captureId: order?.paypalCaptureId });
  }

  res.status(400).json({ success: false, status: capture.status });
});

/**
 * POST /api/payments/paypal/refund
 * Body: { orderId, amount? }
 */
export const paypalRefund = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!order.paypalCaptureId) {
    return res.status(400).json({ message: "No PayPal capture ID found" });
  }

  const refund = await refundPayPalPayment(order.paypalCaptureId, amount);

  order.paymentStatus = "refunded";
  order.refundedAt = new Date();
  await order.save();

  res.json({ success: true, refundId: refund.id });
});