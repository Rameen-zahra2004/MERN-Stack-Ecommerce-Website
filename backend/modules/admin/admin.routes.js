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

/* ===================== PUBLIC (no auth) ===================== */
router.post("/login", loginAdminController);
router.post("/refresh", refreshAdminController);

/* ===================== PROTECTED — any logged-in Admin ===================== */
router.use(protectAdmin);

router.post("/logout", logoutAdminController);
router.get("/me", getMeController);

/* ===================== SUPER_ADMIN ONLY — managing other admin accounts ===================== */
router.get("/", restrictToSuperAdmin, getAdminsController);
router.get("/:id", restrictToSuperAdmin, getSingleAdminController);
router.post("/", restrictToSuperAdmin, createAdminController);
router.put("/:id", restrictToSuperAdmin, updateAdminController);
router.delete("/:id", restrictToSuperAdmin, deleteAdminController);

export default router;
