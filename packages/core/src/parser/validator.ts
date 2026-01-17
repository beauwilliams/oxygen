import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: ValidationError;
}

/**
 * Validate data against a Zod schema with formatted error messages
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const validated = schema.parse(data);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const path = error.issues[0]?.path.map(String) || [];
      const message = error.issues
        .map((i) => {
          const pathStr = i.path.length > 0 ? ` at ${i.path.join('.')}` : '';
          return `${i.message}${pathStr}`;
        })
        .join('; ');
      return {
        success: false,
        error: new ValidationError(`Validation failed: ${message}`, path, error),
      };
    }
    return {
      success: false,
      error: new ValidationError('Validation failed', [], error),
    };
  }
}

/**
 * Format Zod error for display
 */
export function formatValidationError(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
      return `${path}: ${issue.message}`;
    })
    .join('\n');
}
