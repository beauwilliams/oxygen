import { Risk } from '../schema/risk';

export class RiskAnalyzer {
  /**
   * Get risk score from spec (user-provided in MVP)
   * Future: Auto-detect risks from spec content
   */
  getRiskScore(risk: Risk | undefined): number {
    if (!risk || risk.score === undefined) {
      return 5; // Default medium risk
    }
    return risk.score;
  }

  /**
   * Get risk breakdown
   */
  getBreakdown(risk: Risk | undefined): {
    score: number;
    technical_risks: string[];
    assumptions: string[];
    rollback_difficulty?: string;
  } {
    return {
      score: this.getRiskScore(risk),
      technical_risks: risk?.technical_risks?.map((r) => r.description) || [],
      assumptions: risk?.assumptions?.map((a) => a.assumption) || [],
      rollback_difficulty: risk?.rollback_difficulty,
    };
  }
}
