import { Spec } from '../schema/spec';
import { TechnicalDetail, ProductDetail, IntegrationDetail } from '../schema/index';
import {
  Rule,
  ParsedSpec,
  LinterResult,
  CategoryScores,
  LinterConfig,
  RuleResult,
  RuleIssue,
} from './types';
import { ScoringEngine } from './scorer';
import { getDefaultConfig } from './default-config';

export class SpecLinter {
  private rules: Rule[] = [];
  private config: LinterConfig;
  private scorer: ScoringEngine;

  constructor(config?: LinterConfig) {
    this.config = config || getDefaultConfig();
    this.scorer = new ScoringEngine(this.config);
  }

  /**
   * Register a rule
   */
  registerRule(rule: Rule): void {
    this.rules.push(rule);
  }

  /**
   * Register multiple rules
   */
  registerRules(rules: Rule[]): void {
    this.rules.push(...rules);
  }

  /**
   * Lint a spec
   */
  async lint(
    spec: Spec,
    technical: TechnicalDetail | null,
    product: ProductDetail | null,
    integration: IntegrationDetail | null
  ): Promise<LinterResult> {
    const parsedSpec: ParsedSpec = {
      spec,
      technical,
      product,
      integration,
    };

    // Get enabled rules
    const enabledRules = this.getEnabledRules();

    // Run all enabled rules
    const ruleResults: Array<{ rule: Rule; result: RuleResult }> = [];
    const allIssues: RuleIssue[] = [];

    for (const rule of enabledRules) {
      const result = rule.run(parsedSpec);
      ruleResults.push({ rule, result });
      allIssues.push(...result.issues);
    }

    // Calculate category scores
    const categoryScores: CategoryScores = {
      structural: this.scorer.calculateCategoryScore(
        'structural',
        ruleResults.map((r) => ({ category: r.rule.category, result: r.result }))
      ),
      technical: this.scorer.calculateCategoryScore(
        'technical',
        ruleResults.map((r) => ({ category: r.rule.category, result: r.result }))
      ),
      product: this.scorer.calculateCategoryScore(
        'product',
        ruleResults.map((r) => ({ category: r.rule.category, result: r.result }))
      ),
      integration: this.scorer.calculateCategoryScore(
        'integration',
        ruleResults.map((r) => ({ category: r.rule.category, result: r.result }))
      ),
      consistency: this.scorer.calculateCategoryScore(
        'consistency',
        ruleResults.map((r) => ({ category: r.rule.category, result: r.result }))
      ),
    };

    // Calculate overall score
    const overallScore = this.scorer.calculateOverallScore(categoryScores);

    // Check if passes threshold
    const threshold = this.scorer.getThresholdForStatus(spec.meta.status);
    const passed = this.scorer.passesThreshold(overallScore, threshold);

    // Count rules
    const rulesPassed = ruleResults.filter((r) => r.result.passed).length;
    const rulesFailed = ruleResults.filter((r) => !r.result.passed).length;

    return {
      passed,
      overallScore,
      categoryScores,
      issues: allIssues,
      rulesRun: enabledRules.length,
      rulesPassed,
      rulesFailed,
    };
  }

  /**
   * Get enabled rules based on config
   */
  private getEnabledRules(): Rule[] {
    const rulesConfig = this.config.rules || {};
    return this.rules.filter((rule) => {
      const ruleConfig = rulesConfig[rule.id];
      if (ruleConfig === 'off' || ruleConfig === undefined) {
        return false;
      }
      return true;
    });
  }
}
