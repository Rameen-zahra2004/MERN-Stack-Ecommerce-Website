import OrderDetail from "./OrderDetail.model.js";

import { buildOrderDetailPayload } from "./orderDetail.utils.js";

/*
=========================
CREATE BULK ORDER DETAILS
=========================
Accepts an optional Mongoose session so this can participate
in the checkout transaction in order.service.js. When called
without a session (e.g. any future standalone use), it behaves
exactly as before.
*/

export const createOrderDetailService = async (
  orderId,
  userId,
  items,
  session = null,
) => {
  const payload = buildOrderDetailPayload(orderId, userId, items);

  const options = session ? { session } : {};

  return await OrderDetail.insertMany(payload, options);
};

/*
=========================
GET BY ORDER ID
=========================
*/

export const getOrderDetailByOrderService = async (orderId) => {
  const data = await OrderDetail.find({
    order: orderId,
  })
    .populate("product", "name price images stock")
    .lean();

  return data;
};

/*
=========================
GET USER ORDER ITEMS (ANALYTICS READY)
=========================
*/

export const getUserOrderDetailsService = async (userId) => {
  const data = await OrderDetail.find({
    user: userId,
  })
    .populate("product", "name price")
    .sort({
      createdAt: -1,
    })
    .lean();

  return data;
};
