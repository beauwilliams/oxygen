import { Effort } from '../schema/effort';
import { TokenEstimator } from '../views/token-estimator';

export class EffortEstimator {
  private tokenEstimator: TokenEstimator;
  private tokenPricePer1k: number; // Default: $0.003 per 1K tokens (Claude Sonnet)

  constructor(tokenPricePer1k = 0.003) {
    this.tokenEstimator = new TokenEstimator();
    this.tokenPricePer1k = tokenPricePer1k;
  }

  /**
   * Estimate effort from spec size
   */
  estimate(specContent: string): Effort {
    // Estimate tokens from spec content
    const tokenEstimate = this.tokenEstimator.estimateTokens(specContent);

    // Calculate token cost
    const tokenCost = (tokenEstimate / 1000) * this.tokenPricePer1k;

    // Actor time cost is negligible for agents
    const actorTimeCost = 0;

    // Total effort = token cost
    const total = tokenCost;

    return {
      total,
      token_cost: tokenCost,
      actor_time_cost: actorTimeCost,
      estimated_tokens: tokenEstimate,
    };
  }
}
