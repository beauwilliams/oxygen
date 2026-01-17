import { z } from 'zod';

export const SpecContentSchema = z.object({
  objective: z.string().min(1, 'Objective is required'),
  scope: z.string().min(1, 'Scope is required'),
  success_criteria: z.array(z.string()).min(1, 'At least one success criterion is required'),
  constraints: z
    .array(
      z.object({
        type: z.string(),
        description: z.string(),
        rationale: z.string().optional(),
        impact: z.string().optional(),
        mitigation: z.string().optional(),
      })
    )
    .optional(),
  dependencies: z.array(z.string()).optional(), // Array of spec IDs
  out_of_scope: z.array(z.string()).optional(),
});

export type SpecContent = z.infer<typeof SpecContentSchema>;
