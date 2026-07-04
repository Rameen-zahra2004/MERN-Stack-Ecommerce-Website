import jwt from "jsonwebtoken";
import env from "../config/env.js";


const buildPayload = (userId, type) => {
  return {
    id: userId,
    type, // access | refresh
  };
};


export const generateAccessToken = (userId) => {
  try {
    return jwt.sign(buildPayload(userId, "access"), env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN || "15m",
    });
  } catch (error) {
    throw new Error("Failed to generate access token");
  }
};


export const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(buildPayload(userId, "refresh"), env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  } catch (error) {
    throw new Error("Failed to generate refresh token");
  }
};
