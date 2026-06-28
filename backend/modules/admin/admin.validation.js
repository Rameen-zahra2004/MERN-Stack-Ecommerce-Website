import Joi from "joi";

export const createAdminValidation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  avatar: Joi.string().optional(),
});

export const updateAdminValidation = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  isActive: Joi.boolean().optional(),
  phone: Joi.string().optional(),
  avatar: Joi.string().optional(),
});

export const loginAdminValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
