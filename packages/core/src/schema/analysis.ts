import { z } from 'zod';

export const AnalysisSchema = z.object({
  roi: z
    .object({
      expected_value: z.number().optional(),
      probability_of_success: z.number().min(0).max(1).optional(),
      calculated_at: z.string().datetime().optional(),
    })
    .optional(),
  decision: z
    .object({
      recommendation: z.enum(['approve', 'defer', 'reject']).optional(),
      reasoning: z.string().optional(),
      calculated_at: z.string().datetime().optional(),
    })
    .optional(),
});

export type Analysis = z.infer<typeof AnalysisSchema>;
