import { transporter } from "./mail.config.js";
import {
  welcomeEmailTemplate,
  verificationEmailTemplate,
  passwordResetEmailTemplate,
  passwordChangedEmailTemplate,
} from "./mail.templates.js";

/**
 * mail.service.js
 * Centralised email sending layer for The 999 Boxs authentication system.
 * All methods are async and throw on failure — callers should handle errors.
 */

const FROM_ADDRESS = `"The 999 Boxs" <${process.env.GMAIL_USER || process.env.SMTP_USER}>`;

/**
 * Core send utility — all public methods delegate here.
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - rendered HTML body
 */
const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
  });
  console.info(
    `[Mail] Sent "${subject}" → ${to} (messageId: ${info.messageId})`,
  );
  return info;
};

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Send welcome email after registration.
 */
export const sendWelcomeEmail = async ({ to, firstName }) => {
  const { subject, html } = welcomeEmailTemplate({ firstName });
  return sendEmail(to, subject, html);
};

/**
 * Send email verification link.
 * @param {string} verificationToken - signed JWT or crypto token
 */
export const sendVerificationEmail = async ({
  to,
  firstName,
  verificationToken,
}) => {
  const { subject, html } = verificationEmailTemplate({
    firstName,
    verificationToken,
  });
  return sendEmail(to, subject, html);
};

/**
 * Send password reset link.
 * @param {string} resetToken - hashed reset token stored in DB
 */
export const sendPasswordResetEmail = async ({ to, firstName, resetToken }) => {
  const { subject, html } = passwordResetEmailTemplate({
    firstName,
    resetToken,
  });
  return sendEmail(to, subject, html);
};

/**
 * Security notification after successful password change.
 */
export const sendPasswordChangedEmail = async ({ to, firstName }) => {
  const { subject, html } = passwordChangedEmailTemplate({ firstName });
  return sendEmail(to, subject, html);
};
