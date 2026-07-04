import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "My Store",
    },

    currency: {
      type: String,
      default: "PKR",
    },

    taxRate: {
      type: Number,
      default: 0,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    maxCartItems: {
      type: Number,
      default: 20,
    },

    maxOrderLimit: {
      type: Number,
      default: 100,
    },

    features: {
      coupons: {
        type: Boolean,
        default: true,
      },

      reviews: {
        type: Boolean,
        default: true,
      },

      payments: {
        type: Boolean,
        default: true,
      },
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


systemSettingSchema.index({ _id: 1 });

const SystemSetting = mongoose.model(
  "SystemSetting",
  systemSettingSchema
);

export default SystemSetting;
