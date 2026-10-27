import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crewup';
  const isAtlas = uri.startsWith('mongodb+srv://');

  console.log(`[DB] Attempting database connection (${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'})...`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isAtlas ? 4500 : 2500,
    });
    console.log(`[DB] Successfully connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (initialErr) {
    console.warn(`[DB] Could not connect to configured MongoDB URI (${initialErr.message}).`);
    console.log('[DB] Launching embedded MongoDB fallback so authentication and full application workflows run immediately...');

    try {
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[DB] Successfully connected to Embedded MongoDB instance: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error('[DB] Failed to initialize fallback database:', memErr.message);
      throw memErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
