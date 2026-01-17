import { z } from 'zod';

export const TechnicalDetailSchema = z.object({
  apis: z
    .array(
      z.object({
        name: z.string(),
        method: z.string().optional(),
        path: z.string().optional(),
        description: z.string().optional(),
        request_schema: z.record(z.unknown()).optional(),
        response_schema: z.record(z.unknown()).optional(),
        authentication: z.string().optional(),
        rate_limits: z.string().optional(),
      })
    )
    .optional(),
  data_models: z
    .array(
      z.object({
        name: z.string(),
        fields: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            required: z.boolean().optional(),
            description: z.string().optional(),
          })
        ),
        relationships: z.array(z.string()).optional(),
      })
    )
    .optional(),
  business_logic: z.string().optional(),
  performance: z
    .object({
      latency: z.string().optional(),
      throughput: z.string().optional(),
      scalability: z.string().optional(),
      requirements: z.string().optional(),
    })
    .optional(),
  architecture_decisions: z
    .array(
      z.object({
        decision: z.string(),
        rationale: z.string().optional(),
        alternatives: z.array(z.string()).optional(),
        consequences: z.string().optional(),
      })
    )
    .optional(),
  error_handling: z
    .object({
      strategies: z.array(z.string()).optional(),
      error_types: z
        .array(
          z.object({
            type: z.string(),
            handling: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  edge_cases: z.array(z.string()).optional(),
  state_machines: z
    .array(
      z.object({
        name: z.string(),
        states: z.array(z.string()),
        transitions: z.array(z.string()),
      })
    )
    .optional(),
});

export type TechnicalDetail = z.infer<typeof TechnicalDetailSchema>;
