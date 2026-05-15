import {
  loginService,
  logoutService,
  registerService,
} from "./auth.service.js";

import {
  AUTH_MESSAGES,
} from "./auth.constants.js";

import {
  loginValidation,
  registerValidation,
} from "./auth.validation.js";

import {
  accessCookieOptions,
  refreshCookieOptions,
} from "./auth.cookies.js";

/*
=========================
REGISTER
=========================
*/

export const registerController =
  async (req, res, next) => {
    try {
      const { error, value } =
        registerValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map(
            (err) => err.message
          ),
        });
      }

      const result =
        await registerService(value);

      res.cookie(
        "accessToken",
        result.accessToken,
        accessCookieOptions
      );

      res.cookie(
        "refreshToken",
        result.refreshToken,
        refreshCookieOptions
      );

      return res.status(201).json({
        success: true,
        message:
          AUTH_MESSAGES.REGISTER_SUCCESS,
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
LOGIN
=========================
*/

export const loginController =
  async (req, res, next) => {
    try {
      const { error, value } =
        loginValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map(
            (err) => err.message
          ),
        });
      }

      const result =
        await loginService(value);

      res.cookie(
        "accessToken",
        result.accessToken,
        accessCookieOptions
      );

      res.cookie(
        "refreshToken",
        result.refreshToken,
        refreshCookieOptions
      );

      return res.status(200).json({
        success: true,
        message:
          AUTH_MESSAGES.LOGIN_SUCCESS,
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
LOGOUT
=========================
*/

export const logoutController =
  async (req, res, next) => {
    try {
      await logoutService(
        req.user._id
      );

      res.clearCookie(
        "accessToken"
      );

      res.clearCookie(
        "refreshToken"
      );

      return res.status(200).json({
        success: true,
        message:
          AUTH_MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };