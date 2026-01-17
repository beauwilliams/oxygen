import { Rule, RuleResult, ParsedSpec } from '../../types';

export const architectureDecisionsRule: Rule = {
  id: 'architecture-decisions',
  category: 'technical',
  description: 'Checks for documented architecture decisions',
  severity: 'warning',
  run(spec: ParsedSpec): RuleResult {
    const issues: RuleResult['issues'] = [];

    if (!spec.technical) {
      return {
        passed: true,
        issues: [],
        score: 1, // Not applicable if no technical detail
      };
    }

    const decisions = spec.technical.architecture_decisions;
    if (!decisions || decisions.length === 0) {
      issues.push({
        message: 'No architecture decisions documented',
        path: ['technical_detail', 'architecture_decisions'],
        severity: 'warning',
        suggestion: 'Document key architecture decisions with rationale and alternatives',
      });
      return { passed: false, issues, score: 0.5 };
    }

    // Check quality of decisions
    const incompleteDecisions = decisions.filter((d) => !d.decision || !d.rationale);
    if (incompleteDecisions.length > 0) {
      issues.push({
        message: `${incompleteDecisions.length} architecture decision(s) missing decision or rationale`,
        path: ['technical_detail', 'architecture_decisions'],
        severity: 'warning',
        suggestion: 'Ensure all architecture decisions have both decision and rationale fields',
      });
    }

    const passed = issues.length === 0;
    return {
      passed,
      issues,
      score: passed ? 1 : 0.7,
    };
  },
};
