import Joi from "joi";

export const createActivityLogValidation =
  Joi.object({
    user: Joi.string().optional(),

    action: Joi.string()
      .trim()
      .max(200)
      .required(),

    module: Joi.string()
      .trim()
      .max(100)
      .required(),

    method: Joi.string()
      .valid(
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
      )
      .required(),

    endpoint: Joi.string()
      .trim()
      .required(),

    ipAddress: Joi.string().optional(),

    userAgent: Joi.string().optional(),

    statusCode: Joi.number()
      .min(100)
      .max(599)
      .optional(),

    metadata: Joi.object().optional(),
  });