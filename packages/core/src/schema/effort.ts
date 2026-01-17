import { z } from 'zod';

export const EffortSchema = z.object({
  total: z.number().optional(), // Total effort in dollars
  token_cost: z.number().optional(), // Estimated token cost
  actor_time_cost: z.number().optional(), // Actor time cost (negligible for agents)
  breakdown: z
    .object({
      spec_creation: z.number().optional(),
      implementation: z.number().optional(),
      testing: z.number().optional(),
    })
    .optional(),
  complexity: z.enum(['low', 'medium', 'high', 'very_high']).optional(),
  estimated_tokens: z.number().optional(), // Token count estimate
});

export type Effort = z.infer<typeof EffortSchema>;
