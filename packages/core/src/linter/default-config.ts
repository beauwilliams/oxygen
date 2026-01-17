import { LinterConfig } from './types';

export function getDefaultConfig(): LinterConfig {
  return {
    rules: {
      // Structural rules
      'require-meta': 'error',
      'require-spec-section': 'error',
      'field-presence': 'error',
      'non-empty-validation': 'warning',
      // Technical rules
      'architecture-decisions': 'warning',
      'performance-requirements': 'warning',
      'error-handling': 'warning',
      'edge-cases': 'info',
      // Product rules
      'user-flow-completeness': 'warning',
      'success-criteria-measurability': 'error',
      'constraint-specifications': 'warning',
      // Integration rules
      'contract-completeness': 'warning',
      'data-model-completeness': 'warning',
      'error-scenarios': 'warning',
      'retry-strategies': 'info',
      'rate-limits': 'info',
      // Consistency rules
      'constraint-conflicts': 'error',
      'assumption-contradictions': 'warning',
      'dependency-consistency': 'error',
      'scope-criteria-alignment': 'warning',
    },
    scoreThresholds: {
      overall: 0.7,
    },
    weights: {
      structural: 0.2,
      technical: 0.3,
      product: 0.3,
      integration: 0.2,
      consistency: 0.0,
    },
  };
}
