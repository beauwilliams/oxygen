import { z } from 'zod';

export const WorkspaceSchema = z.object({
  open_questions: z
    .array(
      z.object({
        question: z.string(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        assigned_to: z.string().optional(),
        status: z.enum(['open', 'in_progress', 'resolved']).optional(),
      })
    )
    .optional(),
  research: z
    .array(
      z.object({
        topic: z.string(),
        findings: z.string().optional(),
        sources: z.array(z.string()).optional(),
        status: z.enum(['pending', 'in_progress', 'completed']).optional(),
      })
    )
    .optional(),
  alternatives: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        rejected: z.boolean().optional(),
        rejection_reason: z.string().optional(),
      })
    )
    .optional(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
