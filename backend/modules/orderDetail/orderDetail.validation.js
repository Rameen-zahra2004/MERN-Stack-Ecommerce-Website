import Joi from "joi";


export const getOrderDetailValidation =
  Joi.object({
    orderId: Joi.string().required(),
  });