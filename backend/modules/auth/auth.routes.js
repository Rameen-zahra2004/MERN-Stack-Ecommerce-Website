import express from "express";

import {
  loginController,
  logoutController,
  registerController,
} from "./auth.controller.js";

import authenticate from "./auth.middleware.js";

const router = express.Router();

/*
=========================
AUTH ROUTES
=========================
*/

router.post(
  "/register",
  registerController
);

router.post(
  "/login",
  loginController
);

router.post(
  "/logout",
  authenticate,
  logoutController
);

export default router;