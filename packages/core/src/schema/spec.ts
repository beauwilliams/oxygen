import { z } from 'zod';
import { MetaSchema } from './meta';
import { SpecContentSchema } from './spec-content';
import { ImpactSchema } from './impact';
import { EffortSchema } from './effort';
import { RiskSchema } from './risk';
import { AnalysisSchema } from './analysis';
import { WorkspaceSchema } from './workspace';
import { HistorySchema } from './history';
import { RefinementSchema } from './refinement';
import { TechnicalDetailSchema } from './technical-detail';
import { ProductDetailSchema } from './product-detail';
import { IntegrationDetailSchema } from './integration-detail';

export const SpecSchema = z.object({
  meta: MetaSchema,
  spec: SpecContentSchema,
  impact: ImpactSchema.optional(),
  effort: EffortSchema.optional(),
  risk: RiskSchema.optional(),
  analysis: AnalysisSchema.optional(),
  workspace: WorkspaceSchema.optional(),
  history: HistorySchema.optional(),
  refinement: RefinementSchema.optional(),
  technical_detail: TechnicalDetailSchema.optional(),
  product_detail: ProductDetailSchema.optional(),
  integration_detail: IntegrationDetailSchema.optional(),
});

export type Spec = z.infer<typeof SpecSchema>;
