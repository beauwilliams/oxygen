import { z } from 'zod';

export const RefinementSchema = z.object({
  attempts: z
    .array(
      z.object({
        attempt_number: z.number(),
        branch_name: z.string().optional(),
        started_at: z.string().datetime().optional(),
        completed_at: z.string().datetime().optional(),
        progress: z.number().min(0).max(100).optional(),
        questions: z.array(z.string()).optional(),
        errors: z.array(z.string()).optional(),
        cost: z
          .object({
            tokens: z.number().optional(),
            estimated_cost: z.number().optional(),
          })
          .optional(),
        status: z.enum(['in_progress', 'completed', 'failed', 'terminated']).optional(),
      })
    )
    .optional(),
  validation_status: z.enum(['not_validated', 'validating', 'validated', 'failed']).optional(),
  reuse_metrics: z
    .object({
      times_reused: z.number().optional(),
      last_reused_at: z.string().datetime().optional(),
    })
    .optional(),
});

export type Refinement = z.infer<typeof RefinementSchema>;
