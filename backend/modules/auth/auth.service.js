import User from "../user/user.model.js";

import bcrypt from "bcryptjs";

import {
  AUTH_MESSAGES,
} from "./auth.constants.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./auth.tokens.js";

import {
  sanitizeUser,
} from "./authUtils.js";

/*
=========================
REGISTER USER
=========================
*/

export const registerService =
  async (payload) => {
    const existingUser =
      await User.findOne({
        email: payload.email,
      });

    if (existingUser) {
      throw new Error(
        AUTH_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        payload.password,
        12
      );

    const user =
      await User.create({
        ...payload,
        password: hashedPassword,
      });

    const accessToken =
      generateAccessToken({
        id: user._id,
        role: user.role,
      });

    const refreshToken =
      generateRefreshToken({
        id: user._id,
      });

    user.refreshToken =
      refreshToken;

    await user.save();

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  };

/*
=========================
LOGIN USER
=========================
*/

export const loginService =
  async ({
    email,
    password,
  }) => {
    const user =
      await User.findOne({
        email,
      }).select(
        "+password +refreshToken"
      );

    if (!user) {
      throw new Error(
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    if (!user.isActive) {
      throw new Error(
        AUTH_MESSAGES.ACCOUNT_DISABLED
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      throw new Error(
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    const accessToken =
      generateAccessToken({
        id: user._id,
        role: user.role,
      });

    const refreshToken =
      generateRefreshToken({
        id: user._id,
      });

    user.refreshToken =
      refreshToken;

    user.lastLogin =
      new Date();

    await user.save();

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  };

/*
=========================
LOGOUT USER
=========================
*/

export const logoutService =
  async (userId) => {
    await User.findByIdAndUpdate(
      userId,
      {
        refreshToken: null,
      }
    );

    return true;
  };
