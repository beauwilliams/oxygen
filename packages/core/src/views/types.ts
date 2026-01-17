import { Spec } from '../schema/spec';
import { TechnicalDetail, ProductDetail, IntegrationDetail } from '../schema/index';

export type ViewType = 'full' | 'execution' | 'reference';

export interface ViewMetadata {
  specId: string;
  specVersion: string;
  viewType: ViewType;
  generatedAt: string;
  tokenEstimate: number;
  specFileMtime: string;
  cacheKey: string;
}

export interface FilteredSpec {
  meta?: Spec['meta'];
  spec?: Partial<Spec['spec']>;
  technical_detail?: Partial<TechnicalDetail>;
  product_detail?: Partial<ProductDetail>;
  integration_detail?: Partial<IntegrationDetail>;
  risk?: Partial<Spec['risk']>;
}
