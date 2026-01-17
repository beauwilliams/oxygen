import { RuleResult, CategoryScores, LinterConfig } from './types';
import { Spec } from '../schema/spec';

export class ScoringEngine {
  private config: LinterConfig;

  constructor(config: LinterConfig) {
    this.config = config;
  }

  /**
   * Calculate category score (0-1) based on rule results
   */
  calculateCategoryScore(
    category: keyof CategoryScores,
    ruleResults: Array<{ category: string; result: RuleResult }>
  ): number {
    const categoryRules = ruleResults.filter((r) => r.category === category);
    if (categoryRules.length === 0) {
      return 1.0; // No rules = perfect score
    }

    const totalScore = categoryRules.reduce((sum, r) => sum + r.result.score, 0);
    return totalScore / categoryRules.length;
  }

  /**
   * Calculate weighted overall score
   */
  calculateOverallScore(categoryScores: CategoryScores): number {
    const weights = this.config.weights || {
      structural: 0.2,
      technical: 0.3,
      product: 0.3,
      integration: 0.2,
      consistency: 0.0,
    };

    return (
      categoryScores.structural * (weights.structural || 0) +
      categoryScores.technical * (weights.technical || 0) +
      categoryScores.product * (weights.product || 0) +
      categoryScores.integration * (weights.integration || 0) +
      categoryScores.consistency * (weights.consistency || 0)
    );
  }

  /**
   * Get status-specific threshold
   */
  getThresholdForStatus(status: Spec['meta']['status']): number {
    const thresholds = this.config.scoreThresholds;
    if (thresholds?.overall !== undefined) {
      return thresholds.overall;
    }

    // Default thresholds based on status
    switch (status) {
      case 'roadmap':
        return 0.45;
      case 'draft':
        return 0.8;
      case 'approved':
        return 0.95;
      case 'executed':
      case 'finalized':
        return 0.95;
      default:
        return 0.7;
    }
  }

  /**
   * Check if score passes threshold
   */
  passesThreshold(score: number, threshold: number): boolean {
    return score >= threshold;
  }
}
