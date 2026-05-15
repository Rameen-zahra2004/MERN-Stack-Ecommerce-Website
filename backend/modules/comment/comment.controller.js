import {
  createCommentService,
  deleteCommentService,
  getCommentsService,
  updateCommentService,
} from "./comment.service.js";

import {
  createCommentValidation,
  updateCommentValidation,
} from "./comment.validation.js";

import {
  COMMENT_MESSAGES,
} from "./comment.constants.js";

/*
=========================
GET COMMENTS
=========================
*/

export const getCommentsController =
  async (req, res, next) => {
    try {
      const result =
        await getCommentsService(
          req.params.productId
        );

      return res.status(200).json({
        success: true,
        message:
          COMMENT_MESSAGES.FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
CREATE COMMENT
=========================
*/

export const createCommentController =
  async (req, res, next) => {
    try {
      const { error, value } =
        createCommentValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map(
            (e) => e.message
          ),
        });
      }

      const result =
        await createCommentService({
          user: req.user._id,

          product:
            value.productId,

          text: value.text,

          rating: value.rating,

          parentComment:
            value.parentComment ||
            null,
        });

      return res.status(201).json({
        success: true,
        message:
          COMMENT_MESSAGES.CREATE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
UPDATE COMMENT
=========================
*/

export const updateCommentController =
  async (req, res, next) => {
    try {
      const { error, value } =
        updateCommentValidation.validate(
          req.body,
          {
            abortEarly: false,
          }
        );

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map(
            (e) => e.message
          ),
        });
      }

      const result =
        await updateCommentService(
          req.params.id,
          req.user._id,
          value.text
        );

      return res.status(200).json({
        success: true,
        message:
          COMMENT_MESSAGES.UPDATE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
DELETE COMMENT
=========================
*/

export const deleteCommentController =
  async (req, res, next) => {
    try {
      await deleteCommentService(
        req.params.id,
        req.user._id
      );

      return res.status(200).json({
        success: true,
        message:
          COMMENT_MESSAGES.DELETE_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };
