import Profile from "./Profile.model.js";

import {
  PROFILE_MESSAGES,
} from "./profile.constants.js";

/*
=========================
GET PROFILE
=========================
*/

export const getProfileService =
  async (userId) => {
    let profile =
      await Profile.findOne({
        user: userId,
      });

    if (!profile) {
      profile =
        await Profile.create({
          user: userId,
        });
    }

    return profile;
  };

/*
=========================
UPDATE PROFILE
=========================
*/

export const updateProfileService =
  async (userId, payload) => {
    const profile =
      await Profile.findOneAndUpdate(
        { user: userId },
        payload,
        {
          new: true,
          upsert: true,
        }
      );

    return profile;
  };

/*
=========================
ADD ADDRESS
=========================
*/

export const addAddressService =
  async (userId, address) => {
    const profile =
      await Profile.findOne({
        user: userId,
      });

    if (!profile) {
      throw new Error(
        PROFILE_MESSAGES.NOT_FOUND
      );
    }

    if (address.isDefault) {
      profile.addresses.forEach(
        (a) => (a.isDefault = false)
      );
    }

    profile.addresses.push(address);

    await profile.save();

    return profile;
  };

/*
=========================
DELETE ADDRESS
=========================
*/

export const deleteAddressService =
  async (userId, addressId) => {
    const profile =
      await Profile.findOne({
        user: userId,
      });

    profile.addresses =
      profile.addresses.filter(
        (a) =>
          a._id.toString() !==
          addressId
      );

    await profile.save();

    return profile;
  };
