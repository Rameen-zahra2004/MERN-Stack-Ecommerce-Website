// import Admin from "./Admin.model.js";
// import { ADMIN_MESSAGES } from "./admin.constants.js";
// import {
//   generateAccessToken,
//   generateRefreshToken,
//   hashToken,
//   attachAuthCookies,
//   clearAuthCookies,
// } from "../auth/authUtils.js";

// const MAX_LOGIN_ATTEMPTS = 5;
// const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// /* ===================== GET ADMINS ===================== */

// export const getAdminsService = async ({ page = 1, limit = 20 }) => {
//   const skip = (page - 1) * limit;

//   const [data, total] = await Promise.all([
//     Admin.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
//     Admin.countDocuments(),
//   ]);

//   return {
//     total,
//     page,
//     limit,
//     totalPages: Math.ceil(total / limit),
//     data,
//   };
// };

// /* ===================== GET SINGLE ADMIN ===================== */

// export const getSingleAdminService = async (id) => {
//   const admin = await Admin.findById(id).lean();
//   if (!admin) {
//     const error = new Error(ADMIN_MESSAGES.NOT_FOUND);
//     error.statusCode = 404;
//     throw error;
//   }
//   return admin;
// };

// /* ===================== CREATE ADMIN ===================== */

// export const createAdminService = async (payload) => {
//   const existingAdmin = await Admin.findOne({ email: payload.email });
//   if (existingAdmin) {
//     const error = new Error(ADMIN_MESSAGES.EMAIL_EXISTS);
//     error.statusCode = 409;
//     throw error;
//   }

//   const admin = await Admin.create(payload);
//   return admin;
// };

// /* ===================== UPDATE ADMIN ===================== */

// export const updateAdminService = async (id, payload) => {
//   const admin = await Admin.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });

//   if (!admin) {
//     const error = new Error(ADMIN_MESSAGES.NOT_FOUND);
//     error.statusCode = 404;
//     throw error;
//   }

//   return admin;
// };

// /* ===================== DELETE ADMIN ===================== */

// export const deleteAdminService = async (id) => {
//   const admin = await Admin.findByIdAndDelete(id);
//   if (!admin) {
//     const error = new Error(ADMIN_MESSAGES.NOT_FOUND);
//     error.statusCode = 404;
//     throw error;
//   }
//   return admin;
// };

// /* ===================== LOGIN ADMIN ===================== */

// export const loginAdminService = async (res, { email, password }) => {
//   const admin = await Admin.findOne({ email }).select(
//     "+password +refreshToken",
//   );

//   const invalidCredentialsError = () => {
//     const e = new Error("Invalid email or password.");
//     e.statusCode = 401;
//     return e;
//   };

//   if (!admin) throw invalidCredentialsError();

//   if (admin.lockUntil && admin.lockUntil > Date.now()) {
//     const error = new Error(
//       "Account temporarily locked due to too many failed attempts. Try again later.",
//     );
//     error.statusCode = 423;
//     throw error;
//   }

//   const isMatch = await admin.comparePassword(password);

//   if (!isMatch) {
//     admin.loginAttempts = (admin.loginAttempts || 0) + 1;

//     if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
//       admin.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
//       admin.loginAttempts = 0;
//     }

//     await admin.save({ validateBeforeSave: false });
//     throw invalidCredentialsError();
//   }

//   if (!admin.isActive) {
//     const error = new Error("Admin account has been deactivated.");
//     error.statusCode = 403;
//     error.code = "ACCOUNT_SUSPENDED";
//     throw error;
//   }

//   admin.loginAttempts = 0;
//   admin.lockUntil = null;

//   const tokenPayload = {
//     id: admin._id,
//     role: admin.role,
//     permissions: admin.permissions,
//   };

//   const accessToken = generateAccessToken(tokenPayload);
//   const refreshToken = generateRefreshToken(tokenPayload);

//   admin.refreshToken = hashToken(refreshToken);
//   admin.lastLogin = new Date();
//   await admin.save({ validateBeforeSave: false });

//   attachAuthCookies(res, {
//     accessToken,
//     refreshToken,
//     accessCookieName: "adminAccessToken",
//     refreshCookieName: "adminRefreshToken",
//   });

//   return {
//     id: admin._id,
//     name: admin.name,
//     email: admin.email,
//     role: admin.role,
//     permissions: admin.permissions,
//   };
// };

// /* ===================== LOGOUT ADMIN ===================== */

// export const logoutAdminService = async (res, adminId) => {
//   if (adminId) {
//     await Admin.findByIdAndUpdate(adminId, { $unset: { refreshToken: "" } });
//   }
//   clearAuthCookies(res, {
//     accessCookieName: "adminAccessToken",
//     refreshCookieName: "adminRefreshToken",
//   });
// };

// /* ===================== ONE-TIME BOOTSTRAP ===================== */

// export const seedFirstSuperAdmin = async ({ name, email, password }) => {
//   const existingCount = await Admin.countDocuments();

//   if (existingCount > 0) {
//     const error = new Error(
//       "Refused: at least one Admin already exists. Bootstrap only runs on an empty collection.",
//     );
//     error.statusCode = 409;
//     throw error;
//   }

//   const admin = await Admin.create({
//     name,
//     email,
//     password,
//     role: "SUPER_ADMIN",
//     permissions: [],
//   });

//   return { id: admin._id, email: admin.email, role: admin.role };
// };
import Admin from "./Admin.model.js";
import { ADMIN_MESSAGES } from "./admin.constants.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  attachAuthCookies,
  clearAuthCookies,
} from "../auth/authUtils.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/* ===================== GET ADMINS ===================== */

export const getAdminsService = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Admin.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Admin.countDocuments(),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data,
  };
};

/* ===================== GET SINGLE ADMIN ===================== */

export const getSingleAdminService = async (id) => {
  const admin = await Admin.findById(id).lean();
  if (!admin) {
    const error = new Error(ADMIN_MESSAGES.NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }
  return admin;
};

/* ===================== CREATE ADMIN ===================== */

export const createAdminService = async (payload) => {
  const existingAdmin = await Admin.findOne({ email: payload.email });
  if (existingAdmin) {
    const error = new Error(ADMIN_MESSAGES.EMAIL_EXISTS);
    error.statusCode = 409;
    throw error;
  }

  const admin = await Admin.create(payload);
  return admin;
};

/* ===================== UPDATE ADMIN ===================== */

export const updateAdminService = async (id, payload) => {
  const admin = await Admin.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!admin) {
    const error = new Error(ADMIN_MESSAGES.NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }

  return admin;
};

/* ===================== DELETE ADMIN ===================== */

export const deleteAdminService = async (id) => {
  const admin = await Admin.findByIdAndDelete(id);
  if (!admin) {
    const error = new Error(ADMIN_MESSAGES.NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }
  return admin;
};

/* ===================== LOGIN ADMIN ===================== */

export const loginAdminService = async (res, { email, password }) => {
  const admin = await Admin.findOne({ email }).select(
    "+password +refreshToken",
  );

  const invalidCredentialsError = () => {
    const e = new Error("Invalid email or password.");
    e.statusCode = 401;
    return e;
  };

  if (!admin) throw invalidCredentialsError();

  if (admin.lockUntil && admin.lockUntil > Date.now()) {
    const error = new Error(
      "Account temporarily locked due to too many failed attempts. Try again later.",
    );
    error.statusCode = 423;
    throw error;
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    admin.loginAttempts = (admin.loginAttempts || 0) + 1;

    if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      admin.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
      admin.loginAttempts = 0;
    }

    await admin.save({ validateBeforeSave: false });
    throw invalidCredentialsError();
  }

  if (!admin.isActive) {
    const error = new Error("Admin account has been deactivated.");
    error.statusCode = 403;
    error.code = "ACCOUNT_SUSPENDED";
    throw error;
  }

  admin.loginAttempts = 0;
  admin.lockUntil = null;

  const tokenPayload = {
    id: admin._id,
    role: admin.role,
    permissions: admin.permissions,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  admin.refreshToken = hashToken(refreshToken);
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  attachAuthCookies(res, {
    accessToken,
    refreshToken,
    accessCookieName: "adminAccessToken",
    refreshCookieName: "adminRefreshToken",
  });

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
  };
};

/* ===================== LOGOUT ADMIN ===================== */

export const logoutAdminService = async (res, adminId) => {
  if (adminId) {
    await Admin.findByIdAndUpdate(adminId, { $unset: { refreshToken: "" } });
  }
  clearAuthCookies(res, {
    accessCookieName: "adminAccessToken",
    refreshCookieName: "adminRefreshToken",
  });
};

/* ===================== REFRESH ADMIN SESSION ===================== */

/**
 * refreshAdminTokenService
 * Verifies the incoming adminRefreshToken cookie, checks it against the
 * hashed value stored on the Admin document, and — if valid — rotates
 * both tokens (issues new access + new refresh, replaces the stored hash).
 *
 * Reuse detection: if the token verifies as a valid JWT but its hash does
 * NOT match what's stored (already rotated elsewhere, or logged out),
 * we treat this as a potential theft/replay signal — clear all cookies
 * and force a full re-login rather than quietly returning 401.
 */
export const refreshAdminTokenService = async (res, incomingRefreshToken) => {
  const authError = (message, statusCode = 401) => {
    const e = new Error(message);
    e.statusCode = statusCode;
    return e;
  };

  if (!incomingRefreshToken) {
    throw authError("No refresh token provided.");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch (err) {
    clearAuthCookies(res, {
      accessCookieName: "adminAccessToken",
      refreshCookieName: "adminRefreshToken",
    });
    throw authError("Refresh token invalid or expired. Please log in again.");
  }

  const admin = await Admin.findById(decoded.id).select("+refreshToken");

  if (!admin || !admin.refreshToken) {
    clearAuthCookies(res, {
      accessCookieName: "adminAccessToken",
      refreshCookieName: "adminRefreshToken",
    });
    throw authError("Session no longer valid. Please log in again.");
  }

  const incomingHash = hashToken(incomingRefreshToken);

  if (incomingHash !== admin.refreshToken) {
    admin.refreshToken = null;
    await admin.save({ validateBeforeSave: false });
    clearAuthCookies(res, {
      accessCookieName: "adminAccessToken",
      refreshCookieName: "adminRefreshToken",
    });
    throw authError(
      "Session invalid — this may indicate token reuse. Please log in again.",
      401,
    );
  }

  if (!admin.isActive) {
    admin.refreshToken = null;
    await admin.save({ validateBeforeSave: false });
    clearAuthCookies(res, {
      accessCookieName: "adminAccessToken",
      refreshCookieName: "adminRefreshToken",
    });
    const e = authError("Admin account has been deactivated.", 403);
    e.code = "ACCOUNT_SUSPENDED";
    throw e;
  }

  if (admin.lockUntil && admin.lockUntil > Date.now()) {
    throw authError("Account temporarily locked. Try again later.", 423);
  }

  const tokenPayload = {
    id: admin._id,
    role: admin.role,
    permissions: admin.permissions,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  admin.refreshToken = hashToken(newRefreshToken);
  await admin.save({ validateBeforeSave: false });

  attachAuthCookies(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessCookieName: "adminAccessToken",
    refreshCookieName: "adminRefreshToken",
  });

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
  };
};

/* ===================== ONE-TIME BOOTSTRAP ===================== */

export const seedFirstSuperAdmin = async ({ name, email, password }) => {
  const existingCount = await Admin.countDocuments();

  if (existingCount > 0) {
    const error = new Error(
      "Refused: at least one Admin already exists. Bootstrap only runs on an empty collection.",
    );
    error.statusCode = 409;
    throw error;
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role: "SUPER_ADMIN",
    permissions: [],
  });

  return { id: admin._id, email: admin.email, role: admin.role };
};
