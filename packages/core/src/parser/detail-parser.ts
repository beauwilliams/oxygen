import { Spec } from '../schema/spec';
import {
  TechnicalDetail,
  TechnicalDetailSchema,
  ProductDetail,
  ProductDetailSchema,
  IntegrationDetail,
  IntegrationDetailSchema,
} from '../schema/index';
import { ValidationError } from '../utils/errors';

export class DetailParser {
  /**
   * Extract and validate technical detail section from parsed spec
   */
  parseTechnicalDetail(spec: Spec): TechnicalDetail | null {
    if (!spec.technical_detail) {
      return null;
    }

    try {
      return TechnicalDetailSchema.parse(spec.technical_detail);
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
        const path = ['technical_detail', ...(zodError.issues[0]?.path.map(String) || [])];
        const message = zodError.issues.map((i) => i.message).join('; ');
        throw new ValidationError(`Technical detail validation failed: ${message}`, path, error);
      }
      throw new ValidationError('Technical detail validation failed', ['technical_detail'], error);
    }
  }

  /**
   * Extract and validate product detail section from parsed spec
   */
  parseProductDetail(spec: Spec): ProductDetail | null {
    if (!spec.product_detail) {
      return null;
    }

    try {
      return ProductDetailSchema.parse(spec.product_detail);
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
        const path = ['product_detail', ...(zodError.issues[0]?.path.map(String) || [])];
        const message = zodError.issues.map((i) => i.message).join('; ');
        throw new ValidationError(`Product detail validation failed: ${message}`, path, error);
      }
      throw new ValidationError('Product detail validation failed', ['product_detail'], error);
    }
  }

  /**
   * Extract and validate integration detail section from parsed spec
   */
  parseIntegrationDetail(spec: Spec): IntegrationDetail | null {
    if (!spec.integration_detail) {
      return null;
    }

    try {
      return IntegrationDetailSchema.parse(spec.integration_detail);
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
        const path = ['integration_detail', ...(zodError.issues[0]?.path.map(String) || [])];
        const message = zodError.issues.map((i) => i.message).join('; ');
        throw new ValidationError(`Integration detail validation failed: ${message}`, path, error);
      }
      throw new ValidationError(
        'Integration detail validation failed',
        ['integration_detail'],
        error
      );
    }
  }

  /**
   * Parse all detail sections from a spec
   */
  parseAllDetails(spec: Spec): {
    technical: TechnicalDetail | null;
    product: ProductDetail | null;
    integration: IntegrationDetail | null;
  } {
    return {
      technical: this.parseTechnicalDetail(spec),
      product: this.parseProductDetail(spec),
      integration: this.parseIntegrationDetail(spec),
    };
  }
}
