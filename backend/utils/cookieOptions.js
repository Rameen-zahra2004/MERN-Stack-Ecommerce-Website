import env from "../config/env.js";

/*
=========================
BASE COOKIE SECURITY OPTIONS
=========================
*/

const isProduction =
  env.NODE_ENV === "production";

/*
=========================
ACCESS TOKEN COOKIE
=========================
*/

export const accessCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
  path: "/",

  /*
  =========================
  15 MINUTES
  =========================
  */
  maxAge: 15 * 60 * 1000,
};

/*
=========================
REFRESH TOKEN COOKIE
=========================
*/

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
  path: "/",

  /*
  =========================
  7 DAYS
  =========================
  */
  maxAge: 7 * 24 * 60 * 60 * 1000,
};