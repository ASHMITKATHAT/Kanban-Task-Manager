import { z } from 'zod';

export const notificationFilterSchema = z.object({
  unreadOnly: z.coerce.boolean().optional().default(false),
  type: z.enum(['assignment', 'comment', 'mention', 'deadline', 'priority_change', 'status_change', 'board_invite']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

// update 2026-01-16 10:26:36

// update 2026-04-05 17:29:03

// update 2026-04-18 13:07:38

// update 2026-05-05 15:26:26
