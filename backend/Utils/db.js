import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoose connected successfully to database", connect.connection.name);
  } catch (error) {
    console.log("Mongo DB connection error", error);
  }
};
