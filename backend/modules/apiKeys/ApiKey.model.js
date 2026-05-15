import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      select: false,
    },

    hashedKey: {
      type: String,
      required: true,
      select: false,
    },

    permissions: {
      type: [String],
      default: [],
    },

    environment: {
      type: String,
      enum: [
        "development",
        "staging",
        "production",
      ],
      default: "production",
    },

    rateLimit: {
      type: Number,
      default: 1000,
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },

    lastUsedIp: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
=========================
INDEXES
=========================
*/

apiKeySchema.index({
  key: 1,
});

apiKeySchema.index({
  isActive: 1,
});

apiKeySchema.index({
  expiresAt: 1,
});

const ApiKey = mongoose.model(
  "ApiKey",
  apiKeySchema
);

export default ApiKey;