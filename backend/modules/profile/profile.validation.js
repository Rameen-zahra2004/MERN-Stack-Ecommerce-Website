import Joi from "joi";

export const updateProfileValidation =
  Joi.object({
    avatar: Joi.string().optional(),

    bio: Joi.string()
      .max(300)
      .optional(),

    phone: Joi.string().optional(),

    gender: Joi.string().valid(
      "MALE",
      "FEMALE",
      "OTHER"
    ),

    dateOfBirth: Joi.date().optional(),

    socialLinks: Joi.object({
      facebook: Joi.string().optional(),
      instagram: Joi.string().optional(),
      twitter: Joi.string().optional(),
      linkedin: Joi.string().optional(),
    }).optional(),
  });

export const addAddressValidation =
  Joi.object({
    label: Joi.string().valid(
      "HOME",
      "OFFICE",
      "OTHER"
    ),

    fullName: Joi.string().required(),

    phone: Joi.string().required(),

    addressLine:
      Joi.string().required(),

    city: Joi.string().required(),

    state: Joi.string().required(),

    postalCode:
      Joi.string().required(),

    country: Joi.string().required(),

    isDefault: Joi.boolean(),
  });