import express from "express";

import { protect } from "../auth/auth.middleware.js";

import {
  addAddressController,
  deleteAddressController,
  getProfileController,
  updateProfileController,
} from "./profile.controller.js";

const router = express.Router();

router.use(protect);

/*
=========================
PROFILE ROUTES
=========================
*/

router.get("/", getProfileController);

router.put("/", updateProfileController);

router.post("/address", addAddressController);

router.delete("/address/:addressId", deleteAddressController);

export default router;
