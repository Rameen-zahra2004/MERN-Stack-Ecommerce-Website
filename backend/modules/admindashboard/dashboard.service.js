import Order from "../orders/order.model.js";
import User from "../user/User.model.js";
import Product from "../product/product.model.js";

import { ORDER_STATUS } from "./dashboard.constants.js";
import {
  LOW_STOCK_THRESHOLD,
  DEFAULT_LIMITS,
  MONTHS_IN_CHART,
} from "./dashboard.constants.js";
import {
  getTrailingMonthBuckets,
  getTodayRange,
  getWeekRange,
  getYearRange,
  calculateGrowthPercent,
} from "./dashboard.utils.js";

// Single place defining what counts as "revenue-eligible" — imported
// everywhere instead of re-declared, per project rule (no duplicate business rules).
// ASSUMPTION (flag if wrong): both CANCELLED and REFUNDED are excluded from
// revenue — a refunded order means money was returned, so it shouldn't count
// toward totals any more than a cancelled one does.
const REVENUE_MATCH = {
  status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED] },
};

/*
=========================
DASHBOARD SUMMARY
=========================
Uses $facet to run all counts in a single round trip to Mongo instead of
five separate queries (Promise.all across collections is unavoidable since
User/Product/Order are different collections — cannot $lookup a facet
across databases-level boundaries in one pipeline start point. We do use
Promise.all to parallelize the three collection queries, and $facet within
the Order query itself to combine revenue + status breakdown in one pass).
*/
export const getDashboardSummaryService = async () => {
  const [userStats, productStats, orderStats] = await Promise.all([
    User.aggregate([
      { $match: { role: "user" } },
      { $count: "totalCustomers" },
    ]),

    Product.aggregate([
      {
        $facet: {
          totalActive: [{ $match: { isActive: true } }, { $count: "count" }],
          lowStock: [
            { $match: { isActive: true, stock: { $lt: LOW_STOCK_THRESHOLD } } },
            { $count: "count" },
          ],
        },
      },
    ]),

    Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          totalRevenue: [
            { $match: REVENUE_MATCH },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        },
      },
    ]),
  ]);

  const totalCustomers = userStats[0]?.totalCustomers || 0;
  const totalActiveProducts = productStats[0]?.totalActive[0]?.count || 0;
  const lowStockCount = productStats[0]?.lowStock[0]?.count || 0;

  const orderFacet = orderStats[0];
  const totalOrders = orderFacet?.totalOrders[0]?.count || 0;
  const totalRevenue = orderFacet?.totalRevenue[0]?.total || 0;

  const statusMap = {};
  (orderFacet?.statusCounts || []).forEach((s) => {
    statusMap[s._id] = s.count;
  });

  return {
    totalCustomers,
    totalProducts: totalActiveProducts,
    totalOrders,
    totalRevenue,
    lowStockProducts: lowStockCount,
    pendingOrders: statusMap[ORDER_STATUS.PENDING] || 0,
    // No COMPLETED status exists in ORDER_STATUS — DELIVERED is the terminal
    // successful state, using that instead (was previously a silent bug:
    // ORDER_STATUS.COMPLETED was undefined, so this always returned 0).
    completedOrders: statusMap[ORDER_STATUS.DELIVERED] || 0,
    cancelledOrders: statusMap[ORDER_STATUS.CANCELLED] || 0,
    refundedOrders: statusMap[ORDER_STATUS.REFUNDED] || 0,
  };
};

/*
=========================
REVENUE ANALYTICS
=========================
Today / Week / Month / Year totals in one $facet pass, plus a 12-month
trend series for charting.
*/
export const getRevenueAnalyticsService = async () => {
  const today = getTodayRange();
  const week = getWeekRange();
  const year = getYearRange();
  const monthBuckets = getTrailingMonthBuckets(MONTHS_IN_CHART);

  const revenueSumFor = (range) => [
    {
      $match: {
        ...REVENUE_MATCH,
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ];

  const [periodTotals, monthlySeries] = await Promise.all([
    Order.aggregate([
      {
        $facet: {
          today: revenueSumFor(today),
          thisWeek: revenueSumFor(week),
          thisYear: revenueSumFor(year),
        },
      },
    ]),

    Order.aggregate([
      { $match: REVENUE_MATCH },
      {
        $match: {
          createdAt: {
            $gte: monthBuckets[0].start,
            $lte: monthBuckets[monthBuckets.length - 1].end,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Merge aggregation results into the pre-built bucket list so months with
  // zero orders still appear (chart libraries need continuous series).
  const seriesMap = {};
  monthlySeries.forEach((entry) => {
    const key = `${entry._id.year}-${entry._id.month}`;
    seriesMap[key] = entry;
  });

  const monthlyRevenue = monthBuckets.map((bucket) => {
    const key = `${bucket.year}-${bucket.month}`;
    const match = seriesMap[key];
    return {
      label: bucket.label,
      totalRevenue: match?.totalRevenue || 0,
      totalOrders: match?.totalOrders || 0,
    };
  });

  const thisMonthRevenue =
    monthlyRevenue[monthlyRevenue.length - 1]?.totalRevenue || 0;

  return {
    today: periodTotals[0]?.today[0]?.total || 0,
    thisWeek: periodTotals[0]?.thisWeek[0]?.total || 0,
    thisMonth: thisMonthRevenue,
    thisYear: periodTotals[0]?.thisYear[0]?.total || 0,
    monthlyRevenue,
  };
};

/*
=========================
SALES ANALYTICS (order counts, not $ revenue)
=========================
*/
export const getSalesAnalyticsService = async () => {
  const today = getTodayRange();
  const week = getWeekRange();
  const year = getYearRange();

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  const countFor = (range) => [
    {
      $match: {
        ...REVENUE_MATCH,
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    { $count: "count" },
  ];

  const result = await Order.aggregate([
    {
      $facet: {
        daily: countFor(today),
        weekly: countFor(week),
        yearly: countFor(year),
        currentMonth: countFor({ start: currentMonthStart, end: now }),
        previousMonth: countFor({
          start: previousMonthStart,
          end: previousMonthEnd,
        }),
      },
    },
  ]);

  const facet = result[0];
  const currentMonthCount = facet?.currentMonth[0]?.count || 0;
  const previousMonthCount = facet?.previousMonth[0]?.count || 0;

  return {
    daily: facet?.daily[0]?.count || 0,
    weekly: facet?.weekly[0]?.count || 0,
    monthly: currentMonthCount,
    yearly: facet?.yearly[0]?.count || 0,
    growth: {
      previousPeriodOrders: previousMonthCount,
      currentPeriodOrders: currentMonthCount,
      growthPercent: calculateGrowthPercent(
        currentMonthCount,
        previousMonthCount,
      ),
    },
  };
};

/*
=========================
RECENT ORDERS
=========================
*/
export const getRecentOrdersService = async () => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(DEFAULT_LIMITS.RECENT_ORDERS)
    .populate("user", "firstName lastName email")
    .select("user status totalAmount createdAt")
    .lean();

  // Same virtual-stripping issue as getLatestCustomersService — populate()
  // + lean() returns a plain object for the populated user too.
  return orders.map((order) => ({
    ...order,
    user: order.user
      ? {
          ...order.user,
          fullName: `${order.user.firstName} ${order.user.lastName}`,
        }
      : null,
  }));
};

/*
=========================
LATEST CUSTOMERS
=========================
*/
export const getLatestCustomersService = async () => {
  const users = await User.find({ role: "user" })
    .sort({ createdAt: -1 })
    .limit(DEFAULT_LIMITS.LATEST_USERS)
    .select("firstName lastName email isActive createdAt")
    .lean();

  // .lean() returns plain objects, so the fullName virtual doesn't run —
  // computing it here rather than duplicating this concat logic on the
  // frontend in multiple places.
  return users.map((user) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  }));
};

/*
=========================
CUSTOMER GROWTH (new users per month, trailing 12 months)
=========================
*/
export const getCustomerGrowthService = async () => {
  const monthBuckets = getTrailingMonthBuckets(MONTHS_IN_CHART);

  const results = await User.aggregate([
    {
      $match: {
        role: "user",
        createdAt: {
          $gte: monthBuckets[0].start,
          $lte: monthBuckets[monthBuckets.length - 1].end,
        },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        newUsers: { $sum: 1 },
      },
    },
  ]);

  const map = {};
  results.forEach((r) => {
    map[`${r._id.year}-${r._id.month}`] = r.newUsers;
  });

  return monthBuckets.map((bucket) => ({
    label: bucket.label,
    newUsers: map[`${bucket.year}-${bucket.month}`] || 0,
  }));
};

/*
=========================
LOW STOCK PRODUCTS
=========================
*/
export const getLowStockProductsService = async () => {
  return Product.find({ isActive: true, stock: { $lt: LOW_STOCK_THRESHOLD } })
    .sort({ stock: 1 })
    .limit(DEFAULT_LIMITS.LOW_STOCK_PRODUCTS)
    .select("name stock price") // NOTE: adjust to actual Product schema
    .lean();
};

/*
=========================
TOP SELLING PRODUCTS
=========================
Aggregates from Order.items[] (embedded), NOT the Product collection —
per your rule. Ranked by quantity sold.
*/
export const getTopSellingProductsService = async () => {
  return Order.aggregate([
    { $match: REVENUE_MATCH },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        totalQuantitySold: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.subtotal" },
      },
    },
    { $sort: { totalQuantitySold: -1 } },
    { $limit: DEFAULT_LIMITS.TOP_SELLING_PRODUCTS },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: 1,
        totalQuantitySold: 1,
        totalRevenue: 1,
      },
    },
  ]);
};

/*
=========================
ORDER STATUS ANALYTICS
=========================
*/
export const getOrderStatusAnalyticsService = async () => {
  const results = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statusMap = {};
  results.forEach((r) => {
    statusMap[r._id] = r.count;
  });

  // Always return every known status, even if zero — frontend charts need
  // stable keys, not a sparse object that changes shape based on data.
  return Object.values(ORDER_STATUS).reduce((acc, status) => {
    acc[status] = statusMap[status] || 0;
    return acc;
  }, {});
};

/*
=========================
MONTHLY CHART (orders + revenue combined, chart-library ready)
=========================
*/
export const getMonthlyChartService = async () => {
  const monthBuckets = getTrailingMonthBuckets(MONTHS_IN_CHART);

  const results = await Order.aggregate([
    { $match: REVENUE_MATCH },
    {
      $match: {
        createdAt: {
          $gte: monthBuckets[0].start,
          $lte: monthBuckets[monthBuckets.length - 1].end,
        },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const map = {};
  results.forEach((r) => {
    map[`${r._id.year}-${r._id.month}`] = r;
  });

  return monthBuckets.map((bucket) => {
    const key = `${bucket.year}-${bucket.month}`;
    const match = map[key];
    return {
      label: bucket.label,
      totalOrders: match?.totalOrders || 0,
      totalRevenue: match?.totalRevenue || 0,
    };
  });
};
