import jwt from "jsonwebtoken";

import env from "../../config/env.js";

/*
=========================
GENERATE ACCESS TOKEN
=========================
*/

export const generateAccessToken = (
  payload
) => {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

/*
=========================
GENERATE REFRESH TOKEN
=========================
*/

export const generateRefreshToken = (
  payload
) => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        env.JWT_REFRESH_EXPIRES_IN,
    }
  );
};

/*
=========================
VERIFY ACCESS TOKEN
=========================
*/

export const verifyAccessToken = (
  token
) => {
  return jwt.verify(
    token,
    env.JWT_SECRET
  );
};

/*
=========================
VERIFY REFRESH TOKEN
=========================
*/

export const verifyRefreshToken = (
  token
) => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  );
};