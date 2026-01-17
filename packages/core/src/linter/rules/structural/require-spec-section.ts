import { Rule, RuleResult, ParsedSpec } from '../../types';

export const requireSpecSectionRule: Rule = {
  id: 'require-spec-section',
  category: 'structural',
  description: 'Ensures spec section exists',
  severity: 'error',
  run(spec: ParsedSpec): RuleResult {
    if (!spec.spec.spec) {
      return {
        passed: false,
        issues: [
          {
            message: 'Spec section is missing',
            path: ['spec'],
            severity: 'error',
            suggestion: 'Add a spec section with objective, scope, and success_criteria',
          },
        ],
        score: 0,
      };
    }

    return { passed: true, issues: [], score: 1 };
  },
};
