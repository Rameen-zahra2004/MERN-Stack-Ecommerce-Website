import {
  getDashboardSummaryService,
  getRevenueAnalyticsService,
  getSalesAnalyticsService,
  getRecentOrdersService,
  getLatestCustomersService,
  getCustomerGrowthService,
  getLowStockProductsService,
  getTopSellingProductsService,
  getOrderStatusAnalyticsService,
  getMonthlyChartService,
} from "./dashboard.service.js";

import { DASHBOARD_MESSAGES } from "./dashboard.constants.js";

export const getDashboardSummaryController = async (req, res, next) => {
  try {
    const data = await getDashboardSummaryService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.SUMMARY_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueAnalyticsController = async (req, res, next) => {
  try {
    const data = await getRevenueAnalyticsService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.REVENUE_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesAnalyticsController = async (req, res, next) => {
  try {
    const data = await getSalesAnalyticsService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.SALES_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentOrdersController = async (req, res, next) => {
  try {
    const data = await getRecentOrdersService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.RECENT_ORDERS_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestCustomersController = async (req, res, next) => {
  try {
    const data = await getLatestCustomersService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.LATEST_USERS_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerGrowthController = async (req, res, next) => {
  try {
    const data = await getCustomerGrowthService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.CUSTOMER_GROWTH_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStockProductsController = async (req, res, next) => {
  try {
    const data = await getLowStockProductsService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.LOW_STOCK_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopSellingProductsController = async (req, res, next) => {
  try {
    const data = await getTopSellingProductsService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.TOP_PRODUCTS_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStatusAnalyticsController = async (req, res, next) => {
  try {
    const data = await getOrderStatusAnalyticsService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.ORDER_STATUS_ANALYTICS_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyChartController = async (req, res, next) => {
  try {
    const data = await getMonthlyChartService();
    return res.status(200).json({
      success: true,
      message: DASHBOARD_MESSAGES.MONTHLY_CHART_SUCCESS,
      data,
    });
  } catch (error) {
    next(error);
  }
};
