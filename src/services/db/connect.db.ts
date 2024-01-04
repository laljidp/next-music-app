// utils/db.js

import { config } from "@/constants";
import mongoose, { ConnectOptions, Mongoose } from "mongoose";

let cachedDb: Mongoose | null = null;

export const connectDB = async () => {
  if (cachedDb) {
    return Promise.resolve("DB connection revived::");
  }

  try {
    const mongoURI = config.mongoUri || "";
    const options: ConnectOptions = {
      serverSelectionTimeoutMS: 25000,
    };

    const db = await mongoose.connect(mongoURI, options);
    cachedDb = db;
    console.log(`database connected@::${Date.now().toString()}`);
    return db;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return Promise.reject(error);
  }
};
