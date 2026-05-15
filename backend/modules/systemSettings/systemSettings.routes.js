import express from "express";

import authenticate from
  "../auth/auth.middleware.js";

import authorizeRoles from
  "../roles/role.middleware.js";

import {
  getSystemSettingController,
  updateSystemSettingController,
} from "./systemSettings.controller.js";

const router = express.Router();

/*
=========================
PUBLIC READ (SAFE SETTINGS)
=========================
*/

router.get(
  "/",
  getSystemSettingController
);

/*
=========================
ADMIN UPDATE
=========================
*/

router.put(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  updateSystemSettingController
);

export default router;
