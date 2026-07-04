import SystemSetting from "./SystemSettings.model.js";

import {
  ensureSingleDocument,
} from "./systemSetting.utils.js";


export const getSystemSettingService =
  async () => {
    const settings =
      await ensureSingleDocument(
        SystemSetting
      );

    return settings;
  };


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
