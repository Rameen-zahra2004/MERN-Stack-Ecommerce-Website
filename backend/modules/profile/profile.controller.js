import {
  addAddressService,
  deleteAddressService,
  getProfileService,
  updateProfileService,
} from "./profile.service.js";

import {
  PROFILE_MESSAGES,
} from "./profile.constants.js";

/*
=========================
GET PROFILE
=========================
*/

export const getProfileController =
  async (req, res, next) => {
    try {
      const data =
        await getProfileService(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        message:
          PROFILE_MESSAGES.FETCH_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
UPDATE PROFILE
=========================
*/

export const updateProfileController =
  async (req, res, next) => {
    try {
      const data =
        await updateProfileService(
          req.user._id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          PROFILE_MESSAGES.UPDATE_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
ADD ADDRESS
=========================
*/

export const addAddressController =
  async (req, res, next) => {
    try {
      const data =
        await addAddressService(
          req.user._id,
          req.body
        );

      return res.status(201).json({
        success: true,
        message:
          "Address added successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

/*
=========================
DELETE ADDRESS
=========================
*/

export const deleteAddressController =
  async (req, res, next) => {
    try {
      const data =
        await deleteAddressService(
          req.user._id,
          req.params.addressId
        );

      return res.status(200).json({
        success: true,
        message:
          "Address deleted successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };