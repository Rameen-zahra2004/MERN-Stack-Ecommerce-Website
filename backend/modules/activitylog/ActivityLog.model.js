import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    module: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    method: {
      type: String,
      enum: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
      ],
      required: true,
    },

    endpoint: {
      type: String,
      required: true,
      trim: true,
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    userAgent: {
      type: String,
      trim: true,
    },

    statusCode: {
      type: Number,
      min: 100,
      max: 599,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ module: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ user: 1 });

const ActivityLog = mongoose.model(
  "ActivityLog",
  activityLogSchema
);

export default ActivityLog;