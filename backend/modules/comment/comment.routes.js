import express from "express";

import authenticate from
  "../auth/auth.middleware.js";

import {
  createCommentController,
  deleteCommentController,
  getCommentsController,
  updateCommentController,
} from "./comment.controller.js";

const router = express.Router();

/*
=========================
COMMENT ROUTES
=========================
*/

router.get(
  "/:productId",
  getCommentsController
);

router.post(
  "/",
  authenticate,
  createCommentController
);

router.put(
  "/:id",
  authenticate,
  updateCommentController
);

router.delete(
  "/:id",
  authenticate,
  deleteCommentController
);

export default router;