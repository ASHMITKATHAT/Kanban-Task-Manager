import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { logger } from './config/logger';
import errorHandler from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/boards', boardRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
