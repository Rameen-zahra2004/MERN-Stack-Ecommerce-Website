import Order from
  "../orders/order.model.js";
import Revenue from "./Revenue.model.js";

import {
  formatDateRange,
} from "./revenue.utils.js";

/*
=========================
GET REVENUE DASHBOARD
=========================
*/

export const getRevenueService =
  async (type = "monthly") => {
    const {
      startDate,
      endDate,
    } = formatDateRange(type);

    /*
    =========================
    AGGREGATION PIPELINE
    =========================
    */

    const result =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },

            status: {
              $ne: "CANCELLED",
            },
          },
        },

        {
          $group: {
            _id: null,

            totalOrders: {
              $sum: 1,
            },

            totalRevenue: {
              $sum: "$totalAmount",
            },

            totalTax: {
              $sum: "$tax",
            },

            totalShipping: {
              $sum: "$shippingFee",
            },

            totalDiscount: {
              $sum: "$discount",
            },
          },
        },
      ]);

    return (
      result[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        totalTax: 0,
        totalShipping: 0,
        totalDiscount: 0,
      }
    );
  };

/*
=========================
SAVE DAILY SNAPSHOT
=========================
*/

export const createRevenueSnapshotService =
  async () => {
    const today = new Date();

    const start = new Date(
      today.setHours(0, 0, 0, 0)
    );

    const end = new Date(
      today.setHours(
        23,
        59,
        59,
        999
      )
    );

    const data =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
        },

        {
          $group: {
            _id: null,

            totalOrders: {
              $sum: 1,
            },

            totalRevenue: {
              $sum: "$totalAmount",
            },

            totalTax: {
              $sum: "$tax",
            },

            totalShipping: {
              $sum: "$shippingFee",
            },

            totalDiscount: {
              $sum: "$discount",
            },
          },
        },
      ]);

    const stats = data[0];

    const snapshot =
      await Revenue.findOneAndUpdate(
        { date: start },
        {
          date: start,

          totalOrders:
            stats?.totalOrders ||
            0,

          totalRevenue:
            stats?.totalRevenue ||
            0,

          totalTax:
            stats?.totalTax || 0,

          totalShipping:
            stats?.totalShipping ||
            0,

          totalDiscount:
            stats?.totalDiscount ||
            0,
        },
        {
          upsert: true,
          new: true,
        }
      );

    return snapshot;
  };
