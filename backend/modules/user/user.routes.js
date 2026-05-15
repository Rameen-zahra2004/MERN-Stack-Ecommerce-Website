import express from "express";

import authenticate from
  "../auth/auth.middleware.js";

import authorizeRoles from
  "../roles/role.middleware.js";

import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
} from "./user.controller.js";

const router = express.Router();

/*
=========================
ADMIN ROUTES
=========================
*/

router.get(
  "/",
  authenticate,
  authorizeRoles(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  getUsersController
);

router.get(
  "/:id",
  authenticate,
  getUserController
);

router.post(
  "/",
  createUserController
);

router.put(
  "/:id",
  authenticate,
  updateUserController
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN"),
  deleteUserController
);

export default router;
