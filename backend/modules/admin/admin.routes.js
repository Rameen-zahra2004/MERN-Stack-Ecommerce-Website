// import express from "express";
// import { protect, restrictTo } from "../auth/auth.middleware.js";

// import {
//   createAdminController,
//   deleteAdminController,
//   getAdminsController,
//   getSingleAdminController,
//   updateAdminController,
// } from "./admin.controller.js";

// const router = express.Router();

// /*
// =========================
// ADMIN ROUTES
// =========================
// */

// // FIX (C1): every route below now requires a valid token AND admin role
// router.use(protect, restrictTo("admin"));

// router.get("/", getAdminsController);
// router.get("/:id", getSingleAdminController);
// router.post("/", createAdminController);
// router.put("/:id", updateAdminController);
// router.delete("/:id", deleteAdminController);

// export default router;
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
  getMeController,
} from "./admin.controller.js";

const router = express.Router();

/* ===================== PUBLIC (no auth) ===================== */
router.post("/login", loginAdminController);

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
