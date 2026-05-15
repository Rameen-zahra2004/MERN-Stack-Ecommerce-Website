import SystemSetting from "./SystemSettings.model.js";

import {
  ensureSingleDocument,
} from "./systemSetting.utils.js";

/*
=========================
GET SETTINGS (SINGLETON)
=========================
*/

export const getSystemSettingService =
  async () => {
    const settings =
      await ensureSingleDocument(
        SystemSetting
      );

    return settings;
  };

/*
=========================
UPDATE SETTINGS
=========================
*/

export const updateSystemSettingService =
  async (payload, userId) => {
    const settings =
      await SystemSetting.findOne();

    const updated =
      await SystemSetting.findByIdAndUpdate(
        settings._id,
        {
          ...payload,
          updatedBy: userId,
        },
        { new: true }
      );

    return updated;
  };
