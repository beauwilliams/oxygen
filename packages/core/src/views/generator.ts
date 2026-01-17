import { Spec } from '../schema/spec';
import { TechnicalDetail, ProductDetail, IntegrationDetail } from '../schema/index';
import { ViewType, ViewMetadata } from './types';
import { ViewFilters } from './filters';
import { MarkdownFormatter } from './markdown-formatter';
import { TokenEstimator } from './token-estimator';

export class ViewGenerator {
  private filters: ViewFilters;
  private formatter: MarkdownFormatter;
  private tokenEstimator: TokenEstimator;

  constructor() {
    this.filters = new ViewFilters();
    this.formatter = new MarkdownFormatter();
    this.tokenEstimator = new TokenEstimator();
  }

  /**
   * Generate a view of the spec
   */
  generate(
    spec: Spec,
    technical: TechnicalDetail | null,
    product: ProductDetail | null,
    integration: IntegrationDetail | null,
    viewType: ViewType
  ): { markdown: string; metadata: ViewMetadata } {
    // Filter spec based on view type
    const filtered = this.filters.filterSpec(spec, technical, product, integration, viewType);

    // Format as Markdown
    const markdown = this.formatter.format(filtered);

    // Estimate tokens
    const tokenEstimate = this.tokenEstimator.estimateMarkdownTokens(markdown);

    // Generate metadata
    const metadata: ViewMetadata = {
      specId: spec.meta.id,
      specVersion: spec.meta.version,
      viewType,
      generatedAt: new Date().toISOString(),
      tokenEstimate,
      specFileMtime: spec.meta.updated_at || spec.meta.created_at,
      cacheKey: `${spec.meta.id}-${viewType}-${spec.meta.version}`,
    };

    return { markdown, metadata };
  }
}
