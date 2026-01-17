import { z } from 'zod';

export const IntegrationDetailSchema = z.object({
  integrations: z
    .array(
      z.object({
        service: z.string(),
        type: z.enum(['api', 'webhook', 'sdk', 'database', 'other']).optional(),
        description: z.string().optional(),
        authentication: z.string().optional(),
        endpoints: z.array(z.string()).optional(),
      })
    )
    .optional(),
  webhooks: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().optional(),
        events: z.array(z.string()).optional(),
        authentication: z.string().optional(),
        retry_strategy: z.string().optional(),
      })
    )
    .optional(),
  rate_limits: z
    .array(
      z.object({
        service: z.string(),
        limit: z.string().optional(),
        window: z.string().optional(),
        handling: z.string().optional(),
      })
    )
    .optional(),
  data_models: z
    .array(
      z.object({
        name: z.string(),
        service: z.string().optional(),
        fields: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            required: z.boolean().optional(),
            description: z.string().optional(),
          })
        ),
      })
    )
    .optional(),
  error_scenarios: z
    .array(
      z.object({
        scenario: z.string(),
        handling: z.string().optional(),
        retry_strategy: z.string().optional(),
      })
    )
    .optional(),
  retry_strategies: z
    .array(
      z.object({
        context: z.string(),
        strategy: z.string(),
        max_attempts: z.number().optional(),
        backoff: z.string().optional(),
      })
    )
    .optional(),
  contracts: z
    .array(
      z.object({
        name: z.string(),
        version: z.string().optional(),
        schema: z.record(z.unknown()).optional(),
        breaking_changes: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

export type IntegrationDetail = z.infer<typeof IntegrationDetailSchema>;
