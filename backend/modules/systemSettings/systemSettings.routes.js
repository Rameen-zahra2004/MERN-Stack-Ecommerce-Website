import express from "express";

import { protect } from "../auth/auth.middleware.js";
import authorizeRoles from "../roles/role.middleware.js";

import {
  getSystemSettingController,
  updateSystemSettingController,
} from "./systemSettings.controller.js";

const router = express.Router();


router.get("/", getSystemSettingController);


router.put(
  "/",
  protect,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  updateSystemSettingController,
);

export default router;
