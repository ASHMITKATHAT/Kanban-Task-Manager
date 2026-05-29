import mongoose from 'mongoose';
import { logger } from './logger';

const DB_PREFIX = '8c29_';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kanban');
    logger.info('MongoDB Connected Successfully');
  } catch (err) {
    logger.error('MongoDB Connection Error:', err as Error);
    process.exit(1);
  }
};

export { connectDB, DB_PREFIX };
