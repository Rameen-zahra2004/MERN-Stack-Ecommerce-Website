/**
 * Deletes every Admin document EXCEPT the one with the email
 * specified in KEEP_EMAIL below. Use this to clean up duplicate/
 * stale admin accounts.
 *
 * Run from your backend folder:
 *   node scripts/cleanupAdmins.js
 */

import mongoose from "mongoose";
import env from "../config/env.js";
import Admin from "../modules/admin/Admin.model.js";

// ──────────────────────────────────────────────
const KEEP_EMAIL = "zrameen211@gmail.com";
// ──────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const toDelete = await Admin.find({ email: { $ne: KEEP_EMAIL } });

    if (toDelete.length === 0) {
      console.log("Nothing to delete — only the kept admin exists.");
      process.exit(0);
    }

    console.log(`About to delete ${toDelete.length} admin(s):`);
    toDelete.forEach((a) => {
      console.log(
        `- ${a.email || "(no email)"} | role: ${a.role} | id: ${a._id}`,
      );
    });

    const result = await Admin.deleteMany({ email: { $ne: KEEP_EMAIL } });

    console.log(
      `\n✅ Deleted ${result.deletedCount} admin(s). Kept: ${KEEP_EMAIL}`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
};

run();
