// import mongoose from "mongoose";
// import env from "./env.js";

// /*
// =========================
// MONGODB OPTIONS
// =========================
// */

// const mongoOptions = {
//   autoIndex: env.NODE_ENV !== "production",

//   serverSelectionTimeoutMS: 5000,

//   socketTimeoutMS: 45000,

//   family: 4,
// };

// /*
// =========================
// CONNECTION STATE
// =========================
// */

// let isConnected = false;

// /*
// =========================
// CONNECT DATABASE
// =========================
// */

// const connectDB = async () => {
//   try {
//     if (isConnected) {
//       console.log(
//         "⚡ MongoDB already connected"
//       );

//       return;
//     }

//     const conn = await mongoose.connect(
//       env.MONGO_URI,
//       mongoOptions
//     );

//     isConnected =
//       mongoose.connections[0].readyState === 1;

//     if (!isConnected) {
//       throw new Error(
//         "MongoDB connection not established"
//       );
//     }

//     console.log(
//       `✅ MongoDB Connected: ${conn.connection.host}`
//     );

//     return conn;

//   } catch (error) {
//     isConnected = false;

//     console.error(
//       "❌ MongoDB connection failed:"
//     );

//     console.error(error.message);

//     /*
//     STOP SERVER STARTUP
//     */

//     throw error;
//   }
// };
// /*
// =========================
// MONGOOSE EVENTS
// =========================
// */

// mongoose.connection.on(
//   "connected",
//   () => {
//     console.log(
//       "🟢 MongoDB connection established"
//     );
//   }
// );

// mongoose.connection.on(
//   "disconnected",
//   () => {
//     console.warn(
//       "🟠 MongoDB disconnected"
//     );

//     isConnected = false;
//   }
// );

// mongoose.connection.on(
//   "reconnected",
//   () => {
//     console.log(
//       "🔄 MongoDB reconnected"
//     );

//     isConnected = true;
//   }
// );

// mongoose.connection.on(
//   "error",
//   (error) => {
//     console.error(
//       "🔴 MongoDB error:"
//     );

//     console.error(error.message);
//   }
// );

// /*
// =========================
// GRACEFUL SHUTDOWN
// =========================
// */

// process.on(
//   "SIGINT",
//   async () => {
//     try {
//       await mongoose.connection.close();

//       console.log(
//         "🛑 MongoDB connection closed"
//       );

//       process.exit(0);
//     } catch (error) {
//       console.error(
//         "❌ Error during shutdown:"
//       );

//       console.error(error.message);

//       process.exit(1);
//     }
//   }
// );

// export default connectDB;
import mongoose from "mongoose";
import env from "./env.js";

/*
=========================
MONGODB OPTIONS
=========================
*/

const mongoOptions = {
  autoIndex: env.NODE_ENV !== "production",
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
};

/*
=========================
GLOBAL CACHE (PERSISTS ACROSS SERVERLESS INVOCATIONS)
=========================
*/

let cached = globalThis._mongoose;

if (!cached) {
  cached = globalThis._mongoose = {
    conn: null,
    promise: null,
  };
}

/*
=========================
CONNECT DATABASE
=========================
*/

const connectDB = async () => {
  try {
    /*
    RETURN CACHED CONNECTION IF AVAILABLE
    */
    if (cached.conn) {
      console.log("⚡ MongoDB already connected (cached)");
      return cached.conn;
    }

    /*
    REUSE PENDING PROMISE IF EXISTS
    */
    if (!cached.promise) {
      console.log("🔄 Connecting to MongoDB...");

      cached.promise = mongoose
        .connect(env.MONGO_URI, mongoOptions)
        .then((mongoose) => {
          console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
          return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    /*
    RESET CACHE ON FAILURE SO NEXT REQUEST RETRIES
    */
    cached.promise = null;
    cached.conn = null;

    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

/*
=========================
MONGOOSE EVENTS
=========================
*/

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
  console.warn("🟠 MongoDB disconnected");
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("🔴 MongoDB error:", error.message);
  cached.conn = null;
  cached.promise = null;
});

export default connectDB;
