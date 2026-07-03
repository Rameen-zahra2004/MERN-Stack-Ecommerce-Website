import Order from "./order.model.js";
import Cart from
  "../cart/Cart.model.js";

import Product from
  "../product/product.model.js";

import {
  ORDER_MESSAGES,
} from "./order.constants.js";

/*
=========================
CREATE ORDER FROM CART
=========================
*/

export const createOrderService =
  async (
    userId,
    paymentMethod,
    shippingAddress
  ) => {
    const cart =
      await Cart.findOne({
        user: userId,
      }).populate(
        "items.product"
      );

    if (
      !cart ||
      cart.items.length === 0
    ) {
      throw new Error(
        ORDER_MESSAGES.CART_EMPTY
      );
    }

    /*
    =========================
    STOCK VALIDATION
    =========================
    */

    for (const item of cart.items) {
      const product =
        await Product.findById(
          item.product._id
        );

      if (
        product.stock <
        item.quantity
      ) {
        throw new Error(
          ORDER_MESSAGES.OUT_OF_STOCK
        );
      }
    }

    /*
    =========================
    DEDUCT STOCK
    =========================
    */

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            stock:
              -item.quantity,
          },
        }
      );
    }

    /*
    =========================
    CREATE ORDER ITEMS
    =========================
    */

    const orderItems =
      cart.items.map((item) => ({
        product: item.product._id,

        name: item.product.name,

        quantity: item.quantity,

        price: item.price,

        subtotal:
          item.subtotal,
      }));

    const subtotal =
      cart.items.reduce(
        (acc, item) =>
          acc + item.subtotal,
        0
      );

    const tax =
      subtotal * 0.05;

    const shippingFee =
      subtotal > 5000
        ? 0
        : 250;

    const totalAmount =
      subtotal +
      tax +
      shippingFee;

    /*
    =========================
    CREATE ORDER
    =========================
    */

    const order =
      await Order.create({
        user: userId,

        items: orderItems,

        subtotal,

        tax,

        shippingFee,

        totalAmount,

        paymentMethod,

        shippingAddress,
      });

    /*
    =========================
    CLEAR CART AFTER ORDER
    =========================
    */

    cart.items = [];

    await cart.save();

    return order;
  };

/*
=========================
GET USER ORDERS
=========================
*/

export const getOrdersService =
  async (userId) => {
    const orders =
      await Order.find({
        user: userId,
      })
        .sort({ createdAt: -1 })
        .lean();

    return orders;
  };

/*
=========================
GET SINGLE ORDER
=========================
*/

export const getSingleOrderService =
  async (orderId) => {
    const order =
      await Order.findById(
        orderId
      ).populate(
        "items.product"
      );

    if (!order) {
      throw new Error(
        ORDER_MESSAGES.NOT_FOUND
      );
    }

    return order;
  };

/*
=========================
CANCEL ORDER
=========================
*/

export const cancelOrderService =
  async (orderId, userId) => {
    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      throw new Error(
        ORDER_MESSAGES.NOT_FOUND
      );
    }

    if (
      order.user.toString() !==
      userId.toString()
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    if (
      order.status !== "PENDING"
    ) {
      throw new Error(
        "Order cannot be cancelled"
      );
    }

    /*
    =========================
    RESTORE STOCK
    =========================
    */

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock:
              item.quantity,
          },
        }
      );
    }

    order.status =
      "CANCELLED";

    await order.save();

    return order;
  };
