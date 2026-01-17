export class ROICalculator {
  /**
   * Calculate probability of success based on risk score
   * Probability_of_Success = 1 - (risk_score / 10)
   */
  calculateProbabilityOfSuccess(riskScore: number): number {
    return 1 - riskScore / 10;
  }

  /**
   * Calculate expected value
   * Expected_Value = (Impact × Probability_of_Success) - Effort
   */
  calculateExpectedValue(impact: number, riskScore: number, effort: number): number {
    const probability = this.calculateProbabilityOfSuccess(riskScore);
    return impact * probability - effort;
  }

  /**
   * Get decision recommendation
   */
  getRecommendation(expectedValue: number, threshold = 5): 'approve' | 'defer' | 'reject' {
    if (expectedValue > threshold) {
      return 'approve';
    }
    if (expectedValue > 0) {
      return 'defer';
    }
    return 'reject';
  }

  /**
   * Calculate ROI with full breakdown
   */
  calculateROI(
    impact: number,
    riskScore: number,
    effort: number
  ): {
    expected_value: number;
    probability_of_success: number;
    recommendation: 'approve' | 'defer' | 'reject';
    reasoning: string;
  } {
    const probability = this.calculateProbabilityOfSuccess(riskScore);
    const expectedValue = this.calculateExpectedValue(impact, riskScore, effort);
    const recommendation = this.getRecommendation(expectedValue);

    let reasoning = '';
    switch (recommendation) {
      case 'approve':
        reasoning = `High expected value (${expectedValue.toFixed(2)}) with ${(probability * 100).toFixed(0)}% success probability`;
        break;
      case 'defer':
        reasoning = `Moderate expected value (${expectedValue.toFixed(2)}). Consider reducing risk or increasing impact`;
        break;
      case 'reject':
        reasoning = `Negative expected value (${expectedValue.toFixed(2)}). Risk or effort too high relative to impact`;
        break;
    }

    return {
      expected_value: expectedValue,
      probability_of_success: probability,
      recommendation,
      reasoning,
    };
  }
}
