---
name: ConfigManager Implementation Specification
overview: Add detailed ConfigManager implementation specification with full code examples using Zod for validation, including schema definition, atomic write operations, and complete API design.
todos:
  - id: config-schema
    content: Define OxygenConfigSchema with Zod in packages/core/src/schema/configSchema.ts (nextSpecId, specs registry, branchPattern, agentProvider)
    status: pending
  - id: config-manager-class
    content: Implement ConfigManager class in packages/core/src/config/ConfigManager.ts with read(), write(), incrementSpecId(), registerSpec(), and atomic write pattern
    status: pending
    dependencies:
      - config-schema
  - id: config-error-class
    content: Create ConfigError class extending Error for config-specific error handling
    status: pending
  - id: config-initialization
    content: Add initialize() method to ConfigManager that creates default config.json if it doesn't exist
    status: pending
    dependencies:
      - config-manager-class
---

# ConfigManager Implementation Specification

## Overview

ConfigManager handles reading/writing `.oxygen/config.json` with Zod validation. No external config library needed - simple file I/O with atomic writes.

## File Structure

```
packages/core/src/
├── schema/
│   └── configSchema.ts          # Zod schema for OxygenConfig
└── config/
    ├── ConfigManager.ts         # Main ConfigManager class
    └── types.ts                 # TypeScript types (inferred from Zod)
```

## 1. Config Schema (`packages/core/src/schema/configSchema.ts`)

Zod schema defining the structure of `.oxygen/config.json`:

```typescript
import { z } from 'zod';

export const SpecRegistryEntrySchema = z.object({
  id: z.string().regex(/^spec-\d+$/), // e.g., "spec-001"
  name: z.string().min(1),
  file: z.string(), // Relative path from .oxygen/specs/
});

export const AgentProviderSchema = z.object({
  type: z.enum(['claude', 'openai', 'custom']),
  model: z.string().optional(),
  apiKey: z.string().optional(), // Not stored, used from env
  customConfig: z.record(z.unknown()).optional(),
});

export const OxygenConfigSchema = z.object({
  nextSpecId: z.number().int().positive(),
  specs: z.array(SpecRegistryEntrySchema),
  branchPattern: z.string().default('oxygen/spec-{id}-{attempt}'),
  agentProvider: AgentProviderSchema.optional(),
});

export type OxygenConfig = z.infer<typeof OxygenConfigSchema>;
export type SpecRegistryEntry = z.infer<typeof SpecRegistryEntrySchema>;
export type AgentProvider = z.infer<typeof AgentProviderSchema>;
```

## 2. ConfigManager Implementation (`packages/core/src/config/ConfigManager.ts`)

Full implementation with atomic writes and Zod validation:

```typescript
import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { z } from 'zod';
import {
  OxygenConfigSchema,
  type OxygenConfig,
  type SpecRegistryEntry,
} from '../schema/configSchema';

export class ConfigError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ConfigManager {
  private readonly configPath: string;

  constructor(workspaceRoot: string) {
    this.configPath = join(workspaceRoot, '.oxygen', 'config.json');
  }

  /**
   * Read config file with validation.
   * Returns defaults if file doesn't exist.
   */
  read(): OxygenConfig {
    if (!existsSync(this.configPath)) {
      return this.getDefaults();
    }

    try {
      const content = readFileSync(this.configPath, 'utf-8');
      const data = JSON.parse(content);

      // Validate with Zod
      return OxygenConfigSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ConfigError(
          `Invalid config file schema: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          error
        );
      }

      if (error instanceof SyntaxError) {
        throw new ConfigError(`Invalid JSON in config file: ${error.message}`, error);
      }

      throw new ConfigError(`Failed to read config file: ${error}`, error);
    }
  }

  /**
   * Write config file atomically (write to .tmp, then rename).
   * Validates before writing.
   */
  write(config: OxygenConfig): void {
    // Validate with Zod before writing
    const validated = OxygenConfigSchema.parse(config);

    // Ensure directory exists
    const dir = dirname(this.configPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Write to temp file first
    const tmpPath = `${this.configPath}.tmp`;
    const jsonContent = JSON.stringify(validated, null, 2) + '\n';

    try {
      writeFileSync(tmpPath, jsonContent, 'utf-8');

      // Atomic rename (prevents corruption on concurrent writes)
      renameSync(tmpPath, this.configPath);
    } catch (error) {
      // Clean up temp file on error
      if (existsSync(tmpPath)) {
        try {
          renameSync(tmpPath, tmpPath + '.failed');
        } catch {
          // Ignore cleanup errors
        }
      }
      throw new ConfigError(`Failed to write config file: ${error}`, error);
    }
  }

  /**
   * Get next spec ID and increment counter atomically.
   */
  incrementSpecId(): number {
    const config = this.read();
    config.nextSpecId += 1;
    this.write(config);
    return config.nextSpecId;
  }

  /**
   * Register a new spec in the registry.
   * Throws if spec ID already exists.
   */
  registerSpec(id: string, name: string, file: string): void {
    const config = this.read();

    // Check for duplicate ID
    if (config.specs.some((s) => s.id === id)) {
      throw new ConfigError(`Spec with ID '${id}' already exists`);
    }

    config.specs.push({ id, name, file });
    this.write(config);
  }

  /**
   * Find spec by ID or name.
   */
  findSpec(idOrName: string): SpecRegistryEntry | undefined {
    const config = this.read();
    return config.specs.find((s) => s.id === idOrName || s.name === idOrName);
  }

  /**
   * Get all registered specs.
   */
  getAllSpecs(): SpecRegistryEntry[] {
    return this.read().specs;
  }

  /**
   * Update branch pattern.
   */
  setBranchPattern(pattern: string): void {
    const config = this.read();
    config.branchPattern = pattern;
    this.write(config);
  }

  /**
   * Update agent provider settings.
   */
  setAgentProvider(provider: OxygenConfig['agentProvider']): void {
    const config = this.read();
    config.agentProvider = provider;
    this.write(config);
  }

  /**
   * Get default config values.
   */
  private getDefaults(): OxygenConfig {
    return {
      nextSpecId: 1,
      specs: [],
      branchPattern: 'oxygen/spec-{id}-{attempt}',
      agentProvider: undefined,
    };
  }

  /**
   * Initialize config file if it doesn't exist.
   */
  initialize(): void {
    if (!existsSync(this.configPath)) {
      const defaults = this.getDefaults();
      this.write(defaults);
    }
  }

  /**
   * Check if config file exists.
   */
  exists(): boolean {
    return existsSync(this.configPath);
  }
}
```

## 3. Error Handling

Custom `ConfigError` class for config-specific errors:

```typescript
export class ConfigError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ConfigError';
  }
}
```

Error cases handled:

- Invalid JSON syntax
- Schema validation failures (Zod errors with path information)
- File I/O errors
- Duplicate spec ID registration

## 4. Atomic Write Pattern

Prevents corruption on concurrent writes:

1. Write to `config.json.tmp`
2. `fs.rename('config.json.tmp', 'config.json')` - atomic on Unix/Windows
3. If write fails, clean up temp file

**Concurrency behavior:**

- Last write wins (acceptable for ID counter race conditions)
- No file corruption (atomic rename prevents partial writes)
- For strict ordering (rarely needed), could add file locking later

## 5. API Summary

```typescript
class ConfigManager {
  read(): OxygenConfig                    // Read with validation
  write(config: OxygenConfig): void       // Write atomically with validation
  incrementSpecId(): number               // Get next ID and increment
  registerSpec(id, name, file): void      // Add to registry
  findSpec(idOrName): SpecRegistryEntry?  // Find by ID or name
  getAllSpecs(): SpecRegistryEntry[]      // Get all specs
  setBranchPattern(pattern): void         // Update branch pattern
  setAgentProvider(provider): void        // Update agent provider
  initialize(): void                      // Create default config
  exists(): boolean                       // Check if config exists
}
```

## 6. Usage Examples

```typescript
// Initialize workspace
const config = new ConfigManager('/path/to/project');
config.initialize();

// Get next spec ID
const id = config.incrementSpecId(); // Returns 1, increments to 2

// Register spec
config.registerSpec('spec-001', 'payment-routing', 'spec-001-payment-routing.oxygen.json');

// Read config
const cfg = config.read();
console.log(cfg.nextSpecId); // 2
console.log(cfg.specs.length); // 1

// Update agent provider
config.setAgentProvider({
  type: 'claude',
  model: 'claude-3-5-sonnet-20241022',
});
```

## 7. Integration Points

- **Phase 2**: Define `OxygenConfigSchema` in `packages/core/src/schema/configSchema.ts`
- **Phase 3**: `ConfigError` extends base `OxygenError` class (if base exists)
- **Phase 4**: Implement `ConfigManager` class in `packages/core/src/config/ConfigManager.ts`
- **CLI `init` command**: Call `config.initialize()` to create default config
- **CLI `generate` command**: Call `config.incrementSpecId()` and `config.registerSpec()`

## 8. Testing Considerations

Key test cases:

- Read non-existent config (returns defaults)
- Read invalid JSON (throws ConfigError)
- Read invalid schema (throws ConfigError with Zod details)
- Atomic write (concurrent writes don't corrupt)
- Increment ID (atomically updates)
- Register spec (prevents duplicates)
- Find spec by ID/name

## 9. Dependencies

- `zod` (^3.22.0): Schema validation (already in plan)
- Node.js `fs` module: File I/O (built-in)
- No external config library needed

## 10. Future Enhancements (Optional)

If strict ordering needed later:

- Add `proper-lockfile` for file locking
- Wrap `incrementSpecId()` with lock/unlock

For now, atomic writes are sufficient (last-write-wins acceptable for ID counter).
