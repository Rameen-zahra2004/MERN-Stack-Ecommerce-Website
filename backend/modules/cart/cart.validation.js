import Joi from "joi";

export const addToCartValidation =
  Joi.object({
    productId: Joi.string()
      .required(),

    quantity: Joi.number()
      .min(1)
      .required(),
  });

export const updateCartValidation =
  Joi.object({
    quantity: Joi.number()
      .min(1)
      .required(),
  });