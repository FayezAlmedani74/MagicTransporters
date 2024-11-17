import dotenv from "dotenv";
import mongoose from "mongoose";
import retry from "retry";

dotenv.config();

async function connectDB() {
  const DB_URI = process.env.DATABASE_URI;
  if (!DB_URI)
    throw new Error(
      "DATABASE_URI is not defined in the environment variables."
    );
  const operation = retry.operation({
    retries: 5,
    factor: 2,
    minTimeout: 1000,
  });
  operation.attempt(async (currentAttempt) => {
    try {
      await mongoose.connect(DB_URI, {
        maxPoolSize: 5,
        socketTimeoutMS: 45000,
      });
      console.log("MongoDB Connected Successfully.");
    } catch (err) {
      if (err instanceof Error && operation.retry(err)) {
        console.log(`Retrying MongoDB connection: Attempt ${currentAttempt}`);
        return;
      }
      console.error("All attempts to connect to MongoDB failed", err);
      process.exit(1);
    }
  });
}

export default connectDB;
