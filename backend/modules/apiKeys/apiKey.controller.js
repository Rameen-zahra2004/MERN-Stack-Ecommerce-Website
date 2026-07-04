import {
  getApiKeysService,
  getSingleApiKeyService,
  createApiKeyService,
  deleteApiKeyService,
} from "./apiKeys.service.js";

import { createApiKeyValidation } from "./apiKey.validation.js";

import { API_KEY_MESSAGES } from "./apiKey.constants.js";


export const getApiKeysController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const result = await getApiKeysService({ page, limit });

    return res.status(200).json({
      success: true,
      message: API_KEY_MESSAGES.FETCH_SUCCESS,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};


export const getSingleApiKeyController = async (req, res, next) => {
  try {
    const result = await getSingleApiKeyService(req.params.id);

    return res.status(200).json({
      success: true,
      message: API_KEY_MESSAGES.FETCH_SINGLE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const createApiKeyController = async (req, res, next) => {
  try {
    const { error, value } = createApiKeyValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const result = await createApiKeyService(value, req.user?._id);

    return res.status(201).json({
      success: true,
      message: API_KEY_MESSAGES.CREATE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteApiKeyController = async (req, res, next) => {
  try {
    const result = await deleteApiKeyService(req.params.id);

    return res.status(200).json({
      success: true,
      message: API_KEY_MESSAGES.DELETE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
