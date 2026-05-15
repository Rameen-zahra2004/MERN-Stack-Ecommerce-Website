import {
  addToCartService,
  clearCartService,
  getCartService,
  removeCartItemService,
  updateCartItemService,
} from "./cart.service.js";

import {
  addToCartValidation,
  updateCartValidation,
} from "./cart.validation.js";

import {
  CART_MESSAGES,
} from "./cart.constants.js";

/*
=========================
GET CART
=========================
*/

export const getCartController =
  async (req, res, next) => {
    try {
      const result =
        await getCartService(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        message:
          CART_MESSAGES.FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
ADD TO CART
=========================
*/

export const addToCartController =
  async (req, res, next) => {
    try {
      const { error, value } =
        addToCartValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map(
            (err) => err.message
          ),
        });
      }

      const result =
        await addToCartService(
          req.user._id,
          value.productId,
          value.quantity
        );

      return res.status(200).json({
        success: true,
        message:
          CART_MESSAGES.ADD_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
UPDATE CART ITEM
=========================
*/

export const updateCartItemController =
  async (req, res, next) => {
    try {
      const { error, value } =
        updateCartValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map(
            (err) => err.message
          ),
        });
      }

      const result =
        await updateCartItemService(
          req.user._id,
          req.params.productId,
          value.quantity
        );

      return res.status(200).json({
        success: true,
        message:
          CART_MESSAGES.UPDATE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
REMOVE CART ITEM
=========================
*/

export const removeCartItemController =
  async (req, res, next) => {
    try {
      const result =
        await removeCartItemService(
          req.user._id,
          req.params.productId
        );

      return res.status(200).json({
        success: true,
        message:
          CART_MESSAGES.REMOVE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
CLEAR CART
=========================
*/

export const clearCartController =
  async (req, res, next) => {
    try {
      const result =
        await clearCartService(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        message:
          CART_MESSAGES.CLEAR_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };