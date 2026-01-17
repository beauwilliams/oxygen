export class OxygenError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'OxygenError';
  }
}

export class ConfigError extends OxygenError {
  constructor(message: string, cause?: unknown) {
    super(message, 'CONFIG_ERROR', cause);
    this.name = 'ConfigError';
  }
}

export class SpecNotFoundError extends OxygenError {
  constructor(specId: string) {
    super(`Spec '${specId}' not found`, 'SPEC_NOT_FOUND');
    this.name = 'SpecNotFoundError';
  }
}

export class ValidationError extends OxygenError {
  constructor(
    message: string,
    public readonly path: string[],
    cause?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', cause);
    this.name = 'ValidationError';
  }
}

export class GitError extends OxygenError {
  constructor(message: string, cause?: unknown) {
    super(message, 'GIT_ERROR', cause);
    this.name = 'GitError';
  }
}

export class LinterError extends OxygenError {
  constructor(message: string, cause?: unknown) {
    super(message, 'LINTER_ERROR', cause);
    this.name = 'LinterError';
  }
}

export class RefinementTerminatedError extends OxygenError {
  constructor(
    public readonly reason: 'max_attempts' | 'max_cost' | 'convergence_failed' | 'diverging',
    public readonly recommendation: string,
    cause?: unknown
  ) {
    super(`Refinement terminated: ${reason}. ${recommendation}`, 'REFINEMENT_TERMINATED', cause);
    this.name = 'RefinementTerminatedError';
  }
}

export class BudgetExceededError extends OxygenError {
  constructor(
    message: string,
    public readonly allocated: number,
    public readonly spent: number,
    cause?: unknown
  ) {
    super(message, 'BUDGET_EXCEEDED', cause);
    this.name = 'BudgetExceededError';
  }
}
