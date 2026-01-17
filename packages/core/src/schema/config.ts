import { z } from 'zod';

export const SpecRegistryEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  file: z.string(), // Relative path from workspace root
  status: z.enum(['roadmap', 'draft', 'approved', 'executed', 'finalized']).optional(),
});

export type SpecRegistryEntry = z.infer<typeof SpecRegistryEntrySchema>;

export const OxygenConfigSchema = z.object({
  nextSpecId: z.number().default(1),
  specs: z.array(SpecRegistryEntrySchema).default([]),
  branchPattern: z.string().default('oxygen/spec-{id}-{attempt}'),
  agentProvider: z
    .object({
      type: z.enum(['noop', 'claude', 'openai']).default('noop'),
      model: z.string().optional(),
      apiKey: z.string().optional(), // Should be read from env, not stored
    })
    .optional(),
});

export type OxygenConfig = z.infer<typeof OxygenConfigSchema>;
