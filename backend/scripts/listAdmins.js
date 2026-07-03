/**
 * Lists every document in the Admin collection so you can see
 * exactly what's there before deciding what to delete.
 *
 * Run from your backend folder:
 *   node scripts/listAdmins.js
 */

import mongoose from "mongoose";
import env from "../config/env.js";
import Admin from "../modules/admin/Admin.model.js";

const run = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const admins = await Admin.find({}).select(
      "name email role isActive createdAt",
    );

    if (admins.length === 0) {
      console.log("No admins found.");
    } else {
      console.log(`Found ${admins.length} admin(s):\n`);
      admins.forEach((a, i) => {
        console.log(
          `${i + 1}. ${a.email} | role: ${a.role} | active: ${a.isActive} | id: ${a._id} | created: ${a.createdAt}`,
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
