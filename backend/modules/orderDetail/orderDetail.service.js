import OrderDetail from "./orderDetail.model.js";

import {
  buildOrderDetailPayload,
} from "./orderDetail.utils.js";

/*
=========================
CREATE BULK ORDER DETAILS
=========================
*/

export const createOrderDetailService =
  async (
    orderId,
    userId,
    items
  ) => {
    const payload =
      buildOrderDetailPayload(
        orderId,
        userId,
        items
      );

    return await OrderDetail.insertMany(
      payload
    );
  };

/*
=========================
GET BY ORDER ID
=========================
*/

export const getOrderDetailByOrderService =
  async (orderId) => {
    const data =
      await OrderDetail.find({
        order: orderId,
      })
        .populate(
          "product",
          "name price images stock"
        )
        .lean();

    return data;
  };

/*
=========================
GET USER ORDER ITEMS (ANALYTICS READY)
=========================
*/

export const getUserOrderDetailsService =
  async (userId) => {
    const data =
      await OrderDetail.find({
        user: userId,
      })
        .populate(
          "product",
          "name price"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return data;
  };