import express from "express";

import {
  createActivityLogController,
  deleteActivityLogController,
  getActivityLogsController,
} from "./activityLog.controller.js";

const router = express.Router();

/*
=========================
ACTIVITY LOG ROUTES
=========================
*/

router.get(
  "/",
  getActivityLogsController
);

router.post(
  "/",
  createActivityLogController
);

router.delete(
  "/:id",
  deleteActivityLogController
);

export default router;