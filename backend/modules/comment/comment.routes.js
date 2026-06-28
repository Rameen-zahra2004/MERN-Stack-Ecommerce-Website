import express from "express";

import { protect } from "../auth/auth.middleware.js";

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

router.get("/:productId", getCommentsController);

router.post("/", protect, createCommentController);

router.put("/:id", protect, updateCommentController);

router.delete("/:id", protect, deleteCommentController);

export default router;
