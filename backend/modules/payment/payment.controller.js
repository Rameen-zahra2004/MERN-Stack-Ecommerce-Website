import asyncHandler from "express-async-handler";
import {
  createStripePaymentIntent,
  retrieveStripePaymentIntent,
  createStripeRefund,
  constructStripeEvent,
  createPayPalOrder,
  capturePayPalOrder,
  refundPayPalPayment,
} from "./payment.service.js";
import Order from "../orders/order.model.js";

const getOwnedOrder = async (orderId, user) => {
  const order = await Order.findById(orderId);
  if (!order)
    return { order: null, errorStatus: 404, errorMsg: "Order not found" };

  const isOwner = order.userId?.toString() === user._id.toString();
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user.role);

  if (!isOwner && !isAdmin) {
    return {
      order: null,
      errorStatus: 403,
      errorMsg: "You do not have access to this order",
    };
  }

  return { order, errorStatus: null, errorMsg: null };
};

// ─────────────────────────────────────────────────────────────────────────────
//  STRIPE CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

export const stripeCreateIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: "orderId is required" });

  const { order, errorStatus, errorMsg } = await getOwnedOrder(
    orderId,
    req.user,
  );
  if (errorStatus) return res.status(errorStatus).json({ message: errorMsg });

  if (order.paymentStatus === "paid") {
    return res.status(400).json({ message: "Order already paid" });
  }

  if (order.paymentIntentId) {
    try {
      const existing = await retrieveStripePaymentIntent(order.paymentIntentId);
      if (existing.status !== "succeeded" && existing.status !== "canceled") {
        return res.json({ clientSecret: existing.client_secret });
      }
    } catch {
      // Old intent invalid/expired — fall through and create a new one
    }
  }

  const amountInCents = Math.round(order.totalPrice * 100);
  if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
    return res.status(400).json({ message: "Invalid order amount" });
  }

  const { clientSecret, paymentIntentId } = await createStripePaymentIntent(
    amountInCents,
    "usd",
    { orderId: order._id.toString(), userId: req.user._id.toString() },
  );

  order.paymentIntentId = paymentIntentId;
  await order.save();

  res.json({ clientSecret });
});

export const stripeVerifyPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  if (!paymentIntentId) {
    return res.status(400).json({ message: "paymentIntentId is required" });
  }

  const intent = await retrieveStripePaymentIntent(paymentIntentId);

  const order = await Order.findOne({ paymentIntentId });
  if (!order)
    return res
      .status(404)
      .json({ message: "Order not found for this payment" });

  // Ownership check
  const isOwner = order.userId?.toString() === req.user._id.toString();
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(req.user.role);
  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have access to this order" });
  }

  if (intent.status === "succeeded") {
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
      await order.save();
    }
    return res.json({ success: true, status: intent.status });
  }

  res.json({ success: false, status: intent.status });
});

export const stripeRefund = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!order.paymentIntentId) {
    return res
      .status(400)
      .json({ message: "No payment intent found for order" });
  }
  if (order.paymentStatus !== "paid") {
    return res
      .status(400)
      .json({ message: "Order has not been paid, nothing to refund" });
  }

  const refund = await createStripeRefund(order.paymentIntentId, amount);

  order.paymentStatus = "refunded";
  order.refundedAt = new Date();
  await order.save();

  res.json({ success: true, refundId: refund.id });
});

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
      handleStripeSuccess(intent).catch((err) =>
        console.error("Error handling Stripe success webhook:", err),
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      handleStripeFailure(intent).catch((err) =>
        console.error("Error handling Stripe failure webhook:", err),
      );
      break;
    }
    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  // Acknowledge immediately — Stripe retries if it doesn't get a fast 2xx
  res.json({ received: true });
};

const handleStripeSuccess = async (intent) => {
  const order = await Order.findOne({ paymentIntentId: intent.id });
  if (order && order.paymentStatus !== "paid") {
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

export const paypalCreateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: "orderId is required" });

  const { order, errorStatus, errorMsg } = await getOwnedOrder(
    orderId,
    req.user,
  );
  if (errorStatus) return res.status(errorStatus).json({ message: errorMsg });

  if (order.paymentStatus === "paid") {
    return res.status(400).json({ message: "Order already paid" });
  }

  const amountInCents = Math.round(order.totalPrice * 100);
  if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
    return res.status(400).json({ message: "Invalid order amount" });
  }

  let result;
  try {
    result = await createPayPalOrder(
      amountInCents,
      "USD",
      order._id.toString(),
    );
  } catch (err) {
    console.error("PayPal create order error:", err?.message || err);
    return res
      .status(502)
      .json({ message: "Could not create PayPal order. Please try again." });
  }

  order.paypalOrderId = result.paypalOrderId;
  await order.save();

  res.json({
    paypalOrderId: result.paypalOrderId,
    approveLink: result.approveLink,
  });
});

export const paypalCaptureOrder = asyncHandler(async (req, res) => {
  const { paypalOrderId } = req.body;
  if (!paypalOrderId) {
    return res.status(400).json({ message: "paypalOrderId is required" });
  }

  const order = await Order.findOne({ paypalOrderId });
  if (!order) {
    return res
      .status(404)
      .json({ message: "No order found for this PayPal order ID" });
  }

  // Ownership check
  const isOwner = order.userId?.toString() === req.user._id.toString();
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(req.user.role);
  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have access to this order" });
  }

  if (order.paymentStatus === "paid") {
    return res.json({
      success: true,
      captureId: order.paypalCaptureId,
      status: "ALREADY_PAID",
    });
  }

  let capture;
  try {
    capture = await capturePayPalOrder(paypalOrderId);
  } catch (err) {
    console.error("PayPal capture error:", err?.message || err);
    return res
      .status(502)
      .json({
        message: "Could not capture PayPal payment. You have not been charged.",
      });
  }

  if (capture.status !== "COMPLETED") {
    return res.status(400).json({ success: false, status: capture.status });
  }

  order.paymentStatus = "paid";
  order.paidAt = new Date();
  order.paypalCaptureId =
    capture.purchase_units?.[0]?.payments?.captures?.[0]?.id;
  await order.save();

  res.json({
    success: true,
    captureId: order.paypalCaptureId,
    status: capture.status,
  });
});

export const paypalRefund = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!order.paypalCaptureId) {
    return res.status(400).json({ message: "No PayPal capture ID found" });
  }
  if (order.paymentStatus !== "paid") {
    return res
      .status(400)
      .json({ message: "Order has not been paid, nothing to refund" });
  }

  let refund;
  try {
    refund = await refundPayPalPayment(order.paypalCaptureId, amount);
  } catch (err) {
    console.error("PayPal refund error:", err?.message || err);
    return res
      .status(502)
      .json({ message: "Could not process PayPal refund. Please try again." });
  }

  order.paymentStatus = "refunded";
  order.refundedAt = new Date();
  await order.save();

  res.json({ success: true, refundId: refund.id });
});
