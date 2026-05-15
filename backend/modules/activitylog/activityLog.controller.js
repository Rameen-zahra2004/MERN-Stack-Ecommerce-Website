import {
  createActivityLogService,
  deleteActivityLogService,
  getActivityLogsService,
} from "./activityLog.service.js";

import {
  createActivityLogValidation,
} from "./activityLog.validation.js";

import {
  ACTIVITY_LOG_MESSAGES,
} from "./activityLog.constants.js";

/*
=========================
GET ACTIVITY LOGS
=========================
*/

export const getActivityLogsController =
  async (req, res, next) => {
    try {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 20;

      const module =
        req.query.module;

      const action =
        req.query.action;

      const result =
        await getActivityLogsService({
          page,
          limit,
          module,
          action,
        });

      return res.status(200).json({
        success: true,
        message:
          ACTIVITY_LOG_MESSAGES.FETCH_SUCCESS,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
CREATE ACTIVITY LOG
=========================
*/

export const createActivityLogController =
  async (req, res, next) => {
    try {
      const { error, value } =
        createActivityLogValidation.validate(
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
        await createActivityLogService(
          value
        );

      return res.status(201).json({
        success: true,
        message:
          ACTIVITY_LOG_MESSAGES.CREATE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
DELETE ACTIVITY LOG
=========================
*/

export const deleteActivityLogController =
  async (req, res, next) => {
    try {
      const result =
        await deleteActivityLogService(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          ACTIVITY_LOG_MESSAGES.DELETE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };