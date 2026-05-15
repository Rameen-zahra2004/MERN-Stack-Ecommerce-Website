import mongoose from "mongoose";

const activeUserSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
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

activeUserSchema.index({ recordedAt: -1 });

const ActiveUser = mongoose.model(
  "ActiveUser",
  activeUserSchema
);

export default ActiveUser;