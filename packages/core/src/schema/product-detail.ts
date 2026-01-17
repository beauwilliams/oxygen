import { z } from 'zod';

export const ProductDetailSchema = z.object({
  user_flows: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        start_state: z.string().optional(),
        steps: z.array(
          z.object({
            step: z.string(),
            action: z.string().optional(),
            outcome: z.string().optional(),
          })
        ),
        end_state: z.string().optional(),
      })
    )
    .optional(),
  copy: z
    .array(
      z.object({
        context: z.string(),
        text: z.string(),
        notes: z.string().optional(),
      })
    )
    .optional(),
  ui_components: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        props: z.array(z.string()).optional(),
        behavior: z.string().optional(),
      })
    )
    .optional(),
  edge_cases: z.array(z.string()).optional(),
});

export type ProductDetail = z.infer<typeof ProductDetailSchema>;
