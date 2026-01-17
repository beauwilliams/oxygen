import { z } from 'zod';

export const RuleSeveritySchema = z.enum(['error', 'warning', 'info', 'off']);

export const RuleConfigSchema = z.union([
  RuleSeveritySchema,
  z.tuple([RuleSeveritySchema, z.record(z.unknown())]),
]);

export const LinterConfigSchema = z.object({
  rules: z.record(z.string(), RuleConfigSchema).optional(),
  customRules: z.array(z.string()).optional(), // Glob patterns for custom rule files
  scoreThresholds: z
    .object({
      structural: z.number().min(0).max(1).optional(),
      technical: z.number().min(0).max(1).optional(),
      product: z.number().min(0).max(1).optional(),
      integration: z.number().min(0).max(1).optional(),
      consistency: z.number().min(0).max(1).optional(),
      overall: z.number().min(0).max(1).optional(),
    })
    .optional(),
  weights: z
    .object({
      structural: z.number().min(0).max(1).optional(),
      technical: z.number().min(0).max(1).optional(),
      product: z.number().min(0).max(1).optional(),
      integration: z.number().min(0).max(1).optional(),
      consistency: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export type LinterConfig = z.infer<typeof LinterConfigSchema>;
export type RuleConfig = z.infer<typeof RuleConfigSchema>;
export type RuleSeverity = z.infer<typeof RuleSeveritySchema>;
