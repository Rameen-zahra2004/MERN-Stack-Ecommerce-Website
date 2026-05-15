import Joi from "joi";

export const createProductValidation =
  Joi.object({
    name: Joi.string()
      .min(3)
      .max(200)
      .required(),

    description: Joi.string()
      .required(),

    price: Joi.number()
      .min(0)
      .required(),

    stock: Joi.number()
      .min(0)
      .required(),

    category: Joi.string().required(),

    brand: Joi.string().optional(),

    images: Joi.array()
      .items(Joi.string())
      .optional(),

    tags: Joi.array()
      .items(Joi.string())
      .optional(),
  });