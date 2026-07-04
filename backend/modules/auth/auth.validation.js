import Joi from "joi";

/**
 * auth.validation.js
 * All request body validation schemas for The 999 Boxs auth module.
 * Using Joi for strict, declarative validation.
 * Controllers call these before passing to service layer.
 */

// ─── SHARED RULES ─────────────────────────────────────────────────────────────

const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#\-_])[A-Za-z\d@$!%*?&^#\-_]+$/,
  )
  .messages({
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password must not exceed 128 characters.",
    "string.pattern.base":
      "Password must contain uppercase, lowercase, number, and special character.",
    "any.required": "Password is required.",
  });

const email = Joi.string().email().lowercase().trim().max(255).messages({
  "string.email": "Please enter a valid email address.",
  "any.required": "Email is required.",
});

const name = Joi.string()
  .trim()
  .min(1)
  .max(80)
  .pattern(/^[a-zA-Z\s'-]+$/)
  .messages({
    "string.pattern.base":
      "Name can only contain letters, spaces, hyphens, and apostrophes.",
  });

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────

export const registerSchema = Joi.object({
  firstName: name.required().label("First name"),
  lastName: name.required().label("Last name"),
  email: email.required(),
  password: password.required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match." }),
});

export const loginSchema = Joi.object({
  email: email.required(),
  password: Joi.string()
    .required()
    .messages({ "any.required": "Password is required." }),
});

export const forgotPasswordSchema = Joi.object({
  email: email.required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().hex().length(64).required().messages({
    "string.length": "Invalid reset token.",
    "string.hex": "Invalid reset token format.",
  }),
  password: password.required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match." }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required.",
  }),
  newPassword: password.required().label("New password"),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Passwords do not match." }),
});

// ─── VALIDATION UTILITY ───────────────────────────────────────────────────────

/**
 * Validate request body against a Joi schema.
 * Returns { error, value } — error is null on success.
 */
export const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false, // Return ALL errors at once
    stripUnknown: true, // Strip fields not in schema
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join("."),
      message: d.message.replace(/['"]/g, ""),
    }));
    return { errors, value: null };
  }

  return { errors: null, value };
};
