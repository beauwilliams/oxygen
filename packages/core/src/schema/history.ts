import { z } from 'zod';

export const HistorySchema = z.object({
  versions: z
    .array(
      z.object({
        version: z.string(),
        changed_at: z.string().datetime(),
        changed_by: z.string().optional(),
        changes: z.string().optional(),
      })
    )
    .optional(),
  reviews: z
    .array(
      z.object({
        reviewed_at: z.string().datetime(),
        reviewed_by: z.string().optional(),
        status: z.enum(['approved', 'requested_changes', 'rejected']).optional(),
        comments: z.string().optional(),
      })
    )
    .optional(),
  changes: z
    .array(
      z.object({
        changed_at: z.string().datetime(),
        changed_by: z.string().optional(),
        section: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export type History = z.infer<typeof HistorySchema>;
