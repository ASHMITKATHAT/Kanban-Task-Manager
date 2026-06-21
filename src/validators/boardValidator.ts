import { z } from 'zod';

export const boardIdSchema = z.string().uuid(); // Assuming IDs are UUIDs, adjust if using ObjectId

export const createBoardSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
}).partial(); // Allow partial updates

export const getBoardSchema = z.object({
  id: z.string(), // Use appropriate schema for ID, e.g., z.string().uuid() or z.string()
});
