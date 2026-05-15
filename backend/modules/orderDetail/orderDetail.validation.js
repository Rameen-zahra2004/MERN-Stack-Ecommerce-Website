import Joi from "joi";

/*
=========================
VALIDATION (FUTURE EXTENSIBILITY)
=========================
*/

export const getOrderDetailValidation =
  Joi.object({
    orderId: Joi.string().required(),
  });