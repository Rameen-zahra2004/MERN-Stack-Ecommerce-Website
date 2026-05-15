import ApiKey from "./apiKey.model.js";

import {
  generateApiKey,
  hashApiKey,
} from "./apiKey.utils.js";

import {
  API_KEY_MESSAGES,
} from "./apiKey.constants.js";

/*
=========================
GET API KEYS
=========================
*/

export const getApiKeysService =
  async ({
    page = 1,
    limit = 20,
  }) => {
    const skip = (page - 1) * limit;

    const [data, total] =
      await Promise.all([
        ApiKey.find()
          .populate(
            "createdBy",
            "name email"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        ApiKey.countDocuments(),
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
GET SINGLE API KEY
=========================
*/

export const getSingleApiKeyService =
  async (id) => {
    const apiKey =
      await ApiKey.findById(id)
        .populate(
          "createdBy",
          "name email"
        )
        .lean();

    if (!apiKey) {
      throw new Error(
        API_KEY_MESSAGES.NOT_FOUND
      );
    }

    return apiKey;
  };

/*
=========================
CREATE API KEY
=========================
*/

export const createApiKeyService =
  async (payload, adminId) => {
    const plainKey =
      generateApiKey();

    const hashedKey =
      hashApiKey(plainKey);

    const apiKey =
      await ApiKey.create({
        ...payload,

        key: plainKey,

        hashedKey,

        createdBy: adminId,
      });

    return {
      apiKey,
      plainKey,
    };
  };

/*
=========================
DELETE API KEY
=========================
*/

export const deleteApiKeyService =
  async (id) => {
    const deleted =
      await ApiKey.findByIdAndDelete(
        id
      );

    if (!deleted) {
      throw new Error(
        API_KEY_MESSAGES.NOT_FOUND
      );
    }

    return deleted;
  };

/*
=========================
VALIDATE API KEY
=========================
*/

export const validateApiKeyService =
  async (key) => {
    const hashedKey =
      hashApiKey(key);

    const apiKey =
      await ApiKey.findOne({
        hashedKey,
      });

    if (!apiKey) {
      throw new Error(
        API_KEY_MESSAGES.INVALID_KEY
      );
    }

    if (!apiKey.isActive) {
      throw new Error(
        API_KEY_MESSAGES.DISABLED_KEY
      );
    }

    if (
      apiKey.expiresAt &&
      apiKey.expiresAt < new Date()
    ) {
      throw new Error(
        API_KEY_MESSAGES.EXPIRED_KEY
      );
    }

    apiKey.lastUsedAt =
      new Date();

    apiKey.usageCount += 1;

    await apiKey.save();

    return apiKey;
  };