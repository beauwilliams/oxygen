import { z } from 'zod';

export const RiskSchema = z.object({
  score: z.number().min(1).max(10).optional(), // Overall risk score (user-provided)
  technical_risks: z
    .array(
      z.object({
        description: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
        mitigation: z.string().optional(),
      })
    )
    .optional(),
  assumptions: z
    .array(
      z.object({
        assumption: z.string(),
        validated: z.boolean().optional(),
        validation_method: z.string().optional(),
      })
    )
    .optional(),
  rollback_difficulty: z.enum(['easy', 'medium', 'hard', 'very_hard']).optional(),
  blast_radius: z.enum(['isolated', 'component', 'system', 'organization']).optional(),
  unknown_unknowns: z.string().optional(), // Free-form text about unknown risks
});

export type Risk = z.infer<typeof RiskSchema>;
