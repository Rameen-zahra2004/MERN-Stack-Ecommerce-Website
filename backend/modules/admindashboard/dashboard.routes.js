import express from "express";

import { protectAdmin } from "../admin/admin.middleware.js";

import {
  getDashboardSummaryController,
  getRevenueAnalyticsController,
  getSalesAnalyticsController,
  getRecentOrdersController,
  getLatestCustomersController,
  getCustomerGrowthController,
  getLowStockProductsController,
  getTopSellingProductsController,
  getOrderStatusAnalyticsController,
  getMonthlyChartController,
} from "./dashboard.controller.js";

const router = express.Router();

// Uses protectAdmin (Admin-collection auth, adminAccessToken cookie),
// NOT the generic `protect` (User-collection auth). Dashboard is admin-only
// by definition, so any authenticated admin can view it — no additional
// restrictToSuperAdmin / authorizePermissions gate unless you want one.
router.use(protectAdmin);

router.get("/summary", getDashboardSummaryController);
router.get("/revenue", getRevenueAnalyticsController);
router.get("/sales", getSalesAnalyticsController);
router.get("/recent-orders", getRecentOrdersController);
router.get("/latest-users", getLatestCustomersController);
router.get("/customer-growth", getCustomerGrowthController);
router.get("/low-stock", getLowStockProductsController);
router.get("/top-products", getTopSellingProductsController);
router.get("/order-status", getOrderStatusAnalyticsController);
router.get("/monthly-chart", getMonthlyChartController);

export default router;
