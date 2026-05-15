import express from "express";

import {
  createAdminController,
  deleteAdminController,
  getAdminsController,
  getSingleAdminController,
  updateAdminController,
} from "./admin.controller.js";

const router = express.Router();

/*
=========================
ADMIN ROUTES
=========================
*/

router.get(
  "/",
  getAdminsController
);

router.get(
  "/:id",
  getSingleAdminController
);

router.post(
  "/",
  createAdminController
);

router.put(
  "/:id",
  updateAdminController
);

router.delete(
  "/:id",
  deleteAdminController
);

export default router;