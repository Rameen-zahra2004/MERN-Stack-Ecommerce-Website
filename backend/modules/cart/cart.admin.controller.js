import {
  getAllCartsService,
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from "./cart.service.js";

import {
  addToCartValidation,
  updateCartValidation,
} from "./cart.validation.js";

import { CART_MESSAGES } from "./cart.constants.js";

export const getAllCartsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await getAllCartsService({ page, limit });

    return res.status(200).json({
      success: true,
      message: CART_MESSAGES.FETCH_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCartByUserIdController = async (req, res, next) => {
  try {
    const result = await getCartService(req.params.userId);

    return res.status(200).json({
      success: true,
      message: CART_MESSAGES.FETCH_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminAddToCartController = async (req, res, next) => {
  try {
    const { error, value } = addToCartValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const result = await addToCartService(
      req.params.userId,
      value.productId,
      value.quantity,
    );

    return res.status(200).json({
      success: true,
      message: CART_MESSAGES.ADD_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateCartItemController = async (req, res, next) => {
  try {
    const { error, value } = updateCartValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const result = await updateCartItemService(
      req.params.userId,
      req.params.productId,
      value.quantity,
    );

    return res.status(200).json({
      success: true,
      message: CART_MESSAGES.UPDATE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminRemoveCartItemController = async (req, res, next) => {
  try {
    const result = await removeCartItemService(
      req.params.userId,
      req.params.productId,
    );

    return res.status(200).json({
      success: true,
      message: CART_MESSAGES.REMOVE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminClearCartController = async (req, res, next) => {
  try {
    const result = await clearCartService(req.params.userId);

    return res.status(200).json({
      success: true,
      message: CART_MESSAGES.CLEAR_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
