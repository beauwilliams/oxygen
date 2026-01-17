import { Rule, RuleResult, ParsedSpec } from '../../types';

export const contractCompletenessRule: Rule = {
  id: 'contract-completeness',
  category: 'integration',
  description: 'Validates API contracts are complete',
  severity: 'warning',
  run(spec: ParsedSpec): RuleResult {
    const issues: RuleResult['issues'] = [];

    if (!spec.integration) {
      return {
        passed: true,
        issues: [],
        score: 1, // Not applicable if no integration detail
      };
    }

    // Check contracts
    const contracts = spec.integration.contracts;
    if (contracts && contracts.length > 0) {
      const incomplete = contracts.filter((c) => !c.name || !c.schema);
      if (incomplete.length > 0) {
        issues.push({
          message: `${incomplete.length} contract(s) missing name or schema`,
          path: ['integration_detail', 'contracts'],
          severity: 'warning',
          suggestion: 'Ensure all contracts have both name and schema defined',
        });
      }
    }

    // Check APIs in technical detail if available
    if (spec.technical?.apis && spec.technical.apis.length > 0) {
      const incomplete = spec.technical.apis.filter(
        (api) => !api.name || (!api.request_schema && !api.response_schema)
      );
      if (incomplete.length > 0) {
        issues.push({
          message: `${incomplete.length} API(s) missing name or schemas`,
          path: ['technical_detail', 'apis'],
          severity: 'warning',
          suggestion: 'Ensure all APIs have name and request/response schemas',
        });
      }
    }

    const passed = issues.length === 0;
    return {
      passed,
      issues,
      score: passed ? 1 : 0.7,
    };
  },
};
