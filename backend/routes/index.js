import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import cartRoutes from "../modules/cart/cart.routes.js";
import orderRoutes from "../modules/orders/order.routes.js";
import revenueRoutes from "../modules/revenue/revenue.routes.js";
import activeUserRoutes from "../modules/activeUsers/activeUser.routes.js";
import commentRoutes from "../modules/comment/comment.routes.js";
import systemSettingsRoutes from "../modules/systemSettings/systemSettings.routes.js";
import apiKeyRoutes from "../modules/apiKeys/apiKey.routes.js";
import activityLogRoutes from "../modules/activitylog/activityLog.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import orderDetailRoutes from "../modules/orderDetail/orderDetail.routes.js";

const router = express.Router();

/*
=========================
HEALTH CHECK
=========================
*/

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ecommerce API Running"
  });
});

/*
=========================
API ROUTES
=========================
*/

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/admins", adminRoutes);

router.use("/cart", cartRoutes);

router.use("/orders", orderRoutes);

router.use("/revenue", revenueRoutes);

router.use("/activeusers", activeUserRoutes);

router.use("/comments", commentRoutes);


router.use("/system-settings", systemSettingsRoutes);

router.use("/api-keys", apiKeyRoutes);


router.use("/activity-logs", activityLogRoutes);

router.use("/profile", profileRoutes);

router.use("/order-detail", orderDetailRoutes);

export default router;
