// import mongoose from "mongoose";

// import Order from "./order.model.js";

// import Cart from "../cart/Cart.model.js";

// import Product from "../product/product.model.js";

// import { ORDER_MESSAGES } from "./order.constants.js";

// import { calculateOrderTotals } from "../shared/orderCalculations.utils.js";

// import { createOrderDetailService } from "../orderDetail/orderDetail.service.js";

// /*
// =========================
// CREATE ORDER FROM CART
// =========================
// Wrapped in a MongoDB session transaction so stock deduction,
// order creation, OrderDetail creation, and cart clearing either
// all succeed or all roll back together.
// */

// export const createOrderService = async (
//   userId,
//   paymentMethod,
//   shippingAddress,
// ) => {
//   const cart = await Cart.findOne({
//     user: userId,
//   }).populate("items.product");

//   if (!cart || cart.items.length === 0) {
//     throw new Error(ORDER_MESSAGES.CART_EMPTY);
//   }

//   /*
//     =========================
//     STOCK VALIDATION (PRE-CHECK)
//     =========================
//     Cheap early rejection before opening a transaction.
//     Final authoritative check happens inside the transaction
//     during deduction below.
//     */

//   for (const item of cart.items) {
//     const product = await Product.findById(item.product._id);

//     const insufficientStock = !product || product.stock < item.quantity;

//     if (insufficientStock) {
//       throw new Error(ORDER_MESSAGES.OUT_OF_STOCK);
//     }
//   }

//   const session = await mongoose.startSession();

//   try {
//     let order;

//     await session.withTransaction(async () => {
//       /*
//         =========================
//         DEDUCT STOCK (GUARDED)
//         =========================
//         Filter on stock >= requested quantity so a
//         concurrent order cannot cause stock to go
//         negative. If the guard fails, the item was
//         taken by a concurrent request and the whole
//         transaction aborts.
//         */

//       for (const item of cart.items) {
//         const updatedProduct = await Product.findOneAndUpdate(
//           {
//             _id: item.product._id,
//             stock: { $gte: item.quantity },
//           },
//           {
//             $inc: { stock: -item.quantity },
//           },
//           {
//             session,
//             new: true,
//           },
//         );

//         if (!updatedProduct) {
//           throw new Error(ORDER_MESSAGES.OUT_OF_STOCK);
//         }
//       }

//       /*
//         =========================
//         BUILD ORDER ITEMS
//         =========================
//         */

//       const orderItems = cart.items.map((item) => ({
//         product: item.product._id,
//         name: item.product.name,
//         quantity: item.quantity,
//         price: item.price,
//         subtotal: item.subtotal,
//       }));

//       const subtotal = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

//       const { tax, shippingFee, discount, totalAmount } = calculateOrderTotals({
//         subtotal,
//         discount: cart.discount,
//       });

//       /*
//         =========================
//         CREATE ORDER
//         =========================
//         */

//       const createdOrders = await Order.create(
//         [
//           {
//             user: userId,
//             items: orderItems,
//             subtotal,
//             tax,
//             shippingFee,
//             discount,
//             totalAmount,
//             paymentMethod,
//             shippingAddress,
//           },
//         ],
//         { session },
//       );

//       order = createdOrders[0];

//       /*
//         =========================
//         CREATE ORDER DETAILS
//         =========================
//         */

//       await createOrderDetailService(order._id, userId, orderItems, session);

//       /*
//         =========================
//         CLEAR CART AFTER ORDER
//         =========================
//         */

//       cart.items = [];

//       await cart.save({ session });
//     });

//     return order;
//   } finally {
//     await session.endSession();
//   }
// };

// /*
// =========================
// GET USER ORDERS
// =========================
// */

// export const getOrdersService = async (userId) => {
//   const orders = await Order.find({ user: userId })
//     .sort({ createdAt: -1 })
//     .lean();

//   return orders;
// };

// /*
// =========================
// GET SINGLE ORDER
// =========================
// */

// export const getSingleOrderService = async (orderId) => {
//   const order = await Order.findById(orderId).populate("items.product");

//   if (!order) {
//     throw new Error(ORDER_MESSAGES.NOT_FOUND);
//   }

//   return order;
// };

// /*
// =========================
// CANCEL ORDER
// =========================
// */

// export const cancelOrderService = async (orderId, userId) => {
//   const order = await Order.findById(orderId);

//   if (!order) {
//     throw new Error(ORDER_MESSAGES.NOT_FOUND);
//   }

//   if (order.user.toString() !== userId.toString()) {
//     throw new Error("Unauthorized");
//   }

//   if (order.status !== "PENDING") {
//     throw new Error("Order cannot be cancelled");
//   }

//   /*
//   =========================
//   RESTORE STOCK
//   =========================
//   */

//   for (const item of order.items) {
//     await Product.findByIdAndUpdate(item.product, {
//       $inc: { stock: item.quantity },
//     });
//   }

//   order.status = "CANCELLED";

//   await order.save();

//   return order;
// };
import mongoose from "mongoose";

import Order from "./order.model.js";

import Cart from "../cart/Cart.model.js";

import Product from "../product/product.model.js";

import { ORDER_MESSAGES } from "./order.constants.js";

import { ORDER_STATUS } from "./order.status.js";

import { calculateOrderTotals } from "../shared/orderCalculations.utils.js";

import { createOrderDetailService } from "../orderDetail/orderDetail.service.js";

/*
=========================
CREATE ORDER FROM CART
=========================
Wrapped in a MongoDB session transaction so stock deduction,
order creation, OrderDetail creation, and cart clearing either
all succeed or all roll back together.
*/

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

  /*
    =========================
    STOCK VALIDATION (PRE-CHECK)
    =========================
    Cheap early rejection before opening a transaction.
    Final authoritative check happens inside the transaction
    during deduction below.
    */

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
      /*
        =========================
        DEDUCT STOCK (GUARDED)
        =========================
        Filter on stock >= requested quantity so a
        concurrent order cannot cause stock to go
        negative. If the guard fails, the item was
        taken by a concurrent request and the whole
        transaction aborts.
        */

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

      /*
        =========================
        BUILD ORDER ITEMS
        =========================
        */

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

      /*
        =========================
        CREATE ORDER
        =========================
        */

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

      /*
        =========================
        CREATE ORDER DETAILS
        =========================
        */

      await createOrderDetailService(order._id, userId, orderItems, session);

      /*
        =========================
        CLEAR CART AFTER ORDER
        =========================
        */

      cart.items = [];

      await cart.save({ session });
    });

    return order;
  } finally {
    await session.endSession();
  }
};

/*
=========================
GET USER ORDERS
=========================
*/

export const getOrdersService = async (userId) => {
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};

/*
=========================
GET SINGLE ORDER (CUSTOMER-SCOPED)
=========================
Returns an order only if it belongs to the requesting user.
Prevents IDOR: a customer cannot fetch another customer's order
by guessing/incrementing an order ID.
*/

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

/*
=========================
GET SINGLE ORDER (ADMIN — UNRESTRICTED)
=========================
Intentionally has no ownership filter. Access to this function
must only ever be reached through a route gated by
protect + restrictTo("admin"). Kept as a fully separate function
from the customer-scoped version above rather than a shared
function with a bypass flag, so ownership enforcement can never
be accidentally weakened.
*/

export const getSingleOrderAdminService = async (orderId) => {
  const order = await Order.findById(orderId).populate("items.product");

  if (!order) {
    throw new Error(ORDER_MESSAGES.NOT_FOUND);
  }

  return order;
};

/*
=========================
CANCEL ORDER
=========================
Wrapped in a MongoDB session transaction so stock restoration
and the order status update either both succeed or both roll
back together.
*/

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
      /*
        =========================
        RESTORE STOCK
        =========================
        */

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
