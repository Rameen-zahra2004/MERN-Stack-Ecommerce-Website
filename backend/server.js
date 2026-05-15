// import env from "./config/env.js";

// import app from "./app.js";
// import connectDB from "./config/db.js";

// /*
// =========================
// PROCESS SAFETY (CRASH HANDLING)
// =========================
// */

// process.on("uncaughtException", (err) => {
//   console.error("🔥 UNCAUGHT EXCEPTION:");
//   console.error(err.name, err.message);
//   process.exit(1);
// });

// process.on("unhandledRejection", (err) => {
//   console.error("🔥 UNHANDLED REJECTION:");
//   console.error(err);
//   process.exit(1);
// });

// /*
// =========================
// START SERVER
// =========================
// */

// const startServer = async () => {
//   try {
//     await connectDB();

//     const server = app.listen(env.PORT, () => {
//       console.log(`
// =================================
// 🚀 Server Running Successfully
// =================================
// Environment : ${env.NODE_ENV}
// Port        : ${env.PORT}
// DB          : Connected
// =================================
//       `);
//     });

//     /*
//     =========================
//     GRACEFUL SHUTDOWN
//     =========================
//     */

//     const shutdown = async () => {
//       console.log("🛑 Shutting down server...");

//       server.close(async () => {
//         console.log("🔌 HTTP server closed");

//         process.exit(0);
//       });
//     };

//     process.on("SIGTERM", shutdown);
//     process.on("SIGINT", shutdown);

//   } catch (error) {
//     console.error("❌ Server Startup Failed");
//     console.error(error);
//     process.exit(1);
//   }
// };

// startServer();
import env from "./config/env.js";

import app from "./app.js";

import connectDB from "./config/db.js";

import mongoose from "mongoose";

/*
=========================
PROCESS SAFETY
=========================
*/

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "🔥 UNCAUGHT EXCEPTION"
    );

    console.error(error);

    process.exit(1);
  }
);

process.on(
  "unhandledRejection",
  (reason) => {
    console.error(
      "🔥 UNHANDLED REJECTION"
    );

    console.error(reason);

    process.exit(1);
  }
);

/*
=========================
START SERVER
=========================
*/

const startServer = async () => {
  try {
    /*
    =========================
    CONNECT DATABASE
    =========================
    */

    await connectDB();

    /*
    =========================
    START EXPRESS SERVER
    =========================
    */

    const server = app.listen(
      env.PORT,
      () => {
        console.log(`
=================================
🚀 Server Running Successfully
=================================
Environment : ${env.NODE_ENV}
Port        : ${env.PORT}
Database    : Connected
=================================
        `);
      }
    );

    /*
    =========================
    GRACEFUL SHUTDOWN
    =========================
    */

    let isShuttingDown = false;

    const shutdown = async (
      signal
    ) => {
      if (isShuttingDown) return;

      isShuttingDown = true;

      console.log(
        `\n🛑 ${signal} received. Shutting down gracefully...`
      );

      server.close(async () => {
        try {
          /*
          =========================
          CLOSE MONGODB
          =========================
          */

          await mongoose.connection.close();

          console.log(
            "📦 MongoDB connection closed"
          );

          console.log(
            "🔌 HTTP server closed"
          );

          process.exit(0);
        } catch (error) {
          console.error(
            "❌ Shutdown error:"
          );

          console.error(error);

          process.exit(1);
        }
      });
    };

    process.on(
      "SIGINT",
      () => shutdown("SIGINT")
    );

    process.on(
      "SIGTERM",
      () => shutdown("SIGTERM")
    );

  } catch (error) {
    console.error(
      "❌ Server Startup Failed"
    );

    console.error(error);

    process.exit(1);
  }
};

startServer();