import ActiveUser from "./ActiveUser.model.js";
import { ACTIVE_USER_MESSAGES } from "./activeUser.constants.js";


export const getActiveUsersService = async ({
  page = 1,
  limit = 20,
}) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    ActiveUser.find()
      .sort({ recordedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    ActiveUser.countDocuments(),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data,
  };
};


export const createActiveUserService = async (
  payload
) => {
  if (!payload) {
    throw new Error(
      ACTIVE_USER_MESSAGES.PAYLOAD_REQUIRED
    );
  }

  const { count, recordedAt } = payload;


  if (count < 0) {
    throw new Error(
      ACTIVE_USER_MESSAGES.INVALID_COUNT
    );
  }

  const activeUser =
    await ActiveUser.create({
      count,
      recordedAt:
        recordedAt || new Date(),
    });

  return activeUser;
};
