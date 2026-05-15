import Joi from "joi";

export const createApiKeyValidation =
  Joi.object({
    name: Joi.string()
      .max(100)
      .required(),

    permissions: Joi.array()
      .items(Joi.string())
      .optional(),

    environment: Joi.string()
      .valid(
        "development",
        "staging",
        "production"
      )
      .optional(),

    rateLimit: Joi.number()
      .min(1)
      .optional(),

    expiresAt: Joi.date()
      .optional(),
  });