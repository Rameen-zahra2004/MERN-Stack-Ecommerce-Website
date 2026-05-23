import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "USER",
        "ADMIN",
        "SUPER_ADMIN",
        "MODERATOR",
      ],
      default: "USER",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
    },

    refreshToken: {
      type: String,
      select: false,
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

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model(
  "User",
  userSchema
);

export default User;
