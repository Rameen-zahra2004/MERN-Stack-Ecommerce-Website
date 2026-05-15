import {
  createRevenueSnapshotService,
  getRevenueService,
} from "./revenue.service.js";

import {
  REVENUE_MESSAGES,
} from "./revenue.constants.js";

/*
=========================
GET DASHBOARD
=========================
*/

export const getRevenueController =
  async (req, res, next) => {
    try {
      const data =
        await getRevenueService(
          req.query.type
        );

      return res.status(200).json({
        success: true,
        message:
          REVENUE_MESSAGES.DASHBOARD_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
CREATE SNAPSHOT (ADMIN / CRON)
=========================
*/

export const createRevenueSnapshotController =
  async (req, res, next) => {
    try {
      const data =
        await createRevenueSnapshotService();

      return res.status(201).json({
        success: true,
        message:
          REVENUE_MESSAGES.SNAPSHOT_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };