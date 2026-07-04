import express from "express";
import { protect, restrictTo } from "../auth/auth.middleware.js";

import { getActivityLogsController } from "./activityLog.controller.js";

const router = express.Router();


// FIX (C6): require admin auth to even read logs
router.use(protect, restrictTo("admin"));

// FIX (C7): POST removed entirely — logs should only ever be written
// internally by the activityLogger middleware, never accepted as client input.
// DELETE removed entirely — audit logs should be immutable. If retention
// cleanup is needed later, do it via a scheduled job, not a public route.

router.get("/", getActivityLogsController);

export default router;
