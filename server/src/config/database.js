import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(env.MONGODB_URI);

    logger.info(`MongoDB connected: ${connection.connection.host}`);
    console.log('MongoDB connected successfully');

    return connection;
  } catch (error) {
    console.error('MONGODB CONNECTION ERROR:', error);
    logger.error('MongoDB connection failed', error);

    throw error;
  }
}