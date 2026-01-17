import inquirer from 'inquirer';
import { CommandContext } from '../types';

export class PromptManager {
  private context: CommandContext;

  constructor(context: CommandContext) {
    this.context = context;
  }

  /**
   * Check if we should skip prompts (non-interactive mode or CI)
   */
  private shouldSkipPrompts(): boolean {
    return this.context.nonInteractive || process.env.CI === 'true' || !process.stdin.isTTY;
  }

  /**
   * Prompt for text input
   */
  async promptText(question: string, defaultValue?: string): Promise<string> {
    if (this.shouldSkipPrompts()) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Required input missing: ${question} (non-interactive mode)`);
    }

    const { value } = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: question,
        default: defaultValue,
      },
    ]);
    return value;
  }

  /**
   * Prompt for confirmation
   */
  async promptConfirm(question: string, defaultValue = true): Promise<boolean> {
    if (this.shouldSkipPrompts()) {
      return defaultValue;
    }

    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: question,
        default: defaultValue,
      },
    ]);
    return confirmed;
  }

  /**
   * Prompt for selection from list
   */
  async promptSelect<T extends string>(
    question: string,
    choices: T[],
    defaultValue?: T
  ): Promise<T> {
    if (this.shouldSkipPrompts()) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Required selection missing: ${question} (non-interactive mode)`);
    }

    const { value } = await inquirer.prompt([
      {
        type: 'list',
        name: 'value',
        message: question,
        choices,
        default: defaultValue,
      },
    ]);
    return value;
  }

  /**
   * Prompt for multiple selections
   */
  async promptMultiSelect<T extends string>(
    question: string,
    choices: T[],
    defaultValue?: T[]
  ): Promise<T[]> {
    if (this.shouldSkipPrompts()) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      return [];
    }

    const { values } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'values',
        message: question,
        choices,
        default: defaultValue,
      },
    ]);
    return values;
  }
}
