import {
  getSystemSettingService,
  updateSystemSettingService,
} from "./systemSetting.service.js";

import {
  SYSTEM_SETTING_MESSAGES,
} from "./systemSetting.constants.js";

/*
=========================
GET SETTINGS
=========================
*/

export const getSystemSettingController =
  async (req, res, next) => {
    try {
      const data =
        await getSystemSettingService();

      return res.status(200).json({
        success: true,
        message:
          SYSTEM_SETTING_MESSAGES.FETCH_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
UPDATE SETTINGS (ADMIN ONLY)
=========================
*/

export const updateSystemSettingController =
  async (req, res, next) => {
    try {
      const data =
        await updateSystemSettingService(
          req.body,
          req.user._id
        );

      return res.status(200).json({
        success: true,
        message:
          SYSTEM_SETTING_MESSAGES.UPDATE_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
