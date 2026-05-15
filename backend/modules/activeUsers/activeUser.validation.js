import Joi from "joi";

export const createActiveUserValidation = Joi.object({
  count: Joi.number()
    .min(0)
    .required(),

  recordedAt: Joi.date().optional(),
});