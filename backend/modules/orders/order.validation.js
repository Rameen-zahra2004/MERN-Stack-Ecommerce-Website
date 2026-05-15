import Joi from "joi";

export const createOrderValidation =
  Joi.object({
    paymentMethod: Joi.string()
      .valid(
        "COD",
        "CARD",
        "JAZZCASH"
      )
      .required(),

    shippingAddress: Joi.object()
      .required(),
  });