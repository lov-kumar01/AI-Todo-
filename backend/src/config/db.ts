import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ Error connecting MongoDB", error);
    console.warn("MongoDB unavailable. Running with in-memory dev storage.");
    return false;
  }
};
