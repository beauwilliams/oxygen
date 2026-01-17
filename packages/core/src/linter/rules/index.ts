// Export all built-in rules
export * from './structural/require-meta';
export * from './structural/require-spec-section';
export * from './technical/architecture-decisions';
export * from './product/success-criteria-measurability';
export * from './integration/contract-completeness';
export * from './consistency/dependency-consistency';

// Collect all rules for easy registration
import { Rule } from '../types';
import { requireMetaRule } from './structural/require-meta';
import { requireSpecSectionRule } from './structural/require-spec-section';
import { architectureDecisionsRule } from './technical/architecture-decisions';
import { successCriteriaMeasurabilityRule } from './product/success-criteria-measurability';
import { contractCompletenessRule } from './integration/contract-completeness';
import { dependencyConsistencyRule } from './consistency/dependency-consistency';

export const builtInRules: Rule[] = [
  requireMetaRule,
  requireSpecSectionRule,
  architectureDecisionsRule,
  successCriteriaMeasurabilityRule,
  contractCompletenessRule,
  dependencyConsistencyRule,
];
