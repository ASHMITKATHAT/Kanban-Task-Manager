import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const createColumnSchema = z.object({
  title: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
  wipLimit: z.number().int().min(1).max(50).optional(),
});

export const updateColumnSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  order: z.number().int().min(0).optional(),
  wipLimit: z.number().int().min(1).max(50).optional().nullable(),
});

export const addMemberSchema = z.object({
  userId: z.string(),
});

// update 2026-04-04 10:11:42
