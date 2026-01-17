/**
 * Simple token estimator using character count approximation
 * For Claude models: ~4 characters per token
 * For GPT models: ~3.5 characters per token
 */
export class TokenEstimator {
  /**
   * Estimate tokens for text (simple character count approximation)
   */
  estimateTokens(text: string, model: 'claude' | 'gpt' = 'claude'): number {
    const charsPerToken = model === 'claude' ? 4 : 3.5;
    return Math.ceil(text.length / charsPerToken);
  }

  /**
   * Estimate tokens for markdown content
   */
  estimateMarkdownTokens(markdown: string, model: 'claude' | 'gpt' = 'claude'): number {
    return this.estimateTokens(markdown, model);
  }
}
