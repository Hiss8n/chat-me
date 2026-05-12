import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("CONNECTED TO DB,CONNECTION STR");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
