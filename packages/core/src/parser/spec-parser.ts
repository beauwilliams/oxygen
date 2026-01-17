import { readFile } from '../utils/file-utils';
import { Spec, SpecSchema } from '../schema/spec';
import { ValidationError } from '../utils/errors';

export class SpecParser {
  /**
   * Load and parse a spec JSON file
   */
  async loadSpec(filePath: string): Promise<Spec> {
    try {
      const content = await readFile(filePath);
      const parsed = JSON.parse(content);
      return this.parseSpec(parsed);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          `Failed to parse spec file ${filePath}: ${error.message}`,
          [filePath],
          error.cause
        );
      }
      if (error instanceof Error) {
        throw new ValidationError(
          `Failed to load spec file ${filePath}: ${error.message}`,
          [filePath],
          error
        );
      }
      throw new ValidationError(`Failed to load spec file ${filePath}`, [filePath]);
    }
  }

  /**
   * Parse and validate spec object against schema
   */
  parseSpec(data: unknown): Spec {
    try {
      return SpecSchema.parse(data);
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
        const path = zodError.issues[0]?.path.map(String) || [];
        const message = zodError.issues.map((i) => i.message).join('; ');
        throw new ValidationError(`Spec validation failed: ${message}`, path, error);
      }
      throw new ValidationError('Spec validation failed', [], error);
    }
  }
}
