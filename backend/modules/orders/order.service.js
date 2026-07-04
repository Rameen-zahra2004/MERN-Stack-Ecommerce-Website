import mongoose from "mongoose";

import Order from "./order.model.js";

import Cart from "../cart/Cart.model.js";

import Product from "../product/product.model.js";

import { ORDER_MESSAGES } from "./order.constants.js";

import { ORDER_STATUS } from "./order.status.js";

import { calculateOrderTotals } from "../shared/orderCalculations.utils.js";

import { createOrderDetailService } from "../orderDetail/orderDetail.service.js";


export const createOrderService = async (
  userId,
  paymentMethod,
  shippingAddress,
) => {
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error(ORDER_MESSAGES.CART_EMPTY);
  }


  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    const insufficientStock = !product || product.stock < item.quantity;

    if (insufficientStock) {
      throw new Error(ORDER_MESSAGES.OUT_OF_STOCK);
    }
  }

  const session = await mongoose.startSession();

  try {
    let order;

    await session.withTransaction(async () => {

      for (const item of cart.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product._id,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            session,
            new: true,
          },
        );

        if (!updatedProduct) {
          throw new Error(ORDER_MESSAGES.OUT_OF_STOCK);
        }
      }


      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      }));

      const subtotal = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

      const { tax, shippingFee, discount, totalAmount } = calculateOrderTotals({
        subtotal,
        discount: cart.discount,
      });


      const createdOrders = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            subtotal,
            tax,
            shippingFee,
            discount,
            totalAmount,
            paymentMethod,
            shippingAddress,
          },
        ],
        { session },
      );

      order = createdOrders[0];


      await createOrderDetailService(order._id, userId, orderItems, session);


      cart.items = [];

      await cart.save({ session });
    });

    return order;
  } finally {
    await session.endSession();
  }
};


export const getOrdersService = async (userId) => {
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};


export const getSingleOrderService = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).populate("items.product");

  if (!order) {
    throw new Error(ORDER_MESSAGES.NOT_FOUND);
  }

  return order;
};


export const getSingleOrderAdminService = async (orderId) => {
  const order = await Order.findById(orderId).populate("items.product");

  if (!order) {
    throw new Error(ORDER_MESSAGES.NOT_FOUND);
  }

  return order;
};


export const cancelOrderService = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error(ORDER_MESSAGES.NOT_FOUND);
  }

  if (order.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  if (order.status !== ORDER_STATUS.PENDING) {
    throw new Error("Order cannot be cancelled");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {

      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: { stock: item.quantity },
          },
          { session },
        );
      }

      order.status = ORDER_STATUS.CANCELLED;

      await order.save({ session });
    });

    return order;
  } finally {
    await session.endSession();
  }
};
