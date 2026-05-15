import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "MODERATOR",
      ],
      default: "ADMIN",
      index: true,
    },

    permissions: {
      type: [String],
      default: [],
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      select: false,
      default: null,
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

adminSchema.index({
  email: 1,
});

adminSchema.index({
  role: 1,
});

adminSchema.index({
  isActive: 1,
});

/*
=========================
HASH PASSWORD
=========================
*/

adminSchema.pre(
  "save",
  async function (next) {
    if (!this.isModified("password")) {
      return next();
    }

    this.password =
      await bcrypt.hash(
        this.password,
        12
      );

    next();
  }
);

/*
=========================
COMPARE PASSWORD
=========================
*/

adminSchema.methods.comparePassword =
  async function (password) {
    return bcrypt.compare(
      password,
      this.password
    );
  };

/*
=========================
REMOVE SENSITIVE FIELDS
=========================
*/

adminSchema.methods.toJSON =
  function () {
    const admin =
      this.toObject();

    delete admin.password;
    delete admin.refreshToken;

    return admin;
  };

const Admin = mongoose.model(
  "Admin",
  adminSchema
);

export default Admin;