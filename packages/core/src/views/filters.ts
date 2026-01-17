import { Spec } from '../schema/spec';
import { TechnicalDetail, ProductDetail, IntegrationDetail } from '../schema/index';
import { ViewType, FilteredSpec } from './types';

export class ViewFilters {
  /**
   * Filter spec based on view type
   */
  filterSpec(
    spec: Spec,
    technical: TechnicalDetail | null,
    product: ProductDetail | null,
    integration: IntegrationDetail | null,
    viewType: ViewType
  ): FilteredSpec {
    switch (viewType) {
      case 'full':
        return this.filterFull(spec, technical, product, integration);
      case 'execution':
        return this.filterExecution(spec, technical, product, integration);
      case 'reference':
        return this.filterReference(spec, technical, product, integration);
      default:
        return this.filterFull(spec, technical, product, integration);
    }
  }

  /**
   * Full view: All sections, all details
   */
  private filterFull(
    spec: Spec,
    technical: TechnicalDetail | null,
    product: ProductDetail | null,
    integration: IntegrationDetail | null
  ): FilteredSpec {
    return {
      meta: spec.meta,
      spec: spec.spec,
      technical_detail: technical || undefined,
      product_detail: product || undefined,
      integration_detail: integration || undefined,
      risk: spec.risk,
    };
  }

  /**
   * Execution view: Removes business context, keeps implementation details
   * Removes: impact, effort, risk.unknown_unknowns, analysis, workspace, history
   * Keeps: meta, spec, risk.technical_risks, risk.assumptions (validated only), ALL detail files
   */
  private filterExecution(
    spec: Spec,
    technical: TechnicalDetail | null,
    product: ProductDetail | null,
    integration: IntegrationDetail | null
  ): FilteredSpec {
    const filteredRisk = spec.risk
      ? {
          technical_risks: spec.risk.technical_risks,
          assumptions: spec.risk.assumptions?.filter((a) => a.validated),
        }
      : undefined;

    return {
      meta: spec.meta,
      spec: spec.spec,
      technical_detail: technical || undefined,
      product_detail: product || undefined,
      integration_detail: integration || undefined,
      risk: filteredRisk,
    };
  }

  /**
   * Reference view: Integration surface only
   * Contains: objective (one-line), summary, scope, public APIs (contracts only),
   * data models (shared fields only), events, dependencies, constraints, ownership
   */
  private filterReference(
    spec: Spec,
    _technical: TechnicalDetail | null,
    _product: ProductDetail | null,
    integration: IntegrationDetail | null
  ): FilteredSpec {
    // Extract one-line objective
    const objective = spec.spec.objective.split('\n')[0];

    return {
      meta: {
        id: spec.meta.id,
        version: spec.meta.version,
        status: spec.meta.status,
        created_at: spec.meta.created_at,
      },
      spec: {
        objective,
        scope: spec.spec.scope,
        dependencies: spec.spec.dependencies,
        constraints: spec.spec.constraints,
      },
      integration_detail: integration
        ? {
            contracts: integration.contracts,
            data_models: integration.data_models,
            webhooks: integration.webhooks,
            rate_limits: integration.rate_limits,
          }
        : undefined,
    };
  }
}
