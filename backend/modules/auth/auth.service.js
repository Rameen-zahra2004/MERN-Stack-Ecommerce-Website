import User from "../user/User.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateCryptoToken,
  hashToken,
  attachAuthCookies,
  clearAuthCookies,
} from "./authUtils.js";
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "./mail/mail.service.js";

const VERIFICATION_EXPIRES_HOURS = 24;
const RESET_EXPIRES_HOURS = 1;

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const { rawToken, hashedToken } = generateCryptoToken();
  const expiryDate = new Date(
    Date.now() + VERIFICATION_EXPIRES_HOURS * 60 * 60 * 1000,
  );

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: expiryDate,
  });

  Promise.allSettled([
    sendWelcomeEmail({ to: email, firstName }),
    sendVerificationEmail({
      to: email,
      firstName,
      verificationToken: rawToken,
    }),
  ]).then((results) => {
    results.forEach((r) => {
      if (r.status === "rejected") {
        console.error("[Auth] Email send failed:", r.reason?.message);
      }
    });
  });

  return { id: user._id, firstName: user.firstName, email: user.email };
};

export const verifyEmail = async (rawToken) => {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    const error = new Error("Verification link is invalid or has expired.");
    error.statusCode = 400;
    throw error;
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return { email: user.email };
};

export const loginUser = async (res, { email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  const invalidCredentialsError = () => {
    const e = new Error("Invalid email or password.");
    e.statusCode = 401;
    return e;
  };

  if (!user) throw invalidCredentialsError();

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw invalidCredentialsError();

  if (!user.isEmailVerified) {
    const error = new Error(
      "Please verify your email address before logging in. Check your inbox.",
    );
    error.statusCode = 403;
    error.code = "EMAIL_NOT_VERIFIED";
    throw error;
  }

  if (!user.isActive) {
    const error = new Error(
      "Your account has been suspended. Contact support.",
    );
    error.statusCode = 403;
    error.code = "ACCOUNT_SUSPENDED";
    throw error;
  }

  const tokenPayload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // FIX (C2): store HASHED refresh token only, never the raw JWT
  user.refreshToken = hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  attachAuthCookies(res, { accessToken, refreshToken });

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
};

export const refreshAccessToken = async (res, incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    const error = new Error("No refresh token provided.");
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    const error = new Error(
      "Refresh token is invalid or expired. Please log in again.",
    );
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  // FIX (C2): compare against the HASHED incoming token
  if (!user || user.refreshToken !== hashToken(incomingRefreshToken)) {
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
    clearAuthCookies(res);
    const error = new Error("Refresh token mismatch. Please log in again.");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Account suspended.");
    error.statusCode = 403;
    throw error;
  }

  const tokenPayload = { id: user._id, role: user.role };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  // FIX (C2): rotate with a HASHED token
  user.refreshToken = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  attachAuthCookies(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });

  return { id: user._id, firstName: user.firstName, role: user.role };
};

export const logoutUser = async (res, userId) => {
  if (userId) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: "" } });
  }
  clearAuthCookies(res);
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user || !user.isEmailVerified) return;

  const { rawToken, hashedToken } = generateCryptoToken();
  const expiryDate = new Date(
    Date.now() + RESET_EXPIRES_HOURS * 60 * 60 * 1000,
  );

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expiryDate;
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail({
      to: user.email,
      firstName: user.firstName,
      resetToken: rawToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // FIX (M1): log the real failure reason
    console.error("[Auth] Password reset email failed:", err.message);

    const error = new Error(
      "Failed to send password reset email. Please try again.",
    );
    error.statusCode = 500;
    throw error;
  }
};

export const resetPassword = async (res, { rawToken, password }) => {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires +refreshToken");

  if (!user) {
    const error = new Error("Password reset link is invalid or has expired.");
    error.statusCode = 400;
    throw error;
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  clearAuthCookies(res);

  sendPasswordChangedEmail({ to: user.email, firstName: user.firstName }).catch(
    (err) =>
      console.error("[Auth] Password changed email failed:", err.message),
  );

  return { email: user.email };
};

export const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email }).select(
    "+emailVerificationToken +emailVerificationExpires",
  );

  if (!user || user.isEmailVerified) return;

  const { rawToken, hashedToken } = generateCryptoToken();
  const expiryDate = new Date(
    Date.now() + VERIFICATION_EXPIRES_HOURS * 60 * 60 * 1000,
  );

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expiryDate;
  await user.save({ validateBeforeSave: false });

  sendVerificationEmail({
    to: user.email,
    firstName: user.firstName,
    verificationToken: rawToken,
  }).catch((err) =>
    console.error("[Auth] Resend verification email failed:", err.message),
  );
};

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  return user;
};
