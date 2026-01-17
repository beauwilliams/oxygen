import { Rule, RuleResult, ParsedSpec } from '../../types';

export const dependencyConsistencyRule: Rule = {
  id: 'dependency-consistency',
  category: 'consistency',
  description: 'Validates dependency references are consistent',
  severity: 'error',
  run(spec: ParsedSpec): RuleResult {
    const issues: RuleResult['issues'] = [];

    const dependencies = spec.spec.spec?.dependencies || [];
    if (dependencies.length === 0) {
      return { passed: true, issues: [], score: 1 };
    }

    // Check if dependencies match spec ID pattern
    const specIdPattern = /^spec-\d+$/;
    const invalidDeps = dependencies.filter((dep) => !specIdPattern.test(dep));

    if (invalidDeps.length > 0) {
      issues.push({
        message: `${invalidDeps.length} dependency/dependencies do not match spec ID pattern (spec-XXX)`,
        path: ['spec', 'dependencies'],
        severity: 'error',
        suggestion: 'Ensure all dependencies use the format spec-XXX',
      });
    }

    const passed = issues.length === 0;
    return {
      passed,
      issues,
      score: passed ? 1 : 0,
    };
  },
};
