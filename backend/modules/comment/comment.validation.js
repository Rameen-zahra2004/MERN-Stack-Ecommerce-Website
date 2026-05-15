import Joi from "joi";

export const createCommentValidation =
  Joi.object({
    productId: Joi.string()
      .required(),

    text: Joi.string()
      .min(1)
      .max(500)
      .required(),

    rating: Joi.number()
      .min(1)
      .max(5)
      .optional(),

    parentComment: Joi.string()
      .optional(),
  });

export const updateCommentValidation =
  Joi.object({
    text: Joi.string()
      .min(1)
      .max(500)
      .required(),

    rating: Joi.number()
      .min(1)
      .max(5)
      .optional(),
  });