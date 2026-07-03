/**
 * One-time script: demote the User-collection account that was
 * temporarily given role "ADMIN" back to a normal "user".
 *
 * Run from your backend folder:
 *   node scripts/demoteUserAdmin.js
 *
 * Uses updateOne with validateBeforeSave: false equivalent (direct
 * field update) so we don't trip full-document validation on legacy
 * fields (firstName/lastName) that aren't relevant to this change.
 */

import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../modules/user/User.model.js";

// ──────────────────────────────────────────────
const TARGET_EMAIL = "adminrameen@gmail.com";
const NEW_ROLE = "user"; // confirm this matches your schema's enum casing
// ──────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const before = await User.findOne({ email: TARGET_EMAIL }).select(
      "email role firstName lastName",
    );

    if (!before) {
      console.log(
        `⚠️  No user found with email ${TARGET_EMAIL}. Nothing to do.`,
      );
      process.exit(0);
    }

    console.log("Found user:", {
      id: before._id.toString(),
      email: before.email,
      currentRole: before.role,
    });

    // Direct update, bypassing full-document validation (avoids
    // unrelated legacy-field validation errors like missing firstName/lastName)
    const result = await User.updateOne(
      { email: TARGET_EMAIL },
      { $set: { role: NEW_ROLE } },
      { runValidators: false },
    );

    console.log(
      `✅ Updated ${result.modifiedCount} document(s). ${TARGET_EMAIL} is now role: "${NEW_ROLE}".`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to demote user:", error.message);
    process.exit(1);
  }
};

run();
