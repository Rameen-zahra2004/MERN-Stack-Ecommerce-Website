export const LOW_STOCK_THRESHOLD = 5;

export const DEFAULT_LIMITS = {
  RECENT_ORDERS: 10,
  RECENT_PRODUCTS: 10,
  LATEST_USERS: 10,
  TOP_SELLING_PRODUCTS: 10,
  LOW_STOCK_PRODUCTS: 20,
};

export const CHART_PERIODS = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

export const MONTHS_IN_CHART = 12;

export const DASHBOARD_MESSAGES = {
  SUMMARY_SUCCESS: "Dashboard summary retrieved successfully",
  REVENUE_SUCCESS: "Revenue analytics retrieved successfully",
  SALES_SUCCESS: "Sales analytics retrieved successfully",
  RECENT_ORDERS_SUCCESS: "Recent orders retrieved successfully",
  LATEST_USERS_SUCCESS: "Latest customers retrieved successfully",
  LOW_STOCK_SUCCESS: "Low stock products retrieved successfully",
  TOP_PRODUCTS_SUCCESS: "Top selling products retrieved successfully",
  ORDER_STATUS_ANALYTICS_SUCCESS:
    "Order status analytics retrieved successfully",
  MONTHLY_CHART_SUCCESS: "Monthly chart data retrieved successfully",
  CUSTOMER_GROWTH_SUCCESS: "Customer growth retrieved successfully",
};

// NOTE: Only "CANCELLED" is confirmed from actual source (revenue.service.js).
// The rest are inferred from your spec documents. Replace this import with the
// real order.status.js export once confirmed — do not hand-type these values
// anywhere else in the dashboard module.
export { ORDER_STATUS } from "../orders/order.status.js";
