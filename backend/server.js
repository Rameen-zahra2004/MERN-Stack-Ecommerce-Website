console.log("✅ server.js file loaded - starting...");

import env from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";


process.on("uncaughtException", (error) => {
  console.error("🔥 UNCAUGHT EXCEPTION");
  console.error(error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 UNHANDLED REJECTION");
  console.error(reason);
  process.exit(1);
});


const startServer = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");

    await connectDB();

    console.log("✅ MongoDB connected successfully");

    const server = app.listen(env.PORT, () => {
      console.log(`
=================================
🚀 Server Running Successfully
=================================
Environment : ${env.NODE_ENV}
Port        : ${env.PORT}
Database    : Connected
=================================
      `);
    });


    let isShuttingDown = false;

    const shutdown = async (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        try {
          await mongoose.connection.close();
          console.log("📦 MongoDB connection closed");
          console.log("🔌 HTTP server closed");
          process.exit(0);
        } catch (error) {
          console.error("❌ Shutdown error:");
          console.error(error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Server Startup Failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();
