/**
 * mail.templates.js
 * All HTML email templates for The 999 Boxs platform.
 * Each template returns a { subject, html } object.
 * Inline CSS only — email clients strip <style> blocks.
 */

const BASE_URL = process.env.CLIENT_URL || "http://localhost:5173";
const BRAND_COLOR = "#0f172a";
const ACCENT_COLOR = "#6366f1";
const BG_COLOR = "#f8fafc";
const CARD_BG = "#ffffff";
const TEXT_MUTED = "#64748b";

const baseWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>The 999 Boxs</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:${CARD_BG};border-radius:12px;overflow:hidden;
                 box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${BRAND_COLOR};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">
                📦 The 999 Boxs
              </h1>
              <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Premium E-Commerce Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${BG_COLOR};padding:24px 40px;text-align:center;
                        border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:${TEXT_MUTED};font-size:12px;">
                © ${new Date().getFullYear()} The 999 Boxs. All rights reserved.<br/>
                If you did not request this email, please ignore it.
              </p>
              <p style="margin:8px 0 0;">
                <a href="${BASE_URL}/privacy" style="color:${ACCENT_COLOR};font-size:12px;text-decoration:none;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="${BASE_URL}/terms" style="color:${ACCENT_COLOR};font-size:12px;text-decoration:none;">Terms of Service</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const ctaButton = (href, label) => `
  <a href="${href}"
     style="display:inline-block;background:${ACCENT_COLOR};color:#ffffff;
            text-decoration:none;padding:14px 32px;border-radius:8px;
            font-size:15px;font-weight:600;margin:24px 0;letter-spacing:0.3px;">
    ${label}
  </a>
`;

const divider = () =>
  `<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />`;

const linkFallback = (href) => `
  <p style="color:${TEXT_MUTED};font-size:12px;word-break:break-all;margin:8px 0 0;">
    Or copy this link: <a href="${href}" style="color:${ACCENT_COLOR};">${href}</a>
  </p>
`;

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

/**
 * Welcome email sent after successful registration.
 */
export const welcomeEmailTemplate = ({ firstName }) => ({
  subject: "Welcome to The 999 Boxs — Let's get started! 🎉",
  html: baseWrapper(`
    <h2 style="color:${BRAND_COLOR};font-size:22px;margin:0 0 8px;">
      Welcome, ${firstName}! 🎉
    </h2>
    <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.7;margin:0 0 20px;">
      We're excited to have you on board at <strong>The 999 Boxs</strong>.
      Your account has been created — please verify your email address to unlock
      full access to our platform.
    </p>
    ${divider()}
    <p style="color:${BRAND_COLOR};font-size:14px;font-weight:600;margin:0 0 8px;">
      What's next?
    </p>
    <ul style="color:${TEXT_MUTED};font-size:14px;line-height:2;padding-left:20px;margin:0;">
      <li>✅ Verify your email address</li>
      <li>🛍️ Browse thousands of premium products</li>
      <li>📦 Track your orders in real time</li>
      <li>🔐 Enjoy bank-level security on every transaction</li>
    </ul>
    ${divider()}
    <p style="color:${TEXT_MUTED};font-size:13px;margin:0;">
      Need help? Contact us at
      <a href="mailto:support@the999boxs.com" style="color:${ACCENT_COLOR};">
        support@the999boxs.com
      </a>
    </p>
  `),
});

/**
 * Email verification link sent after registration.
 * Token expires in 24 hours.
 */
export const verificationEmailTemplate = ({ firstName, verificationToken }) => {
  const verificationUrl = `${BASE_URL}/verify-email?token=${verificationToken}`;
  return {
    subject: "Verify your email — The 999 Boxs",
    html: baseWrapper(`
      <h2 style="color:${BRAND_COLOR};font-size:22px;margin:0 0 8px;">
        Verify your email address
      </h2>
      <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.7;margin:0 0 4px;">
        Hi <strong>${firstName}</strong>,
      </p>
      <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.7;margin:0 0 20px;">
        Click the button below to verify your email address and activate your account.
        This link expires in <strong>24 hours</strong>.
      </p>
      <div style="text-align:center;">
        ${ctaButton(verificationUrl, "Verify Email Address")}
      </div>
      ${linkFallback(verificationUrl)}
      ${divider()}
      <p style="color:${TEXT_MUTED};font-size:13px;margin:0;">
        If you did not create an account, you can safely ignore this email.
      </p>
    `),
  };
};

/**
 * Password reset email. Token expires in 1 hour.
 */
export const passwordResetEmailTemplate = ({ firstName, resetToken }) => {
  const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;
  return {
    subject: "Reset your password — The 999 Boxs",
    html: baseWrapper(`
      <h2 style="color:${BRAND_COLOR};font-size:22px;margin:0 0 8px;">
        Reset your password 🔑
      </h2>
      <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.7;margin:0 0 4px;">
        Hi <strong>${firstName}</strong>,
      </p>
      <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.7;margin:0 0 20px;">
        We received a request to reset your password. Click the button below to
        choose a new password. This link expires in <strong>1 hour</strong>.
      </p>
      <div style="text-align:center;">
        ${ctaButton(resetUrl, "Reset My Password")}
      </div>
      ${linkFallback(resetUrl)}
      ${divider()}
      <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin-top:8px;">
        <p style="color:#92400e;font-size:13px;margin:0;font-weight:600;">
          ⚠️ Security Notice
        </p>
        <p style="color:#92400e;font-size:13px;margin:6px 0 0;">
          If you did not request a password reset, please secure your account
          immediately by contacting our support team.
        </p>
      </div>
    `),
  };
};

/**
 * Password successfully changed — security notification.
 */
export const passwordChangedEmailTemplate = ({ firstName }) => ({
  subject: "Your password has been changed — The 999 Boxs",
  html: baseWrapper(`
    <h2 style="color:${BRAND_COLOR};font-size:22px;margin:0 0 8px;">
      Password changed successfully ✓
    </h2>
    <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.7;margin:0 0 20px;">
      Hi <strong>${firstName}</strong>, your password was just changed.
      If this was you, no action is needed.
    </p>
    <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;">
      <p style="color:#92400e;font-size:13px;margin:0;">
        ⚠️ If you did NOT make this change, contact support immediately at
        <a href="mailto:support@the999boxs.com" style="color:#92400e;font-weight:600;">
          support@the999boxs.com
        </a>
      </p>
    </div>
  `),
});
