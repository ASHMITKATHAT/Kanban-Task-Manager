import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: 'Admin' | 'User';
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Token verification failed:', err);
      return res.sendStatus(403);
    }
    req.user = user as {
      userId: string;
      role: 'Admin' | 'User';
    };
    next();
  });
};

export const authorizeRoles = (...roles: ('Admin' | 'User')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by role: ${req.user?.role}`);
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

// update 2026-03-18 09:58:07
