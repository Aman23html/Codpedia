import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
  path: ".env",
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in .env");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached =
  globalForMongoose.mongooseCache ||
  (globalForMongoose.mongooseCache = {
    conn: null,
    promise: null,
  });

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}