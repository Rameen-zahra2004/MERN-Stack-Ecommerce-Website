/**
 * Lists every User-collection document with role "ADMIN" (or "admin"),
 * so you can confirm exactly which account(s) to demote.
 *
 * Run from your backend folder:
 *   node scripts/listUserAdmins.js
 */

import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../modules/user/User.model.js";

const run = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const users = await User.find({
      role: { $in: ["ADMIN", "admin"] },
    }).select("name email role createdAt");

    if (users.length === 0) {
      console.log("No User documents with role ADMIN found.");
    } else {
      console.log(`Found ${users.length} user(s) with admin role:\n`);
      users.forEach((u, i) => {
        console.log(
          `${i + 1}. ${u.email} | role: ${u.role} | id: ${u._id} | created: ${u.createdAt}`,
        );
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
};

run();
