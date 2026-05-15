import Comment from "./comment.model.js";

import {
  COMMENT_MESSAGES,
} from "./comment.constants.js";

/*
=========================
GET COMMENTS BY PRODUCT
=========================
*/

export const getCommentsService =
  async (productId) => {
    const comments =
      await Comment.find({
        product: productId,
        isDeleted: false,
      })
        .populate(
          "user",
          "name avatar"
        )
        .sort({ createdAt: -1 })
        .lean();

    return comments;
  };

/*
=========================
CREATE COMMENT
=========================
*/

export const createCommentService =
  async (payload) => {
    const comment =
      await Comment.create(payload);

    return comment;
  };

/*
=========================
UPDATE COMMENT
=========================
*/

export const updateCommentService =
  async (commentId, userId, text) => {
    const comment =
      await Comment.findById(
        commentId
      );

    if (!comment) {
      throw new Error(
        COMMENT_MESSAGES.NOT_FOUND
      );
    }

    if (
      comment.user.toString() !==
      userId.toString()
    ) {
      throw new Error(
        COMMENT_MESSAGES.UNAUTHORIZED
      );
    }

    comment.text = text;

    comment.isEdited = true;

    await comment.save();

    return comment;
  };

/*
=========================
DELETE COMMENT (SOFT DELETE)
=========================
*/

export const deleteCommentService =
  async (commentId, userId) => {
    const comment =
      await Comment.findById(
        commentId
      );

    if (!comment) {
      throw new Error(
        COMMENT_MESSAGES.NOT_FOUND
      );
    }

    if (
      comment.user.toString() !==
      userId.toString()
    ) {
      throw new Error(
        COMMENT_MESSAGES.UNAUTHORIZED
      );
    }

    comment.isDeleted = true;

    await comment.save();

    return true;
  };