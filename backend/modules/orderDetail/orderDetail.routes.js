import express from "express";

import { protect } from "../auth/auth.middleware.js";
import {
  getOrderDetailsController,
  getUserOrderDetailsController,
} from "./orderDetail.controller.js";

const router = express.Router();


router.use(protect);


router.get("/order/:orderId", getOrderDetailsController);

router.get("/me", getUserOrderDetailsController);

export default router;
