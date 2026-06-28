import dotenv from "dotenv";

dotenv.config();

/*
=========================
ENV HELPERS
=========================
*/

const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
};

const toNumber = (value, fallback) => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

/*
=========================
ENV CONFIG
=========================
*/

const env = {
  /*
  =========================
  CORE
  =========================
  */
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: toNumber(process.env.PORT, 5000),

  CLIENT_URL: required("CLIENT_URL"),

  MONGO_URI: required("MONGO_URI"),

  /*
  =========================
  JWT
  =========================
  */
  JWT_SECRET: required("JWT_SECRET"),

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),

  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),

  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  /*
  =========================
  COOKIE
  =========================
  */
  COOKIE_SECRET: required("COOKIE_SECRET"),

  COOKIE_EXPIRES_IN: process.env.COOKIE_EXPIRES_IN || "7d",

  /*
  =========================
  SECURITY
  =========================
  */
  BCRYPT_SALT_ROUNDS: toNumber(process.env.BCRYPT_SALT_ROUNDS, 10),

  RATE_LIMIT_WINDOW_MS: toNumber(
    process.env.RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
  ),

  RATE_LIMIT_MAX_REQUESTS: toNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),

  /*
  =========================
  CORS
  =========================
  */
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};

export default env;
