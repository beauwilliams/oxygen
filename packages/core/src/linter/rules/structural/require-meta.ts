import { Rule, RuleResult, ParsedSpec } from '../../types';

export const requireMetaRule: Rule = {
  id: 'require-meta',
  category: 'structural',
  description: 'Ensures meta section exists with required fields',
  severity: 'error',
  run(spec: ParsedSpec): RuleResult {
    const issues: RuleResult['issues'] = [];

    if (!spec.spec.meta) {
      issues.push({
        message: 'Meta section is missing',
        path: ['meta'],
        severity: 'error',
        suggestion: 'Add a meta section with id, version, status, and created_at',
      });
      return { passed: false, issues, score: 0 };
    }

    const meta = spec.spec.meta;
    const requiredFields = ['id', 'version', 'status', 'created_at'];

    for (const field of requiredFields) {
      if (!(field in meta) || (meta as Record<string, unknown>)[field] === undefined) {
        issues.push({
          message: `Required field '${field}' is missing in meta section`,
          path: ['meta', field],
          severity: 'error',
          suggestion: `Add the '${field}' field to the meta section`,
        });
      }
    }

    const passed = issues.length === 0;
    return {
      passed,
      issues,
      score: passed ? 1 : 0,
    };
  },
};
