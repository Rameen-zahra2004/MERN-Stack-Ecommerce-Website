import express from "express";
import { protectAdmin, restrictToSuperAdmin } from "./admin.middleware.js";

import {
  createAdminController,
  deleteAdminController,
  getAdminsController,
  getSingleAdminController,
  updateAdminController,
  loginAdminController,
  logoutAdminController,
  refreshAdminController,
  getMeController,
} from "./admin.controller.js";

const router = express.Router();

router.post("/login", loginAdminController);
router.post("/refresh", refreshAdminController);

router.use(protectAdmin);

router.post("/logout", logoutAdminController);
router.get("/me", getMeController);

router.get("/", restrictToSuperAdmin, getAdminsController);
router.get("/:id", restrictToSuperAdmin, getSingleAdminController);
router.post("/", restrictToSuperAdmin, createAdminController);
router.put("/:id", restrictToSuperAdmin, updateAdminController);
router.delete("/:id", restrictToSuperAdmin, deleteAdminController);

export default router;
