import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';
import { loginUserSchema, registerUserSchema } from '../validators/authValidator';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    const { username, email, pwd, role } = validatedData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, pwd, role });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    logger.info(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);
    const { email, pwd } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(pwd); // Assuming comparePassword method is added to User model
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    logger.info(`User logged in: ${user.username}`);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
};

// update 2026-01-06 15:41:33
