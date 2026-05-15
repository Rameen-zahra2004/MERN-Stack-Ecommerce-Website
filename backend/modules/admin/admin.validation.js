import Joi from "joi";

export const createAdminValidation =
  Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),

    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
      .min(6)
      .required(),

    role: Joi.string()
      .valid(
        "SUPER_ADMIN",
        "ADMIN",
        "MODERATOR"
      )
      .optional(),

    permissions: Joi.array()
      .items(Joi.string())
      .optional(),

    phone: Joi.string().optional(),

    avatar: Joi.string().optional(),
  });

export const updateAdminValidation =
  Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .optional(),

    role: Joi.string()
      .valid(
        "SUPER_ADMIN",
        "ADMIN",
        "MODERATOR"
      )
      .optional(),

    permissions: Joi.array()
      .items(Joi.string())
      .optional(),

    isActive: Joi.boolean()
      .optional(),

    phone: Joi.string().optional(),

    avatar: Joi.string().optional(),
  });