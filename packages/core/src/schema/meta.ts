import { z } from 'zod';

export const MetaSchema = z.object({
  id: z.string().regex(/^spec-\d+$/, 'ID must match pattern spec-XXX'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic version'),
  status: z.enum(['roadmap', 'draft', 'approved', 'executed', 'finalized']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  created_by: z.string().optional(),
  project_context: z
    .object({
      systems: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    })
    .optional(),
});

export type Meta = z.infer<typeof MetaSchema>;
