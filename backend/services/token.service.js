import jwt from "jsonwebtoken";
import env from "../config/env.js";

/*
=========================
TOKEN PAYLOAD BUILDER
=========================
*/

const buildPayload = (userId, type) => {
  return {
    id: userId,
    // keep type field intentionally unused by auth middleware
    // (avoid changing token expiry/secret/cookie logic)
    type, // access | refresh
  };
};

/*
=========================
ACCESS TOKEN (SHORT-LIVED)
=========================
*/

export const generateAccessToken = (userId) => {
  try {
    return jwt.sign(buildPayload(userId, "access"), env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN || "15m",
    });
  } catch (error) {
    throw new Error("Failed to generate access token");
  }
};

/*
=========================
REFRESH TOKEN (LONG-LIVED)
=========================
*/

export const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(buildPayload(userId, "refresh"), env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  } catch (error) {
    throw new Error("Failed to generate refresh token");
  }
};
