import {
  createAdminService,
  deleteAdminService,
  getAdminsService,
  getSingleAdminService,
  updateAdminService,
} from "./admin.service.js";

import {
  createAdminValidation,
  updateAdminValidation,
} from "./admin.validation.js";

import {
  ADMIN_MESSAGES,
} from "./admin.constants.js";

/*
=========================
GET ADMINS
=========================
*/

export const getAdminsController =
  async (req, res, next) => {
    try {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 20;

      const result =
        await getAdminsService({
          page,
          limit,
        });

      return res.status(200).json({
        success: true,
        message:
          ADMIN_MESSAGES.FETCH_SUCCESS,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
GET SINGLE ADMIN
=========================
*/

export const getSingleAdminController =
  async (req, res, next) => {
    try {
      const result =
        await getSingleAdminService(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          ADMIN_MESSAGES.FETCH_SINGLE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
CREATE ADMIN
=========================
*/

export const createAdminController =
  async (req, res, next) => {
    try {
      const { error, value } =
        createAdminValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map(
            (err) => err.message
          ),
        });
      }

      const result =
        await createAdminService(
          value
        );

      return res.status(201).json({
        success: true,
        message:
          ADMIN_MESSAGES.CREATE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
UPDATE ADMIN
=========================
*/

export const updateAdminController =
  async (req, res, next) => {
    try {
      const { error, value } =
        updateAdminValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map(
            (err) => err.message
          ),
        });
      }

      const result =
        await updateAdminService(
          req.params.id,
          value
        );

      return res.status(200).json({
        success: true,
        message:
          ADMIN_MESSAGES.UPDATE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
DELETE ADMIN
=========================
*/

export const deleteAdminController =
  async (req, res, next) => {
    try {
      const result =
        await deleteAdminService(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          ADMIN_MESSAGES.DELETE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };