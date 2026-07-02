import Admin from "./Admin.model.js";

import {
  ADMIN_MESSAGES,
} from "./admin.constants.js";

/*
=========================
GET ADMINS
=========================
*/

export const getAdminsService =
  async ({
    page = 1,
    limit = 20,
  }) => {
    const skip = (page - 1) * limit;

    const [data, total] =
      await Promise.all([
        Admin.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Admin.countDocuments(),
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

/*
=========================
GET SINGLE ADMIN
=========================
*/

export const getSingleAdminService =
  async (id) => {
    const admin =
      await Admin.findById(id).lean();

    if (!admin) {
      throw new Error(
        ADMIN_MESSAGES.NOT_FOUND
      );
    }

    return admin;
  };

/*
=========================
CREATE ADMIN
=========================
*/

export const createAdminService =
  async (payload) => {
    const existingAdmin =
      await Admin.findOne({
        email: payload.email,
      });

    if (existingAdmin) {
      throw new Error(
        ADMIN_MESSAGES.EMAIL_EXISTS
      );
    }

    const admin =
      await Admin.create(payload);

    return admin;
  };

/*
=========================
UPDATE ADMIN
=========================
*/

export const updateAdminService =
  async (id, payload) => {
    const admin =
      await Admin.findByIdAndUpdate(
        id,
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!admin) {
      throw new Error(
        ADMIN_MESSAGES.NOT_FOUND
      );
    }

    return admin;
  };

/*
=========================
DELETE ADMIN
=========================
*/

export const deleteAdminService =
  async (id) => {
    const admin =
      await Admin.findByIdAndDelete(
        id
      );

    if (!admin) {
      throw new Error(
        ADMIN_MESSAGES.NOT_FOUND
      );
    }

    return admin;
  };
