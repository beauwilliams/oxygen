import { z } from 'zod';

export const ImpactSchema = z.object({
  score: z.number().min(1).max(10).optional(), // Aggregated score (calculated)
  business_value: z.number().min(1).max(10).optional(),
  user_value: z.number().min(1).max(10).optional(),
  technical_value: z.number().min(1).max(10).optional(),
  competitive_value: z.number().min(1).max(10).optional(),
  description: z.string().optional(),
});

export type Impact = z.infer<typeof ImpactSchema>;
