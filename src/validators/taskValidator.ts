import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  column: z.string(),
  board: z.string(),
  assignees: z.array(z.string()).optional().default([]),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  labels: z.array(z.string().max(50)).optional().default([]),
  deadline: z.string().datetime().optional(),
  estimatedHours: z.number().min(0).optional(),
  order: z.number().int().min(0).optional().default(0),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  column: z.string().optional(),
  assignees: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  labels: z.array(z.string().max(50)).optional(),
  deadline: z.string().datetime().optional().nullable(),
  estimatedHours: z.number().min(0).optional().nullable(),
  order: z.number().int().min(0).optional(),
  checklist: z.array(z.object({ text: z.string().max(500), checked: z.boolean() })).optional(),
});

export const addCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const addAttachmentSchema = z.object({
  filename: z.string().min(1).max(255),
  url: z.string().url(),
  mimetype: z.string().min(1),
  size: z.number().int().min(0),
});

export const timeEntrySchema = z.object({
  duration: z.number().min(1),
  description: z.string().max(500).optional(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
});

export const taskFilterSchema = z.object({
  board: z.string().optional(),
  column: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assignee: z.string().optional(),
  labels: z.string().optional(),
  search: z.string().optional(),
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.enum(['createdAt', 'deadline', 'priority', 'title', 'updatedAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const taskIdSchema = z.object({
  id: z.string(),
});
