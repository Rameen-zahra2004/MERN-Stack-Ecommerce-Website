import {
  createActiveUserService,
  getActiveUsersService,
} from "./activeUser.service.js";

import { ACTIVE_USER_MESSAGES } from "./activeUser.constants.js";

import { createActiveUserValidation } from "./activeUser.validation.js";

/*
=========================
GET ACTIVE USERS
=========================
*/

export const getActiveUsersController =
  async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 20;

      const result =
        await getActiveUsersService({
          page,
          limit,
        });

      return res.status(200).json({
        success: true,
        message:
          ACTIVE_USER_MESSAGES.FETCH_SUCCESS,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
CREATE ACTIVE USER
=========================
*/

export const createActiveUserController =
  async (req, res, next) => {
    try {
      const { error, value } =
        createActiveUserValidation.validate(
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
        await createActiveUserService(
          value
        );

      return res.status(201).json({
        success: true,
        message:
          ACTIVE_USER_MESSAGES.CREATE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };