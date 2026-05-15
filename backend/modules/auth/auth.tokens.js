import jwt from "jsonwebtoken";

/*
=========================
GENERATE ACCESS TOKEN
=========================
*/

export const generateAccessToken =
  (payload) => {
    return jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );
  };

/*
=========================
GENERATE REFRESH TOKEN
=========================
*/

export const generateRefreshToken =
  (payload) => {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
  };

/*
=========================
VERIFY ACCESS TOKEN
=========================
*/

export const verifyAccessToken =
  (token) => {
    return jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );
  };