/**
 * One-time script: create a real SUPER_ADMIN account in the Admin collection.
 *
 * Run from your backend folder:
 *   node scripts/createSuperAdmin.js
 *
 * Edit the values below before running, then DELETE this script
 * (or at least remove the real values) once you're done — don't
 * leave real admin credentials sitting in a committed file.
 */

import mongoose from "mongoose";
import env from "../config/env.js";
import Admin from "../modules/admin/Admin.model.js";

// ──────────────────────────────────────────────
// EDIT THESE BEFORE RUNNING
// ──────────────────────────────────────────────
const ADMIN_NAME = "Rameen Zahra";
const ADMIN_EMAIL = "zrameen211@gmail.com";
const ADMIN_PASSWORD = "admin123"; // change to something stronger for real production use
// ──────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Admin.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log(
        `⚠️  Admin with email ${ADMIN_EMAIL} already exists. Aborting — no changes made.`,
      );
      console.log(
        "If you want to reset the password instead, do that explicitly, not via this script.",
      );
      process.exit(0);
    }

    const admin = new Admin({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // hashed automatically by the pre("save") hook
      role: "SUPER_ADMIN",
      permissions: [], // SUPER_ADMIN bypasses permission checks via role, not this array
      isActive: true,
    });

    await admin.save();

    console.log("✅ SUPER_ADMIN created successfully:");
    console.log({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
    process.exit(1);
  }
};

run();
