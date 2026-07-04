import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "./user.service.js";

import {
  USER_MESSAGES,
} from "./user.constants.js";


export const createUserController =
  async (req, res, next) => {
    try {
      const data =
        await createUserService(
          req.body
        );

      return res.status(201).json({
        success: true,
        message:
          USER_MESSAGES.CREATE_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };


export const getUserController =
  async (req, res, next) => {
    try {
      const data =
        await getUserByIdService(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          USER_MESSAGES.FETCH_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };


export const getUsersController =
  async (req, res, next) => {
    try {
      const data =
        await getUsersService(
          req.query
        );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };


export const updateUserController =
  async (req, res, next) => {
    try {
      const data =
        await updateUserService(
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          USER_MESSAGES.UPDATE_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };


export const deleteUserController =
  async (req, res, next) => {
    try {
      const data =
        await deleteUserService(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          USER_MESSAGES.DELETE_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };