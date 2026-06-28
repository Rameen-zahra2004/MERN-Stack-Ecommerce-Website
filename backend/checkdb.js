import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js"; // adjust path if different

await connectDB();

import mongoose from "mongoose";

const products = await mongoose.connection.db
  .collection("products")
  .find({})
  .sort({ createdAt: -1 })
  .limit(5)
  .toArray();

console.log(JSON.stringify(products, null, 2));

process.exit(0);
