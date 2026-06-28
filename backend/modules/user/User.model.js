// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// /**
//  * User.model.js
//  * MongoDB schema for The 999 Boxs user accounts.
//  * Passwords are hashed via pre-save hook (never stored in plain text).
//  */

// const SALT_ROUNDS = 12;

// const userSchema = new mongoose.Schema(
//   {
//     // ── Identity ──────────────────────────────────────────────────────────
//     firstName: {
//       type: String,
//       required: [true, "First name is required."],
//       trim: true,
//       maxlength: [80, "First name cannot exceed 80 characters."],
//     },
//     lastName: {
//       type: String,
//       required: [true, "Last name is required."],
//       trim: true,
//       maxlength: [80, "Last name cannot exceed 80 characters."],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required."],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       maxlength: [255, "Email cannot exceed 255 characters."],
//       index: true,
//     },

//     // ── Security ──────────────────────────────────────────────────────────
//     password: {
//       type: String,
//       required: [true, "Password is required."],
//       minlength: [8, "Password must be at least 8 characters."],
//       select: false, // Never returned in queries by default
//     },

//     // ── Role-based access control ─────────────────────────────────────────
//     role: {
//       type: String,
//       enum: {
//         values: ["user", "admin", "moderator"],
//         message: "{VALUE} is not a valid role.",
//       },
//       default: "user",
//     },

//     // ── Account status ────────────────────────────────────────────────────
//     isActive: {
//       type: Boolean,
//       default: true, // Set to false to ban/suspend users
//     },
//     isEmailVerified: {
//       type: Boolean,
//       default: false,
//     },

//     // ── Email verification ────────────────────────────────────────────────
//     emailVerificationToken: {
//       type: String,
//       select: false, // Hashed token — never expose
//     },
//     emailVerificationExpires: {
//       type: Date,
//       select: false,
//     },

//     // ── Password reset ────────────────────────────────────────────────────
//     passwordResetToken: {
//       type: String,
//       select: false, // Hashed token — never expose
//     },
//     passwordResetExpires: {
//       type: Date,
//       select: false,
//     },

//     // ── Refresh token ─────────────────────────────────────────────────────
//     // Hashed refresh token stored for server-side validation & rotation
//     refreshToken: {
//       type: String,
//       select: false,
//     },

//     // ── Timestamps ────────────────────────────────────────────────────────
//     lastLoginAt: {
//       type: Date,
//     },
//     passwordChangedAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true, // createdAt, updatedAt
//     toJSON: {
//       transform: (_, ret) => {
//         delete ret.password;
//         delete ret.refreshToken;
//         delete ret.emailVerificationToken;
//         delete ret.emailVerificationExpires;
//         delete ret.passwordResetToken;
//         delete ret.passwordResetExpires;
//         return ret;
//       },
//     },
//   },
// );

// // ─── VIRTUALS ─────────────────────────────────────────────────────────────────

// userSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// // ─── PRE-SAVE HOOK: Hash password ────────────────────────────────────────────

// userSchema.pre("save", async function (next) {
//   // Only hash when password field is actually modified
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

//   // Track when password changed (for token invalidation)
//   if (!this.isNew) {
//     this.passwordChangedAt = new Date(Date.now() - 1000); // 1s buffer for JWT iat
//   }

//   next();
// });

// // ─── INSTANCE METHODS ─────────────────────────────────────────────────────────

// /**
//  * Compare a plain-text password against the stored hash.
//  */
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// /**
//  * Check if password was changed AFTER a JWT was issued.
//  * Used to invalidate tokens after password change.
//  * @param {number} jwtIat - JWT iat (issued at) timestamp in seconds
//  */
// userSchema.methods.changedPasswordAfter = function (jwtIat) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = Math.floor(
//       this.passwordChangedAt.getTime() / 1000,
//     );
//     return jwtIat < changedTimestamp;
//   }
//   return false;
// };

// // ─── INDEXES ──────────────────────────────────────────────────────────────────

// userSchema.index({ emailVerificationToken: 1 }, { sparse: true });
// userSchema.index({ passwordResetToken: 1 }, { sparse: true });

// const User = mongoose.model("User", userSchema);

// export default User;
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User.model.js
 * MongoDB schema for The 999 Boxs user accounts.
 * Passwords are hashed via pre-save hook (never stored in plain text).
 */

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      maxlength: [80, "First name cannot exceed 80 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
      maxlength: [80, "Last name cannot exceed 80 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [255, "Email cannot exceed 255 characters."],
      index: true,
    },

    // ── Security ──────────────────────────────────────────────────────────
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters."],
      select: false, // Never returned in queries by default
    },

    // ── Role-based access control ─────────────────────────────────────────
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "moderator"],
        message: "{VALUE} is not a valid role.",
      },
      default: "user",
    },

    // ── Account status ────────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true, // Set to false to ban/suspend users
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // ── Email verification ────────────────────────────────────────────────
    emailVerificationToken: {
      type: String,
      select: false, // Hashed token — never expose
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // ── Password reset ────────────────────────────────────────────────────
    passwordResetToken: {
      type: String,
      select: false, // Hashed token — never expose
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // ── Refresh token ─────────────────────────────────────────────────────
    // Hashed refresh token stored for server-side validation & rotation
    refreshToken: {
      type: String,
      select: false,
    },

    // ── Timestamps ────────────────────────────────────────────────────────
    lastLoginAt: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  },
);

// ─── VIRTUALS ─────────────────────────────────────────────────────────────────

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ─── PRE-SAVE HOOK: Hash password ────────────────────────────────────────────
// NOTE: Modern async pre-hooks should NOT take or call `next`.
// Mongoose awaits the returned promise automatically.

userSchema.pre("save", async function () {
  // Only hash when password field is actually modified
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

  // Track when password changed (for token invalidation)
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000); // 1s buffer for JWT iat
  }
});

// ─── INSTANCE METHODS ─────────────────────────────────────────────────────────

/**
 * Compare a plain-text password against the stored hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if password was changed AFTER a JWT was issued.
 * Used to invalidate tokens after password change.
 * @param {number} jwtIat - JWT iat (issued at) timestamp in seconds
 */
userSchema.methods.changedPasswordAfter = function (jwtIat) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    return jwtIat < changedTimestamp;
  }
  return false;
};

// ─── INDEXES ──────────────────────────────────────────────────────────────────

userSchema.index({ emailVerificationToken: 1 }, { sparse: true });
userSchema.index({ passwordResetToken: 1 }, { sparse: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
