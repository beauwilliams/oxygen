import { OutputManager, JsonOutput } from './output';
import {
  OxygenError,
  ConfigError,
  SpecNotFoundError,
  ValidationError,
  GitError,
  LinterError,
  RefinementTerminatedError,
  BudgetExceededError,
} from '@oxygen/core';
import { EXIT_CODES } from '../constants';

export function handleError(error: unknown, output: OutputManager): number {
  if (error instanceof ConfigError) {
    output.error(`Configuration error: ${error.message}`);
    return EXIT_CODES.CONFIG_ERROR;
  }

  if (error instanceof SpecNotFoundError) {
    output.error(`Spec not found: ${error.message}`);
    return EXIT_CODES.SPEC_NOT_FOUND;
  }

  if (error instanceof ValidationError) {
    const pathStr = error.path.length > 0 ? ` at ${error.path.join('.')}` : '';
    output.error(`Validation error${pathStr}: ${error.message}`);
    return EXIT_CODES.GENERAL_ERROR;
  }

  if (error instanceof GitError) {
    output.error(`Git error: ${error.message}`);
    return EXIT_CODES.GIT_ERROR;
  }

  if (error instanceof LinterError) {
    output.error(`Linter error: ${error.message}`);
    return EXIT_CODES.GENERAL_ERROR;
  }

  if (error instanceof RefinementTerminatedError) {
    output.error(`Refinement terminated: ${error.message}`);
    return EXIT_CODES.REFINEMENT_TERMINATED;
  }

  if (error instanceof BudgetExceededError) {
    output.error(`Budget exceeded: ${error.message}`);
    return EXIT_CODES.BUDGET_EXCEEDED;
  }

  if (error instanceof Error) {
    output.error(`Error: ${error.message}`);
    return EXIT_CODES.GENERAL_ERROR;
  }

  output.error('Unknown error occurred');
  return EXIT_CODES.GENERAL_ERROR;
}

export function formatErrorForJson(error: unknown): JsonOutput {
  if (error instanceof OxygenError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        path: error instanceof ValidationError ? error.path : undefined,
      },
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: 'UNKNOWN_ERROR',
      },
    };
  }

  return {
    success: false,
    error: {
      message: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
    },
  };
}
