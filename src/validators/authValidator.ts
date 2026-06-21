import { z } from 'zod';

export const registerUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  pwd: z.string().min(8).max(100),
  role: z.enum(['Admin', 'User']).optional().default('User'),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  pwd: z.string().min(8).max(100),
});
