// Export types but avoid conflicts with schema exports
export type {
  RuleCategory,
  RuleSeverity as LinterRuleSeverity,
  ParsedSpec,
  RuleIssue,
  RuleResult,
  Rule,
  CategoryScores,
  LinterResult,
  LinterConfig as LinterConfigType,
} from './types';
export * from './linter';
export * from './scorer';
export * from './default-config';
export * from './rules/index';
