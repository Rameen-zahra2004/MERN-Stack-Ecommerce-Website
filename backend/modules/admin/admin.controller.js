import {
  createAdminService,
  deleteAdminService,
  getAdminsService,
  getSingleAdminService,
  updateAdminService,
  loginAdminService,
  logoutAdminService,
  refreshAdminTokenService,
} from "./admin.service.js";

import {
  createAdminValidation,
  updateAdminValidation,
  loginAdminValidation,
} from "./admin.validation.js";
import { ADMIN_MESSAGES } from "./admin.constants.js";

export const getAdminsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const result = await getAdminsService({ page, limit });

    return res.status(200).json({
      success: true,
      message: ADMIN_MESSAGES.FETCH_SUCCESS,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleAdminController = async (req, res, next) => {
  try {
    const result = await getSingleAdminService(req.params.id);
    return res.status(200).json({
      success: true,
      message: ADMIN_MESSAGES.FETCH_SINGLE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminController = async (req, res, next) => {
  try {
    const { error, value } = createAdminValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    if (req.admin?.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only a super admin can create new admin accounts.",
      });
    }

    const result = await createAdminService({
      ...value,
      role: "ADMIN",
      permissions: [],
    });

    return res.status(201).json({
      success: true,
      message: ADMIN_MESSAGES.CREATE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminController = async (req, res, next) => {
  try {
    const { error, value } = updateAdminValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const result = await updateAdminService(req.params.id, value);

    return res.status(200).json({
      success: true,
      message: ADMIN_MESSAGES.UPDATE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminController = async (req, res, next) => {
  try {
    if (req.admin && String(req.admin._id) === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account.",
      });
    }

    const result = await deleteAdminService(req.params.id);
    return res.status(200).json({
      success: true,
      message: ADMIN_MESSAGES.DELETE_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== LOGIN ===================== */

export const loginAdminController = async (req, res, next) => {
  try {
    const { error, value } = loginAdminValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const admin = await loginAdminService(res, value);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: { admin },
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== LOGOUT ===================== */

export const logoutAdminController = async (req, res, next) => {
  try {
    await logoutAdminService(res, req.admin?._id);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== REFRESH ===================== */

export const refreshAdminController = async (req, res, next) => {
  try {
    const incomingToken = req.cookies?.adminRefreshToken;
    const admin = await refreshAdminTokenService(res, incomingToken);

    return res.status(200).json({
      success: true,
      message: "Session refreshed.",
      data: { admin },
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== GET ME (session rehydration) ===================== */

export const getMeController = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Admin profile fetched.",
      data: { admin: req.admin },
    });
  } catch (error) {
    next(error);
  }
};
