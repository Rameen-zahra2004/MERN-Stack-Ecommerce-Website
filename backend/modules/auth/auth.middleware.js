import User from "../user/user.model.js";

import {
  AUTH_MESSAGES,
} from "./auth.constants.js";

import {
  verifyAccessToken,
} from "./auth.tokens.js";

/*
=========================
AUTHENTICATE USER
=========================
*/

const authenticate =
  async (req, res, next) => {
    try {
      let token;

      /*
      =========================
      GET TOKEN
      =========================
      */

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith(
          "Bearer"
        )
      ) {
        token =
          req.headers.authorization.split(
            " "
          )[1];
      } else if (
        req.cookies?.accessToken
      ) {
        token =
          req.cookies.accessToken;
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message:
            AUTH_MESSAGES.TOKEN_REQUIRED,
        });
      }

      /*
      =========================
      VERIFY TOKEN
      =========================
      */

      const decoded =
        verifyAccessToken(token);

      const user =
        await User.findById(
          decoded.id
        ).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            AUTH_MESSAGES.USER_NOT_FOUND,
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message:
            AUTH_MESSAGES.ACCOUNT_DISABLED,
        });
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          AUTH_MESSAGES.INVALID_TOKEN,
      });
    }
  };

export default authenticate;
