import mongoose from "mongoose";
import env from "./env.js";


const mongoOptions = {
  autoIndex: env.NODE_ENV !== "production",
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
};


let cached = globalThis._mongoose;

if (!cached) {
  cached = globalThis._mongoose = {
    conn: null,
    promise: null,
  };
}


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
