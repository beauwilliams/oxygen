import { Rule, RuleResult, ParsedSpec } from '../../types';

export const successCriteriaMeasurabilityRule: Rule = {
  id: 'success-criteria-measurability',
  category: 'product',
  description: 'Ensures success criteria are measurable',
  severity: 'error',
  run(spec: ParsedSpec): RuleResult {
    const issues: RuleResult['issues'] = [];

    if (!spec.spec.spec?.success_criteria || spec.spec.spec.success_criteria.length === 0) {
      issues.push({
        message: 'No success criteria defined',
        path: ['spec', 'success_criteria'],
        severity: 'error',
        suggestion: 'Define at least one measurable success criterion',
      });
      return { passed: false, issues, score: 0 };
    }

    // Check if criteria are measurable (contain metrics, numbers, or testable conditions)
    const measurableIndicators = /\d+|metric|threshold|test|verify|validate|measure/i;
    const nonMeasurable = spec.spec.spec.success_criteria.filter(
      (criterion) => !measurableIndicators.test(criterion)
    );

    if (nonMeasurable.length > 0) {
      issues.push({
        message: `${nonMeasurable.length} success criterion/criteria may not be measurable`,
        path: ['spec', 'success_criteria'],
        severity: 'error',
        suggestion: 'Ensure success criteria contain metrics, thresholds, or testable conditions',
      });
    }

    const passed = issues.length === 0;
    return {
      passed,
      issues,
      score: passed ? 1 : 0.5,
    };
  },
};
