import express from "express";

import {
  createActiveUserController,
  getActiveUsersController,
} from "./activeUser.controller.js";

const router = express.Router();


router.get(
  "/",
  getActiveUsersController
);

router.post(
  "/",
  createActiveUserController
);

export default router;

