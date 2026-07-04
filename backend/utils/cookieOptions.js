import env from "../config/env.js";


const isProduction =
  env.NODE_ENV === "production";


export const accessCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
  path: "/",

  maxAge: 15 * 60 * 1000,
};


export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
  path: "/",

  maxAge: 7 * 24 * 60 * 60 * 1000,
};