import nodemailer from "nodemailer";

/**
 * mail.config.js
 * Nodemailer transporter — supports Gmail SMTP (dev) and production SMTP providers.
 * Switch to SendGrid / SES in production by changing env vars only.
 */
const createTransporter = () => {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Production: use SendGrid / AWS SES / Mailgun via SMTP relay
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true, // Reuse connections
      maxConnections: 5,
      maxMessages: 100,
    });
  }

  // Development: Gmail SMTP with App Password
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App Password — NOT your Gmail password
    },
  });
};

export const transporter = createTransporter();

// Verify transporter on startup (non-blocking)
transporter.verify((error) => {
  if (error) {
    console.error("[Mail] Transporter verification failed:", error.message);
  } else {
    console.info("[Mail] Transporter ready ✓");
  }
});
