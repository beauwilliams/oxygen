import chalk from 'chalk';
import ora from 'ora';
import { CommandContext } from '../types';

export interface JsonOutput {
  success: boolean;
  data?: unknown;
  error?: {
    message: string;
    code: string;
    path?: string[];
  };
}

export class OutputManager {
  private context: CommandContext;

  constructor(context: CommandContext) {
    this.context = context;
  }

  /**
   * Output success message
   */
  success(message: string): void {
    if (this.context.json || (!this.context.verbose && !this.context.json)) {
      return; // Silent in non-verbose mode
    }
    if (this.context.noColor) {
      console.log(`✓ ${message}`);
    } else {
      console.log(chalk.green(`✓ ${message}`));
    }
  }

  /**
   * Output error message
   */
  error(message: string): void {
    if (this.context.json) {
      return; // JSON output handled separately
    }
    if (this.context.noColor) {
      console.error(`✗ ${message}`);
    } else {
      console.error(chalk.red(`✗ ${message}`));
    }
  }

  /**
   * Output warning message
   */
  warning(message: string): void {
    if (this.context.json) {
      return;
    }
    if (this.context.noColor) {
      console.warn(`⚠ ${message}`);
    } else {
      console.warn(chalk.yellow(`⚠ ${message}`));
    }
  }

  /**
   * Output info message
   */
  info(message: string): void {
    if (this.context.json || (!this.context.verbose && !this.context.json)) {
      return;
    }
    if (this.context.noColor) {
      console.log(`ℹ ${message}`);
    } else {
      console.log(chalk.blue(`ℹ ${message}`));
    }
  }

  /**
   * Output JSON
   */
  json(
    data:
      | JsonOutput
      | { success: boolean; data?: unknown; error?: { message: string; code?: string } }
  ): void {
    console.log(JSON.stringify(data, null, 2));
  }

  /**
   * Output plain text (for non-JSON mode)
   */
  text(_content: string): void {
    if (!this.context.json) {
      console.log(_content);
    }
  }

  /**
   * Create spinner (using ora)
   */
  createSpinner(text: string) {
    const spinnerOptions: { text: string; color?: 'cyan' } = {
      text,
    };
    if (!this.context.noColor) {
      spinnerOptions.color = 'cyan';
    }
    return ora(spinnerOptions);
  }
}
