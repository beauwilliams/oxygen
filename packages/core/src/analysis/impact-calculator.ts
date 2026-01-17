import { Impact } from '../schema/impact';

export class ImpactCalculator {
  /**
   * Aggregate impact score from components
   * Impact = (business_value × 0.4) + (user_value × 0.3) + (technical_value × 0.2) + (competitive_value × 0.1)
   */
  calculate(impact: Impact): number {
    const business = impact.business_value || 0;
    const user = impact.user_value || 0;
    const technical = impact.technical_value || 0;
    const competitive = impact.competitive_value || 0;

    const aggregated = business * 0.4 + user * 0.3 + technical * 0.2 + competitive * 0.1;
    return Math.round(aggregated * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Get impact breakdown
   */
  getBreakdown(impact: Impact): {
    score: number;
    business_value: number;
    user_value: number;
    technical_value: number;
    competitive_value: number;
  } {
    return {
      score: this.calculate(impact),
      business_value: impact.business_value || 0,
      user_value: impact.user_value || 0,
      technical_value: impact.technical_value || 0,
      competitive_value: impact.competitive_value || 0,
    };
  }
}
