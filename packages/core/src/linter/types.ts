import { Spec } from '../schema/spec';
import { TechnicalDetail, ProductDetail, IntegrationDetail } from '../schema/index';

export type RuleCategory = 'structural' | 'technical' | 'product' | 'integration' | 'consistency';

export type RuleSeverity = 'error' | 'warning' | 'info';

export interface ParsedSpec {
  spec: Spec;
  technical: TechnicalDetail | null;
  product: ProductDetail | null;
  integration: IntegrationDetail | null;
}

export interface RuleIssue {
  message: string;
  path: string[];
  severity: RuleSeverity;
  suggestion?: string;
}

export interface RuleResult {
  passed: boolean;
  issues: RuleIssue[];
  score: number; // 0-1, where 1 is perfect
}

export interface Rule {
  id: string;
  category: RuleCategory;
  description: string;
  severity: RuleSeverity;
  run(spec: ParsedSpec): RuleResult;
}

export interface CategoryScores {
  structural: number;
  technical: number;
  product: number;
  integration: number;
  consistency: number;
}

export interface LinterResult {
  passed: boolean;
  overallScore: number; // 0-1
  categoryScores: CategoryScores;
  issues: RuleIssue[];
  rulesRun: number;
  rulesPassed: number;
  rulesFailed: number;
}

// LinterConfig interface - matches schema but defined here to avoid export conflicts
export interface LinterConfig {
  rules?: Record<
    string,
    'error' | 'warning' | 'info' | 'off' | ['error' | 'warning' | 'info', Record<string, unknown>]
  >;
  customRules?: string[];
  scoreThresholds?: {
    structural?: number;
    technical?: number;
    product?: number;
    integration?: number;
    consistency?: number;
    overall?: number;
  };
  weights?: {
    structural?: number;
    technical?: number;
    product?: number;
    integration?: number;
    consistency?: number;
  };
}
