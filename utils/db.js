import mongoose from "mongoose";

const connectToDB = async () => {
  if (mongoose.connections[0].readyState) {
    return; // Already connected
  }
  try {
    const DB_OPTIONS = {
      dbName: process.env.DB_NAME_LOCAL,
    };
    await mongoose.connect(process.env.DB_URL, DB_OPTIONS);
    console.log("MongoDB is connected successfully");
  } catch (error) {
    console.error(error);
  }
};

export default connectToDB;
