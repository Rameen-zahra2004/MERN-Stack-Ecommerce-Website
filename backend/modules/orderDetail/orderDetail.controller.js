import {
  getOrderDetailByOrderService,
  getUserOrderDetailsService,
} from "./orderDetail.service.js";

import {
  ORDER_DETAIL_MESSAGES,
} from "./orderDetail.constants.js";


export const getOrderDetailsController =
  async (req, res, next) => {
    try {
      const data =
        await getOrderDetailByOrderService(
          req.params.orderId
        );

      return res.status(200).json({
        success: true,
        message:
          ORDER_DETAIL_MESSAGES.FETCH_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };


export const getUserOrderDetailsController =
  async (req, res, next) => {
    try {
      const data =
        await getUserOrderDetailsService(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        message:
          ORDER_DETAIL_MESSAGES.USER_HISTORY_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };