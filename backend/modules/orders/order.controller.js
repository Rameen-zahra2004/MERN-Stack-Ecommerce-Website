import {
  cancelOrderService,
  createOrderService,
  getOrdersService,
  getSingleOrderService,
} from "./order.service.js";

import {
  createOrderValidation,
} from "./order.validation.js";

import {
  ORDER_MESSAGES,
} from "./order.constants.js";

/*
=========================
CREATE ORDER
=========================
*/

export const createOrderController =
  async (req, res, next) => {
    try {
      const { error, value } =
        createOrderValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map(
            (e) => e.message
          ),
        });
      }

      const result =
        await createOrderService(
          req.user._id,
          value.paymentMethod,
          value.shippingAddress
        );

      return res.status(201).json({
        success: true,
        message:
          ORDER_MESSAGES.CREATED_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
GET ORDERS
=========================
*/

export const getOrdersController =
  async (req, res, next) => {
    try {
      const result =
        await getOrdersService(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        message:
          ORDER_MESSAGES.FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
GET SINGLE ORDER
=========================
*/

export const getSingleOrderController =
  async (req, res, next) => {
    try {
      const result =
        await getSingleOrderService(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          ORDER_MESSAGES.FETCH_SINGLE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
CANCEL ORDER
=========================
*/

export const cancelOrderController =
  async (req, res, next) => {
    try {
      const result =
        await cancelOrderService(
          req.params.id,
          req.user._id
        );

      return res.status(200).json({
        success: true,
        message:
          ORDER_MESSAGES.CANCEL_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };