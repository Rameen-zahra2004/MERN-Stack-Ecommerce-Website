import Joi from "joi";

export const createProductValidation = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  category: Joi.string().required(),
  brand: Joi.string().optional(),
  comparePrice: Joi.number().min(0).optional(), // ← added
  sku: Joi.string().optional(), // ← added
  isFeatured: Joi.boolean().optional(), // ← added
  tags: Joi.array().items(Joi.string()).optional(),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        filename: Joi.string().optional(),
        mimeType: Joi.string().optional(),
        size: Joi.number().optional(),
        isPrimary: Joi.boolean().optional(),
        order: Joi.number().optional(),
      }),
    )
    .optional(),
});
