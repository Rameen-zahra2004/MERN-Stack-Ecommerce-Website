import ActivityLog from "./ActivityLog.model.js";

import { ACTIVITY_LOG_MESSAGES } from "./activityLog.constants.js";


export const getActivityLogsService =
  async ({
    page = 1,
    limit = 20,
    module,
    action,
  }) => {
    const skip = (page - 1) * limit;

    const filter = {};

    if (module) {
      filter.module = module;
    }

    if (action) {
      filter.action = action;
    }

    const [data, total] =
      await Promise.all([
        ActivityLog.find(filter)
          .populate(
            "user",
            "name email role"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        ActivityLog.countDocuments(
          filter
        ),
      ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
      data,
    };
  };


export const createActivityLogService =
  async (payload) => {
    if (!payload.action) {
      throw new Error(
        ACTIVITY_LOG_MESSAGES.INVALID_ACTION
      );
    }

    if (!payload.module) {
      throw new Error(
        ACTIVITY_LOG_MESSAGES.INVALID_MODULE
      );
    }

    const activityLog =
      await ActivityLog.create(payload);

    return activityLog;
  };


export const deleteActivityLogService =
  async (id) => {
    const deleted =
      await ActivityLog.findByIdAndDelete(
        id
      );

    return deleted;
  };
