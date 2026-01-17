---
name: Oxygen Specification Management System
overview: Build a comprehensive actor-agnostic specification management system that treats specs as first-class, versioned assets, enabling zero-ambiguity implementations through structured schemas, impact/effort/risk analysis, refinement loops, and strategic roadmap planning. The system uses a PNPM monorepo with TypeScript, targeting Node 22.
todos:
  - id: setup
    content: Initialize PNPM monorepo with packages (cli, core, prettier-config, eslint-config), configure workspaces, shared configs, Turbo pipeline, Husky hooks, and CI workflow
    status: pending
  - id: schema
    content: Define complete JSON schema with TypeScript types for meta, spec, impact, effort, risk, analysis, refinement, and detail files using Zod
    status: pending
  - id: config
    content: Implement config management for .oxygen/config.json (spec registry, ID counter, branch patterns, agent provider settings)
    status: pending
  - id: parser
    content: Build JSON parser with schema validation and error reporting for specs and detail files
    status: pending
  - id: cli-structure
    content: Create CLI command structure with commander.js, output utilities, and prompt helpers
    status: pending
  - id: linter
    content: Implement spec linter with extensible rule system (built-in + custom rules), category-based scoring (structural, technical, product, integration, consistency), and configuration support
    status: pending
  - id: views
    content: Build built-in view generation system (full, execution, reference) with filtering logic and token estimation
    status: pending
  - id: refinement
    content: Implement refinement loop with branch management, attempt tracking, auto-improvement agent, and convergence detection
    status: pending
  - id: analysis
    content: Build Impact × Effort × Risk calculation engine with ROI formulas and decision recommendations
    status: pending
  - id: roadmap
    content: Implement roadmap planning with portfolio optimization (ILP solver) and dependency resolution
    status: pending
  - id: git-utils
    content: Create Git utilities for branch creation and status tracking using simple-git
    status: pending
  - id: adapters
    content: Build actor-agnostic adapters for spec generation (Claude/OpenAI), implementation, and review workflows
    status: pending
---

# Oxygen Specification Management System Implementation Plan

## System Overview

Oxygen is an actor-agnostic specification management system enabling spec-driven development for human-only, agent-only, or hybrid teams. The core principle: **Great Spec + Simple Orchestration > Shitty Spec + Complex Orchestration**.

**Architecture:**

- PNPM monorepo with TypeScript (Node 22)
- Packages: `@oxygen/cli`, `@oxygen/core`, `@oxygen/prettier-config`, `@oxygen/eslint-config`
- Turbo for build orchestration
- Workspace structure: `.oxygen/` directory with `config.json`, `specs/`, `details/`, `views/`, `roadmaps/`

**Key Components:**

1. **Spec Schema**: JSON format with meta, spec, impact, effort, risk, analysis, workspace, history, refinement
2. **Detail Files**: Separate technical.json, product.json, integrations.json for zero-ambiguity
3. **CLI Tool**: TypeScript/Node.js with 10+ commands (generate, view, lint, refine, execute, roadmap, etc.)
4. **Spec Linter**: Extensible rule system with scoring (0-100%), built-in + custom rules
5. **View Generation**: Full (~15K tokens), Execution (~8K tokens), Reference (~2K tokens)
6. **Refinement Loop**: Branch-based empirical validation with auto-improvement
7. **Analysis Engine**: Impact × Effort × Risk calculation with ROI formulas
8. **Roadmap Planning**: Portfolio optimization with ILP solver and dependency resolution

## User Journey & Workflow

**Complete Spec Lifecycle:**

Users run commands iteratively based on their current phase in the spec lifecycle. The workflow is non-linear - users can go away, come back, and run commands as needed.

1.  **`oxygen init`** - Initialize workspace
    - Creates `.oxygen/` directory structure
    - Initializes default `config.json`
    - Sets up workspace for spec management

2.  **`oxygen generate <name>`** - Create spec structure
    - Interactive prompts for objective, systems, status, etc.
    - Generates initial spec structure with next available ID
    - Optional AI assistance via spec generation adapter
    - Validates generated spec
    - Saves to `.oxygen/specs/`
    - Updates config registry
    - Auto-runs lint and shows score

3.  **Edit spec manually** - Fill in user-provided data
    - Edit spec JSON file directly or via editor
    - **User provides:** Impact scores (1-10) for business/user/technical/competitive value
    - **User provides:** Risk scores (1-10) with technical risks, assumptions, rollback difficulty
    - **System calculates:** Effort (auto-calculated when analysis runs)

4.  **`oxygen view <spec>`** - Review spec
    - Resolve spec by name/ID
    - Load spec and detail files
    - Generate filtered views (full/execution/reference)
    - Output JSON to stdout or file
    - Show token count

5.  **`oxygen lint <spec>`** - Check completeness
    - Resolve spec by name/ID
    - Load spec and detail files
    - Run SpecLinter with all enabled rules
    - Display formatted lint results
    - Exit with appropriate code based on threshold
    - Shows category scores and overall score

6.  **`oxygen analyze <spec>`** - Get analysis
    - Resolve spec by name/ID
    - Load spec and detail files
    - **Read Impact** from spec (user-provided, 1-10)
    - **Calculate Effort** automatically (token cost, actor time, total)
    - **Read Risk** from spec (user-provided, 1-10)
    - **Calculate ROI:** Expected Value = (Impact × Probability_of_Success) - Effort
    - **Generate decision recommendation:** approve/defer/reject
    - Display formatted analysis results
    - Optional: `--update` flag to write analysis back to spec file
    - **Can be called anytime** after spec creation
    - **Used in:** `generate` flow (show analysis after creation), `refine` flow (re-analyze after updates), `roadmap optimize` (batch analysis)

7.  **`oxygen refine <spec>`** - Iterate based on agent results
    - Check if refinement in progress
    - Create attempt branch (`oxygen/spec-{id}-{attempt}`)
    - Generate execution view
    - Call implementation adapter (execute attempt)
    - Capture questions/errors from agent
    - Call auto-improvement agent to analyze failures
    - Update spec with improvements
    - Record attempt in spec refinement history
    - Re-run analysis to see updated effort/ROI

8.  **`oxygen review <spec>`** - Human/agent review
    - Load spec for review
    - Capture review comments
    - Record review in spec history
    - Update spec status if needed

9.  **`oxygen approve <spec>`** - Approve after meeting thresholds
    - Check linter threshold (must pass 95% for approval)
    - Update spec status to "approved"
    - Record approval in history
    - Validates spec meets quality standards

10. **`oxygen promote <spec>`** - Move to executed/finalized status

        - Update spec status (roadmap → draft → approved → executed/finalized)
        - Validate transition is allowed
        - Update spec metadata
        - Mark spec as complete and implementation done

11. **`oxygen roadmap optimize`** - Optional: optimize portfolio of specs

        - Load multiple specs (roadmap status)
        - Run batch analysis on all specs
        - Use ILP solver for portfolio optimization
        - Maximize total impact within budget constraints
        - Resolve dependencies
        - Generate optimized roadmap timeline
        - Display recommended spec execution order

**Workflow Pattern:**

Users iterate through these commands based on their needs:

- **Early stage:** `generate` → edit manually → `view` → `lint` → `analyze`
- **Refinement stage:** `refine` → `analyze` → `lint` → `review` (repeat as needed)
- **Approval stage:** `approve` → `promote`
- **Planning stage:** `roadmap optimize` (optional, for multiple specs)

**Key Points:**

- Users can run commands in any order based on their current phase
- Commands are idempotent - safe to run multiple times
- Analysis can be run anytime to see current ROI
- Effort is recalculated automatically when spec changes
- Impact and Risk are user-provided and stored in spec

## Implementation Phases

### Phase 1: Monorepo Infrastructure & Setup

**Files to create:**

- `pnpm-workspace.yaml` - Workspace configuration
- Root `package.json` - Turbo scripts, engines (Node >=22), packageManager (pnpm@9.0.0)
- `.nvmrc` - Node version 22
- `turbo.json` - Pipeline configuration
- `justfile` - Development commands
- `.gitignore` - Standard patterns + `.oxygen/views/`
- `.husky/pre-commit` - Pre-commit hook (lint-staged)
- `.husky/_/husky.sh` - Husky initialization script
- `.github/workflows/ci.yml` - CI pipeline
- `docs/` directory structure

**Shared config packages:**

- `packages/prettier-config/` - Prettier configuration package - `package.json` - Package metadata, exports prettier config - `index.js` - Prettier configuration (semi, singleQuote, trailingComma, printWidth, etc.) - `.prettierignore` - Ignore patterns (node_modules, dist, build, coverage, etc.) - **Reference:** Follow pattern from `lucid-agents` repo

- `packages/eslint-config/` - ESLint configuration package (ESLint v9 Flat Config) - `package.json` - Package metadata, exports ESLint flat config - `base.js` - Base ESLint flat config with TypeScript support - `node.js` - Node.js specific rules - `index.js` - Main export (exports flat config arrays) - **Reference:** Follow pattern from `lucid-agents` repo (flat config format)

- `packages/tsconfig.base.json` - Shared TypeScript base config - Strict mode enabled - ES2022 target - Module resolution settings - Path aliases if needed

**Package structure initialization:**

- `packages/cli/` - CLI package directory - `package.json` - Package metadata, dependencies, scripts - `tsconfig.json` - Extends base config, includes CLI-specific settings - `tsup.config.ts` - Build configuration (ESM output, CLI entry point)

- `packages/core/` - Core package directory - `package.json` - Package metadata, dependencies, scripts - `tsconfig.json` - Extends base config, includes core-specific settings - `tsup.config.ts` - Build configuration (ESM output, multiple entry points)

**Root `package.json` devDependencies:**

```json
{
  "devDependencies": {
    "@oxygen/eslint-config": "workspace:*",
    "@oxygen/prettier-config": "workspace:*",
    "@types/node": "^22.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^6.0.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.0.0",
    "prettier": "^3.3.0",
    "turbo": "^1.13.0",
    "tsup": "^8.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.6.0"
  }
}
```

**Alternative: Biome.js setup (if choosing Biome over ESLint):**

```json
{
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "@oxygen/prettier-config": "workspace:*",
    "@types/node": "^22.0.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.0.0",
    "prettier": "^3.3.0",
    "turbo": "^1.13.0",
    "tsup": "^8.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.6.0"
  }
}
```

**Root scripts:**

```json
{
  "scripts": {
    "prepare": "husky install",
    "build": "turbo build",
    "lint": "turbo lint:check",
    "lint:fix": "turbo lint:write",
    "format": "turbo format:check",
    "format:fix": "turbo format:write",
    "type-check": "turbo type-check",
    "clean": "turbo clean && rm -rf node_modules"
  }
}
```

**lint-staged configuration (in root `package.json`):**

```json
{
  "lint-staged": {
    "**/*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "**/*.{json,md,yml,yaml,css,scss}": ["prettier --write"]
  }
}
```

**Husky pre-commit hook (`.husky/pre-commit`):**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

**ESLint Configuration:**

- **Format:** ESLint v9 Flat Config (`eslint.config.js` or `eslint.config.mjs`)
- **Structure:** Shared config package exports flat config arrays
- **TypeScript:** Support via `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- **Root config:** `eslint.config.js` at root imports from `@oxygen/eslint-config`
- **Reference:** Follow `lucid-agents` repo pattern for config structure

**Root configuration files:**

- `prettier.config.js` - Root prettier config (imports `@oxygen/prettier-config`)
- `eslint.config.js` - Root ESLint flat config (imports `@oxygen/eslint-config`)

**Reference implementations:**

- Lucid Agents repo: ESLint and Prettier config pattern (reference during implementation)
- Turborepo ESLint guide: https://turborepo.ai/docs/guides/tools/eslint
- Turborepo reference: Check other repos on your computer for Turbo patterns

**Dependencies:** None (foundational)

---

### Phase 2: Core Schemas & Type Definitions

**Files to create in `packages/core/src/schema/`:**

1.  **Spec schemas:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `meta.ts` - MetaSchema (id, version, status, timestamps, project context)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `spec-content.ts` - SpecContentSchema (objective, scope, success_criteria, constraints, dependencies)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `impact.ts` - ImpactSchema (score 1-10, business/user/technical/competitive value)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `effort.ts` - EffortSchema (breakdown, total, development_cost, time_cost, complexity)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `risk.ts` - RiskSchema (technical_risks, assumptions, rollback, blast_radius, score 1-10)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `analysis.ts` - AnalysisSchema (roi, decision)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `workspace.ts` - WorkspaceSchema (open_questions, research, alternatives)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `history.ts` - HistorySchema (versions, changes, reviews)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `refinement.ts` - RefinementSchema (attempts, validation_status, reuse_metrics)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `spec.ts` - Complete SpecSchema combining all above

2.  **Detail schemas:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `technical-detail.ts` - TechnicalDetailSchema (apis, data_models, business_logic, performance)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `product-detail.ts` - ProductDetailSchema (user_flows, copy, ui_components)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `integration-detail.ts` - IntegrationDetailSchema (integrations, webhooks, rate_limits)

3.  **Config schemas:**

                                                                                                                                                                                                - `config.ts` - OxygenConfigSchema (nextSpecId, spec registry, branch patterns, agent provider settings)

Full Zod schema implementation:

      ```typescript
      import { z } from 'zod';

      export const SpecRegistryEntrySchema = z.object({
        id: z.string().regex(/^spec-\d+$/),  // e.g., "spec-001"
        name: z.string().min(1),
        file: z.string(),  // Relative path from .oxygen/specs/
      });

      export const AgentProviderSchema = z.object({
        type: z.enum(['claude', 'openai', 'custom']),
        model: z.string().optional(),
        apiKey: z.string().optional(),  // Not stored, used from env
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

                                                                                                                                                                                                - `linter-config.ts` - Linter configuration schema (rules, thresholds, weights)

**Implementation:** Use Zod (^3.22.0) for schema validation and TypeScript type inference.

**Dependencies:** Phase 1 (packages must exist)

---

### Phase 3: File Operations & Utilities

**Files to create in `packages/core/src/utils/`:**

1.  **File utilities:**

                                                                                                - `file-utils.ts` - File reading/writing, directory creation
                                                                                                                                                                - `readFile(path: string): Promise<string>` - Read file with error handling
                                                                                                                                                                - `writeFile(path: string, content: string): Promise<void>` - Write file atomically
                                                                                                                                                                - `ensureDir(path: string): Promise<void>` - Create directory recursively
                                                                                                                                                                - `exists(path: string): Promise<boolean>` - Check if file/directory exists
                                                                                                                                                                - `getMtime(path: string): Promise<Date>` - Get file modification time
                                                                                                                                                                - All paths are relative to workspace root (resolved via path-utils)
                                                                                                - `path-utils.ts` - Path resolution utilities
                                                                                                                                                                - `resolveWorkspaceRoot(): string` - Find workspace root (look for `.oxygen/` directory, walk up from cwd)
                                                                                                                                                                - `resolvePath(relativePath: string): string` - Resolve relative path from workspace root
                                                                                                                                                                - `joinPaths(...paths: string[]): string` - Cross-platform path joining
                                                                                                                                                                - `normalizePath(path: string): string` - Normalize path (handle Windows/Unix differences)
                                                                                                                                                                - All paths use relative paths from workspace root
                                                                                                                                                                - Path resolution: workspace root → relative path → absolute path

2.  **Error handling:**

                                                                                                - `errors.ts` - Error types (OxygenError base class, ConfigError, SpecNotFoundError, ValidationError, GitError, LinterError)
                                                                                                                                                                - See "Error Handling Strategy" section for full error hierarchy

3.  **Git utilities:**

                                                                                                - `git.ts` - GitManager class
                                                                                                                                                                - **Branch creation:**
                                                                                                                                                                                                                                - `createBranch(branchName: string): Promise<void>` - Create new branch
                                                                                                                                                                                                                                - If branch exists, increment attempt number and try again
                                                                                                                                                                                                                                - Pattern: `oxygen/spec-{id}-{attempt}` (from config.branchPattern)
                                                                                                                                                                                                                                - Throws GitError if git repo not found or git command fails
                                                                                                                                                                - **Branch operations:**
                                                                                                                                                                                                                                - `branchExists(branchName: string): Promise<boolean>` - Check if branch exists
                                                                                                                                                                                                                                - `getCurrentBranch(): Promise<string>` - Get current branch name
                                                                                                                                                                                                                                - `checkoutBranch(branchName: string): Promise<void>` - Checkout branch
                                                                                                                                                                - **Commit operations:**
                                                                                                                                                                                                                                - `commit(message: string, files: string[]): Promise<void>` - Commit files with standard message format
                                                                                                                                                                                                                                - Standard commit message format: `[oxygen] {action}: {spec-id} - {description}`
                                                                                                                                                                                                                                - Example: `[oxygen] refine: spec-001 - Attempt 3, progress 85%`
                                                                                                                                                                - **Working directory:**
                                                                                                                                                                                                                                - `isDirty(): Promise<boolean>` - Check if working directory has uncommitted changes
                                                                                                                                                                                                                                - `resetHard(): Promise<void>` - Reset working directory to clean state (used before refinement)
                                                                                                                                                                                                                                - `getStatus(): Promise<GitStatus>` - Get git status information
                                                                                                                                                                - **Note:** Branches are permanent history records for accountability and cost tracking. They are NOT deleted or merged together. Each refinement attempt creates a new branch (`oxygen/spec-{id}-{attempt}`) that persists indefinitely as an immutable record of that attempt's outcomes.
                                                                                                                                                                - **No merge handling:** System does not handle merge conflicts. Branches are never merged. Each attempt is a separate branch.

**Path Management Strategy:**

- **Workspace root detection:** Walk up from current working directory looking for `.oxygen/` directory
- **Relative paths:** All file operations use relative paths from workspace root
- **Path resolution:** `workspaceRoot + relativePath = absolutePath`
- **Cross-platform:** Use Node.js `path` module for proper path handling on Windows/Unix
- **Error handling:** Throw clear errors if workspace root not found or paths are invalid

**File Operation Patterns:**

- **Atomic writes:** Write to temp file, then rename (prevents corruption)
- **Directory creation:** Recursive directory creation with proper permissions
- **Error handling:** Retry on transient errors (EAGAIN, EINTR)
- **Windows compatibility:** Handle Windows path separators and permissions

**Dependencies:** Phase 2 (types exist for config/specs)

---

### Phase 4: Config & State Management

**Goal:** Manage `.oxygen/config.json` - read, write, spec registry, ID generation with Zod validation and atomic writes.

**Overview:**

ConfigManager handles reading/writing `.oxygen/config.json` with Zod validation. No external config library needed - simple file I/O with atomic writes.

**File Structure:**

```
packages/core/src/
├── schema/
│   └── configSchema.ts          # Zod schema for OxygenConfig (defined in Phase 2)
└── config/
    └── ConfigManager.ts         # Main ConfigManager class
```

**Files to create:**

1. **ConfigManager class (`packages/core/src/config/ConfigManager.ts`):**

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

**Error Handling:**

The `ConfigError` class is defined in the ConfigManager file and extends `Error`. It handles:

- Invalid JSON syntax
- Schema validation failures (Zod errors with path information)
- File I/O errors
- Duplicate spec ID registration

**Note:** `ConfigError` may extend a base `OxygenError` class if one exists in Phase 3, but can also be standalone for this phase.

**Atomic Write Pattern:**

Prevents corruption on concurrent writes:

1. Write to `config.json.tmp`
2. `fs.rename('config.json.tmp', 'config.json')` - atomic on Unix/Windows
3. If write fails, clean up temp file

**Concurrency behavior:**

- Last write wins (acceptable for ID counter race conditions)
- No file corruption (atomic rename prevents partial writes)
- For strict ordering (rarely needed), could add file locking later with `proper-lockfile`

**API Summary:**

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

**Usage Examples:**

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

**Integration Points:**

- **Phase 2**: Uses `OxygenConfigSchema` defined in `packages/core/src/schema/configSchema.ts`
- **Phase 3**: `ConfigError` may extend base `OxygenError` class (if base exists in Phase 3)
- **CLI `init` command**: Call `config.initialize()` to create default config
- **CLI `generate` command**: Call `config.incrementSpecId()` and `config.registerSpec()`

**Testing Considerations:**

Key test cases:

- Read non-existent config (returns defaults)
- Read invalid JSON (throws ConfigError)
- Read invalid schema (throws ConfigError with Zod details)
- Atomic write (concurrent writes don't corrupt)
- Increment ID (atomically updates)
- Register spec (prevents duplicates)
- Find spec by ID/name

**Dependencies:**

- `zod` (^3.22.0): Schema validation (already in plan)
- Node.js `fs` module: File I/O (built-in)
- No external config library needed

**Dependencies:** Phase 3 (file utilities, error handling), Phase 2 (config schema exists)

---

### Phase 5: Parsing & Validation

**Files to create in `packages/core/src/parser/`:**

1.  **Spec parser:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `spec-parser.ts` - SpecParser class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load spec JSON files from `.oxygen/specs/`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Parse and validate against SpecSchema using Zod
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Handle parsing errors with detailed messages

2.  **Detail parser:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `detail-parser.ts` - DetailParser class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load technical/product/integration detail files from `.oxygen/details/{spec-id}/`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Parse and validate against respective schemas

3.  **Validator:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `validator.ts` - Validation wrapper
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Schema validation error formatting
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Type-safe validation results

**Dependencies:** Phase 4 (can find spec files via config), Phase 2 (schemas exist)

---

### Error Handling Strategy

**Error Hierarchy:**

All errors extend a base `OxygenError` class for consistent error handling:

```typescript
// packages/core/src/utils/errors.ts

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
```

**Error Handling Patterns:**

1. **Core library errors:** Throw typed errors (ConfigError, ValidationError, etc.)
2. **CLI error handling:** Each command wraps implementation in try-catch, formats errors based on output mode
3. **Error serialization:** Errors can be serialized to JSON for --json output mode
4. **User-friendly messages:** Human-readable error messages with context and suggestions
5. **Developer-friendly details:** Include stack traces in verbose mode or when debugging

**Error Recovery:**

- **File operations:** Retry on transient errors (EAGAIN, EINTR)
- **Network operations (adapters):** Retry with exponential backoff
- **Validation errors:** Provide detailed path information for fixing issues
- **Git operations:** Clear error messages with suggested actions

**Logging Strategy:**

- Errors are logged to stderr
- Success messages to stdout (only in verbose mode)
- JSON output includes error details in structured format
- No file-based logging (CLI tool, not a service)

---

### Phase 6: CLI Foundation

**Architecture:** File-per-command pattern with modular command structure. Each command is a separate file that exports a setup function.

**Files to create in `packages/cli/src/`:**

1.  **CLI structure:**

                                                                                                - `index.ts` - Main entry point with commander.js setup
                                                                                                                                                                - Root program configuration (name, version, description)
                                                                                                                                                                - Global options (--verbose, --json, --no-color, --non-interactive)
                                                                                                                                                                - Command registration (imports and registers all commands)
                                                                                                                                                                - Global error handler (catches unhandled errors)
                                                                                                                                                                - Exit code handling
                                                                                                - `types.ts` - Shared TypeScript types for CLI (CommandContext, OutputFormat, etc.)
                                                                                                - `constants.ts` - Exit codes, default values, configuration constants

2.  **CLI utilities:**

                                                                                                - `utils/output.ts` - Output formatting helpers
                                                                                                                                                                - `OutputManager` class for managing output format (human-friendly vs JSON)
                                                                                                                                                                - Color support using chalk (disabled with --no-color flag)
                                                                                                                                                                - Success/error/warning/info message formatting
                                                                                                                                                                - Progress indicators (spinners using ora, progress bars)
                                                                                                                                                                - Silent mode (CI mode - no success messages, only errors)
                                                                                                                                                                - Verbose mode (detailed output, success messages)
                                                                                                                                                                - JSON output formatter (standard structure)
                                                                                                - `utils/prompts.ts` - Interactive prompt helpers
                                                                                                                                                                - Wrapper around inquirer for consistent prompting
                                                                                                                                                                - Non-interactive mode detection (--non-interactive flag or CI env)
                                                                                                                                                                - Validation helpers for common input types
                                                                                                                                                                - Confirmation prompts with defaults
                                                                                                - `utils/errors.ts` - CLI error handling utilities
                                                                                                                                                                - Error formatting (human-friendly vs JSON)
                                                                                                                                                                - Exit code mapping
                                                                                                                                                                - Error context extraction

3.  **Command structure pattern:**

Each command file (`packages/cli/src/commands/{command}.ts`) follows this pattern:

```typescript
import { Command } from 'commander';
import { CommandContext } from '../types';
import { OutputManager } from '../utils/output';

export function setupInitCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize Oxygen workspace in current directory')
    .option('--force', 'Overwrite existing .oxygen directory')
    .action(async (options) => {
      const context: CommandContext = {
        verbose: program.opts().verbose ?? false,
        json: program.opts().json ?? false,
        noColor: program.opts().noColor ?? false,
        nonInteractive: program.opts().nonInteractive ?? process.env.CI === 'true',
      };

      const output = new OutputManager(context);

      try {
        // Command implementation
        // Use output.success(), output.error(), output.spinner(), etc.
        process.exit(0);
      } catch (error) {
        output.error(error);
        process.exit(1);
      }
    });
}
```

**Global Options (available on all commands):**

- `--verbose, -v` - Verbose output (show success messages, detailed progress)
- `--json` - Output in JSON format (machine-readable)
- `--no-color` - Disable colored output
- `--non-interactive` - Skip all prompts (use defaults or fail if required input missing)

**Exit Code Conventions:**

- `0` - Success
- `1` - General error (validation, file I/O, business logic errors)
- `2` - Invalid arguments/options
- `3` - Configuration error (missing config, invalid config)
- `4` - Spec not found
- `5` - Git operation error

**Output Formatting Strategy:**

- **Default (human-friendly):**
  - Colored output (green=success, red=error, yellow=warning, blue=info)
  - Progress spinners for async operations
  - Silent success (no output on success unless --verbose)
  - Error messages with context and suggestions

- **JSON mode (`--json` flag):**
  - Standard JSON structure:
    ```json
    {
      "success": true|false,
      "data": {...},
      "error": {...},
      "warnings": [...],
      "metadata": {
        "command": "init",
        "timestamp": "2024-01-01T00:00:00Z",
        "version": "1.0.0"
      }
    }
    ```

- **CI/Non-interactive mode:**
  - Silent success (no output on success)
  - Only errors to stderr
  - No prompts (fail if required input missing)
  - Exit codes are critical for automation

**Error Handling:**

- Each command wraps implementation in try-catch
- Errors are formatted based on output mode (human-friendly vs JSON)
- Exit codes are set appropriately
- Unhandled errors are caught by global handler in `index.ts`

**Dependencies:** Phase 5 (can reference core functionality)

---

### Phase 7: Spec Linter

**Location:** `packages/core/src/linter/`

**Architecture:** Extensible rule-based linting system with built-in rules and support for custom rules. Similar architecture to ESLint with enable/disable rules and configurable severity.

**Files to create:**

1.  **Rule engine architecture:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `linter.ts` - SpecLinter class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Rule execution engine (executes all enabled rules against parsed spec)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Result aggregation and scoring
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Pass/fail determination based on thresholds

2.  **Rule interface:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `rule.ts` - Rule interface definition

    ```typescript
    interface Rule {
      id: string; // Unique rule identifier (e.g., "require-meta")
      category: RuleCategory; // structural | technical | product | integration | consistency
      description: string; // Human-readable description
      severity: 'error' | 'warning' | 'info'; // Default severity
      run(spec: ParsedSpec, details: ParsedDetails): RuleResult; // Rule execution method
    }
    ```

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `types.ts` - TypeScript types for Rule, RuleResult, RuleCategory, LinterResult

3.  **Built-in rules (organized by category):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `rules/structural/` - Structural validation rules
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `require-meta.ts` - Ensures meta section exists with required fields
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `require-spec-section.ts` - Ensures spec section exists
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `field-presence.ts` - Validates required fields are present
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `non-empty-validation.ts` - Ensures fields are not empty strings/arrays

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `rules/technical/` - Technical detail validation rules
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `architecture-decisions.ts` - Checks for documented architecture decisions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `performance-requirements.ts` - Validates performance requirements are specified
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `error-handling.ts` - Ensures error handling strategies are documented
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `state-machines.ts` - Validates state machine definitions (if applicable)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `edge-cases.ts` - Checks for edge case documentation

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `rules/product/` - Product detail validation rules
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `user-flow-completeness.ts` - Validates user flows are complete
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `success-criteria-measurability.ts` - Ensures success criteria are measurable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `edge-case-definitions.ts` - Checks for product edge case definitions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `constraint-specifications.ts` - Validates constraints are well-specified

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `rules/integration/` - Integration detail validation rules
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `contract-completeness.ts` - Validates API contracts are complete
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `data-model-completeness.ts` - Ensures data models are fully defined
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `error-scenarios.ts` - Checks for documented error scenarios
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `retry-strategies.ts` - Validates retry strategies are specified
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `rate-limits.ts` - Ensures rate limits are documented

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `rules/consistency/` - Cross-section consistency validation rules
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `constraint-conflicts.ts` - Detects conflicting constraints
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `assumption-contradictions.ts` - Finds contradictory assumptions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `dependency-consistency.ts` - Validates dependency references are consistent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `scope-criteria-alignment.ts` - Ensures scope aligns with success criteria

4.  **Custom rule system:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `custom-rule-loader.ts` - CustomRuleLoader class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load rules from file paths using globby (supports glob patterns like `.oxygen/custom-rules/**/*.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load rules from npm packages (package must export rules)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Validate loaded rules match Rule interface
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Support for rule options/configuration
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `rule-validator.ts` - Validates custom rules match expected interface

5.  **Configuration system:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `config-loader.ts` - LinterConfigLoader class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load configuration using cosmiconfig
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Supports `.oxygenrc.json`, `oxygen.config.js`, or `oxygen.config.ts`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Merge default configuration with user configuration
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Validate configuration schema using Zod
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `default-config.ts` - Default linter configuration with all built-in rules enabled

**Configuration file format (`.oxygenrc.json` or `oxygen.config.js`):**

```json
{
  "rules": {
    "require-meta": "error",
    "require-spec-section": "error",
    "technical-detail-completeness": "warning",
    "custom/company-rule": ["error", { "customOption": true }]
  },
  "customRules": [".oxygen/custom-rules/**/*.ts"],
  "scoreThresholds": {
    "structural": 0.8,
    "technical": 0.6,
    "product": 0.6,
    "integration": 0.6,
    "consistency": 0.7,
    "overall": 0.7
  },
  "weights": {
    "structural": 0.2,
    "technical": 0.3,
    "product": 0.3,
    "integration": 0.2,
    "consistency": 0.0
  }
}
```

**Rule configuration options:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `"rule-name": "error"` - Enable rule with error severity
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `"rule-name": "warning"` - Enable rule with warning severity
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `"rule-name": "off"` - Disable rule
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `"rule-name": ["error", { options }]` - Enable with custom options

6.  **Scoring system:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `scorer.ts` - ScoringEngine class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Category-based scoring**: Calculate score (0-1) for each category
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - For each category, count passed rules vs total rules
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Category score = (passed rules) / (total rules in category)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Weighted overall score**: Calculate overall score using category weights
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Overall score = Σ(category_score × category_weight)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Default weights: structural (0.2), technical (0.3), product (0.3), integration (0.2), consistency (0.0)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Threshold checking**: Compare scores against status-specific thresholds
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Roadmap spec: 45% minimum overall score
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Draft spec: 80% minimum overall score
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Approved spec: 95% minimum overall score
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Per-category thresholds**: Optional per-category minimum scores
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `score-types.ts` - TypeScript types for scores and thresholds

7.  **Reporting:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `reporter.ts` - Reporter class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Structured results with issues, paths, severity, suggestions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Pass/fail status determination
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Formatted output (console, JSON, markdown)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Issue grouping by category and severity
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `formatters/` - Output formatters
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `console-formatter.ts` - Human-readable console output
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `json-formatter.ts` - JSON output for tooling
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `markdown-formatter.ts` - Markdown report format

**Key libraries:**

- `zod` (^3.22.0) - Schema validation and TypeScript type inference (for rule validation and config validation)
- `ajv` (^8.12.0) - Alternative JSON Schema validation (optional, faster for large files)
- `globby` (^13.2.0) - Loading custom rules from file paths (glob pattern matching)
- `cosmiconfig` (^8.2.0) - Configuration file loading (`.oxygenrc`, `oxygen.config.js`, `oxygen.config.ts`)

**Linting Rule Algorithms:**

Each rule follows a consistent algorithm pattern:

1. **Structural Rules:**
   - **`require-meta`**: Check if `spec.meta` exists and contains required fields (`id`, `version`, `status`, `created_at`). Fail if any required field is missing.
   - **`require-spec-section`**: Check if `spec.spec` exists. Fail if missing.
   - **`field-presence`**: Validate that all required fields in spec schema are present. Traverse spec object and check against schema requirements.
   - **`non-empty-validation`**: For string fields, check `value.trim().length > 0`. For arrays, check `array.length > 0`. For objects, check `Object.keys(obj).length > 0`.

2. **Technical Rules:**
   - **`architecture-decisions`**: Check if `technical_detail.architecture_decisions` exists and is non-empty array. Each decision should have `decision`, `rationale`, `alternatives`.
   - **`performance-requirements`**: Check if `technical_detail.performance` exists with required metrics (latency, throughput, etc.).
   - **`error-handling`**: Check if `technical_detail.error_handling` exists with strategies for different error types.
   - **`edge-cases`**: Check if `technical_detail.edge_cases` exists and documents known edge cases.

3. **Product Rules:**
   - **`user-flow-completeness`**: Check if `product_detail.user_flows` exists and each flow has start, steps, and end states defined.
   - **`success-criteria-measurability`**: Check if `spec.spec.success_criteria` items are measurable (contain metrics, thresholds, or testable conditions).
   - **`constraint-specifications`**: Check if `spec.spec.constraints` are well-specified (have rationale, impact, and mitigation if applicable).

4. **Integration Rules:**
   - **`contract-completeness`**: Check if `integration_detail.apis` exist and each API has method, path, request/response schemas defined.
   - **`data-model-completeness`**: Check if `integration_detail.data_models` exist and each model has all required fields with types.
   - **`error-scenarios`**: Check if `integration_detail.error_scenarios` exist and document common error cases.
   - **`retry-strategies`**: Check if `integration_detail.retry_strategies` exist for external API calls.
   - **`rate-limits`**: Check if `integration_detail.rate_limits` are documented for external services.

5. **Consistency Rules:**
   - **`constraint-conflicts`**: Compare constraints in `spec.spec.constraints` and detect logical conflicts (e.g., "must be fast" vs "must process all data synchronously").
   - **`assumption-contradictions`**: Check if assumptions in `spec.risk.assumptions` contradict each other or contradict constraints.
   - **`dependency-consistency`**: Validate that all dependencies in `spec.spec.dependencies` reference valid spec IDs in registry.
   - **`scope-criteria-alignment`**: Check if `spec.spec.scope` aligns with `spec.spec.success_criteria` (scope should enable achieving success criteria).

**Rule Execution Order:**

1. Load all enabled rules (built-in + custom)
2. Validate rules match Rule interface
3. Execute rules in parallel (where possible) or sequentially (if dependencies exist)
4. Aggregate results by category
5. Calculate category scores
6. Calculate weighted overall score
7. Compare against thresholds
8. Generate report

**Implementation details:**

- **Rule execution**: Rules receive parsed spec and detail files, return RuleResult with pass/fail status, issues, and suggestions
- **Error handling**: Invalid rules are skipped with warnings, configuration errors are reported clearly
- **Performance**: Rules are executed in parallel where possible, results are cached per spec until spec changes
- **Extensibility**: Custom rules can be written in TypeScript and loaded dynamically, supporting the same interface as built-in rules

**Dependencies:** Phase 5 (can parse specs to lint)

---

### Phase 8: View Generation System

**Output Format:** Views are generated as Markdown files (`.md`) for human readability and presentation. Views are presentations of the spec optimized for different use cases.

**Files to create in `packages/core/src/views/`:**

1.  **View generator:**

                                                                                                - `generator.ts` - ViewGenerator class
                                                                                                                                                                - Full view (all sections, all details) ~15K tokens
                                                                                                                                                                - Execution view (filters business context, keeps implementation details) ~8K tokens
                                                                                                                                                                - Reference view (integration surface only) ~2K tokens
                                                                                                                                                                - Token estimation using tiktoken (simple character count approximation)
                                                                                                                                                                - Markdown serialization (structured markdown with headers, code blocks, lists)
                                                                                                                                                                - Metadata generation (generated timestamp, spec version, view type)

2.  **View filters:**

                                                                                                - `filters.ts` - Filter logic
                                                                                                                                                                - Section filtering (include/exclude sections based on view type)
                                                                                                                                                                - Field filtering within sections (remove fields not needed for view type)
                                                                                                                                                                - Detail file inclusion/exclusion (include all detail files for execution view, selective for reference view)

3.  **View caching:**

                                                                                                - `cache.ts` - ViewCache class
                                                                                                                                                                - Cache generated views in `.oxygen/views/{spec-id}-{view-type}.md`
                                                                                                                                                                - Cache metadata in `.oxygen/views/{spec-id}-{view-type}.meta.json`
                                                                                                                                                                - Cache invalidation on spec update (compare spec file mtime with cache mtime)
                                                                                                                                                                - Cache key includes spec ID, view type, and spec version

4.  **Markdown formatter:**

                                                                                                - `markdown-formatter.ts` - MarkdownFormatter class
                                                                                                                                                                - Converts structured spec data to Markdown
                                                                                                                                                                - Handles code blocks, tables, lists, headers
                                                                                                                                                                - Preserves formatting and structure

5.  **Token estimator:**

                                                                                                - `token-estimator.ts` - TokenEstimator class
                                                                                                                                                                - Uses tiktoken for token counting
                                                                                                                                                                - Simple character count approximation as fallback
                                                                                                                                                                - Estimates tokens for different providers (Claude, OpenAI)

**View File Naming Convention:**

- Full view: `.oxygen/views/{spec-id}-full.md`
- Execution view: `.oxygen/views/{spec-id}-execution.md`
- Reference view: `.oxygen/views/{spec-id}-reference.md`
- Metadata: `.oxygen/views/{spec-id}-{view-type}.meta.json`

**Metadata Structure:**

```json
{
  "specId": "spec-001",
  "specVersion": "1.0.0",
  "viewType": "execution",
  "generatedAt": "2024-01-01T00:00:00Z",
  "tokenEstimate": 8234,
  "specFileMtime": "2024-01-01T00:00:00Z",
  "cacheKey": "spec-001-execution-1.0.0"
}
```

**Filter rules:**

- **Execution view**: Removes `impact`, `effort`, `risk.unknown_unknowns`, `analysis`, `workspace`, `history`. Keeps `meta`, `spec`, `risk.technical_risks`, `risk.assumptions` (validated only), ALL detail files.
- **Reference view**: Contains objective (one-line), summary, scope, public APIs (contracts only), data models (shared fields only), events, dependencies, constraints, ownership. Removes internal implementation details.

**Cache Invalidation Strategy:**

1. Check if cache file exists
2. Compare spec file modification time with cache metadata timestamp
3. If spec is newer, regenerate view
4. If cache is valid, return cached view
5. On spec update, delete all cached views for that spec

**Dependencies:** Phase 5 (can parse specs)

**Key libraries:**

- `tiktoken` (^1.0.0) - Token counting for Claude/OpenAI models

---

### Phase 9: Basic CLI Commands (Read-Only)

**Files to create in `packages/cli/src/commands/`:**

1.  **`init` command:**

                                                                                                - `init.ts` - Initialize Oxygen workspace
                                                                                                                                                                - **Syntax:** `oxygen init [options]`
                                                                                                                                                                - **Options:**
                                                                                                                                                                                                                                - `--force, -f` - Overwrite existing `.oxygen/` directory
                                                                                                                                                                - **Behavior:**
                                                                                                                                                                                                                                - Check for existing `.oxygen/` directory (prompt if exists, unless --force)
                                                                                                                                                                                                                                - Create directory structure (`.oxygen/specs/`, `.oxygen/details/`, `.oxygen/views/`, `.oxygen/roadmaps/`)
                                                                                                                                                                                                                                - Initialize default `config.json` using ConfigManager
                                                                                                                                                                                                                                - Add `.oxygen/views/` to `.gitignore` (append if .gitignore exists)
                                                                                                                                                                - **Output:** Success message (verbose mode) or silent (CI mode)
                                                                                                                                                                - **Exit codes:** 0 (success), 1 (error), 3 (config error)

2.  **`view` command:**

                                                                                                - `view.ts` - Generate and display spec view
                                                                                                                                                                - **Syntax:** `oxygen view <spec> [options]`
                                                                                                                                                                - **Arguments:**
                                                                                                                                                                                                                                - `<spec>` - Spec ID (e.g., `spec-001`) or name (required)
                                                                                                                                                                - **Options:**
                                                                                                                                                                                                                                - `--type <type>` - View type: `full`, `execution`, `reference` (default: `execution`)
                                                                                                                                                                                                                                - `--output <file>` - Write to file instead of stdout
                                                                                                                                                                                                                                - `--no-cache` - Force regeneration (skip cache)
                                                                                                                                                                - **Behavior:**
                                                                                                                                                                                                                                - Resolve spec by name/ID (search config registry)
                                                                                                                                                                                                                                - Load spec and detail files
                                                                                                                                                                                                                                - Check cache (unless --no-cache)
                                                                                                                                                                                                                                - Generate view using ViewGenerator
                                                                                                                                                                                                                                - Output Markdown to stdout or file
                                                                                                                                                                                                                                - Show token count estimate
                                                                                                                                                                - **Output:** Markdown content (human-friendly) or JSON with markdown content (--json)
                                                                                                                                                                - **Exit codes:** 0 (success), 1 (error), 4 (spec not found)

3.  **`lint` command:**

                                                                                                - `lint.ts` - Lint spec for completeness and quality
                                                                                                                                                                - **Syntax:** `oxygen lint <spec> [options]`
                                                                                                                                                                - **Arguments:**
                                                                                                                                                                                                                                - `<spec>` - Spec ID or name (required)
                                                                                                                                                                - **Options:**
                                                                                                                                                                                                                                - `--format <format>` - Output format: `console`, `json`, `markdown` (default: `console`)
                                                                                                                                                                                                                                - `--threshold <score>` - Override threshold (0-100, default: status-based)
                                                                                                                                                                - **Behavior:**
                                                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                                                - Load spec and detail files
                                                                                                                                                                                                                                - Call SpecLinter
                                                                                                                                                                                                                                - Format and display lint results
                                                                                                                                                                                                                                - Exit with code 1 if below threshold, 0 if passing
                                                                                                                                                                - **Output:** Formatted results (human-friendly) or JSON (--json)
                                                                                                                                                                - **Exit codes:** 0 (passing), 1 (failing or error), 4 (spec not found)

4.  **`analyze` command:**

                                                                                                - `analyze.ts` - Analyze spec impact, effort, risk, and ROI
                                                                                                                                                                - **Syntax:** `oxygen analyze <spec> [options]`
                                                                                                                                                                - **Arguments:**
                                                                                                                                                                                                                                - `<spec>` - Spec ID or name (required)
                                                                                                                                                                - **Options:**
                                                                                                                                                                                                                                - `--update` - Write calculated analysis back to spec file
                                                                                                                                                                - **Behavior:**
                                                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                                                - Load spec and detail files
                                                                                                                                                                                                                                - Call analysis engine (ImpactCalculator, EffortEstimator, RiskAnalyzer, ROICalculator)
                                                                                                                                                                                                                                - Display formatted analysis results
                                                                                                                                                                                                                                - Optionally update spec file with calculated analysis (--update flag)
                                                                                                                                                                - **Outputs:** Formatted console output showing:
                                                                                                                                                                                                                                - Impact score (1-10) - **read from spec** (user-provided)
                                                                                                                                                                                                                                - Effort breakdown - **calculated automatically** (token cost, actor time, total)
                                                                                                                                                                                                                                - Risk score (1-10) - **read from spec** (user-provided, future: auto-detection)
                                                                                                                                                                                                                                - ROI calculation: Expected Value = (Impact × Probability_of_Success) - Effort
                                                                                                                                                                                                                                - Decision recommendation: approve/defer/reject
                                                                                                                                                                - **Integration:** Can be called anytime after spec creation, used in `generate` flow (show analysis after creation), used in `refine` flow (re-analyze after updates), used in `roadmap optimize` (batch analysis)
                                                                                                                                                                - **Exit codes:** 0 (success), 1 (error), 4 (spec not found)

**Command Examples:**

```bash
# Initialize workspace
oxygen init
oxygen init --force

# View spec (execution view by default)
oxygen view spec-001
oxygen view spec-001 --type full --output spec-view.md
oxygen view spec-001 --no-cache

# Lint spec
oxygen lint spec-001
oxygen lint spec-001 --format json
oxygen lint spec-001 --threshold 90

# Analyze spec
oxygen analyze spec-001
oxygen analyze spec-001 --update

# Non-interactive mode (for agents/CI)
oxygen init --non-interactive
oxygen view spec-001 --json
oxygen lint spec-001 --format json --json
```

**CLI integration:** Wire commands into `index.ts` using commander.js file-per-command pattern. Each command file exports a `setup{Command}Command(program: Command)` function that is called from `index.ts`.

**Dependencies:** Phase 6 (CLI framework), Phase 5 (parsing), Phase 4 (config), Phase 7 (linter), Phase 8 (views), Phase 10 (analysis engine)

---

### Phase 10: Analysis Engine (Impact/Effort/Risk)

**Calculation Philosophy:**

- **Impact (1-10): USER INPUT** - Not calculated automatically. Users provide impact scores during spec creation/editing based on business/user/technical/competitive value. Stored in `impact` section of spec JSON.
- **Effort ($): AUTO-CALCULATED** - Deterministically calculated from spec characteristics. Components include token cost (estimated from spec size), actor time (estimated from complexity), and development cost breakdown.
- **Risk (1-10): USER INPUT (with future auto-detection)** - Currently user-provided during spec creation/editing. Future enhancement: `RiskAnalyzer` can automatically identify risks from spec content (not in MVP). Stored in `risk` section of spec JSON.
- **Analysis (ROI + Decision): CALCULATED** - Generated from Impact, Effort, and Risk inputs using ROI formulas.

**Files to create in `packages/core/src/analysis/`:**

1.  **Impact calculator:**

                                                                                                                                                                                                                                                                - `impact-calculator.ts` - ImpactCalculator class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Read impact from spec** (user-provided values)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Aggregate impact score** - Weighted average of components:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Impact = (business_value × 0.4) + (user_value × 0.3) + (technical_value × 0.2) + (competitive_value × 0.1)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Each component is 1-10 scale
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Weights are configurable (defaults shown above)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Return impact score (1-10) from spec data
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Note:** Does NOT calculate impact automatically - reads user input, aggregates it

2.  **Effort estimator:**

                                                                                                                                                                                                                                                                - `effort-estimator.ts` - EffortEstimator class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Calculate token cost** - Estimate from spec size using tiktoken
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Token cost = (full view token count + detail files token count) × token_price_per_1k
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Token price varies by provider (Claude, OpenAI) - configurable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Default: ~$0.003 per 1K tokens (Claude Sonnet)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Estimate actor time** - Based on complexity metrics (time not super relevant for agents, but tracked for completeness):
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Base time = 0 (agents work quickly, cost is per token not per time)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Complexity factors tracked but don't significantly affect cost
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Calculate total effort** - Total effort = token cost (actor time cost is negligible)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Deterministic calculation** - Same spec always produces same effort estimate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Store calculated effort in spec's `effort` section
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Formula:** `effort = token_cost_estimate`

3.  **Risk analyzer:**

                                                                                                                                                                                                                                                                                                                                                                                                - `risk-analyzer.ts` - RiskAnalyzer class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Read risk from spec** (user-provided values in MVP)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Return risk score (1-10) from spec data
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Future enhancement (not in MVP):** Auto-detect risks by analyzing:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Technical complexity indicators
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Unvalidated assumptions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Rollback difficulty indicators
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Blast radius analysis
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Note:** MVP reads user input, future versions can auto-identify

4.  **ROI calculator:**

                                                                                                                                                                                                                                                                - `roi-calculator.ts` - ROICalculator class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Calculate expected value:** Expected Value = (Impact × Probability_of_Success) - Effort
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Probability of Success calculation:** Based on risk score (higher risk = lower probability)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Probability_of_Success = 1 - (risk_score / 10)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Example: risk_score = 3 → probability = 0.7 (70%)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Example: risk_score = 8 → probability = 0.2 (20%)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **ROI Formula:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Expected_Value = (Impact × (1 - Risk/10)) - Effort
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Impact is 1-10 scale (normalized to value units)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Effort is in dollars ($)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Expected_Value is in value units (positive = good, negative = bad)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Decision recommendation:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Approve: Expected_Value > threshold (default: 5)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Defer: Expected_Value between 0 and threshold
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Reject: Expected_Value < 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Formula: Probability_of_Success = 1 - (Risk_Score / 10) × risk_factor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Risk factor: 0.3 (30% of risk score affects probability)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Generate decision recommendations:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Approve: Expected Value > threshold (e.g., > 0)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Defer: Expected Value near zero or negative, but high impact
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        - Reject: Expected Value significantly negative, low impact
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Store ROI and decision in spec's `analysis` section

**Analysis Output Format:**

```typescript
interface AnalysisResult {
  impact: {
    score: number; // 1-10 (from spec, user input)
    business_value: number; // Component breakdown
    user_value: number;
    technical_value: number;
    competitive_value: number;
  };
  effort: {
    token_cost: number; // Calculated from spec size
    actor_time_cost: number; // Calculated from complexity
    total: number; // Sum of above
    breakdown: {
      spec_creation: number;
      implementation: number;
      testing: number;
    };
  };
  risk: {
    score: number; // 1-10 (from spec, user input)
    technical_risks: string[];
    assumptions: string[];
    rollback_difficulty: string;
  };
  roi: {
    expected_value: number; // (Impact × Probability_of_Success) - Effort
    probability_of_success: number; // Calculated from risk
    recommendation: 'approve' | 'defer' | 'reject';
    reasoning: string;
  };
}
```

**Dependencies:** Phase 5 (can parse specs to analyze)

---

### Phase 11: Spec Generation Command

**Files to create in `packages/cli/src/commands/`:**

1.  **`generate` command:**

                                                                                                - `generate.ts` - Generate new spec
                                                                                                                                                                - **Syntax:** `oxygen generate [options]`
                                                                                                                                                                - **Options:**
                                                                                                                                                                                                                                - `--name <name>` - Spec name (required in non-interactive mode)
                                                                                                                                                                                                                                - `--objective <text>` - Objective description (required in non-interactive mode)
                                                                                                                                                                                                                                - `--status <status>` - Initial status: `roadmap`, `draft` (default: `roadmap`)
                                                                                                                                                                                                                                - `--adapter <adapter>` - Spec generation adapter: `noop`, `claude`, `openai` (default: `noop`)
                                                                                                                                                                                                                                - `--skip-lint` - Skip auto-linting after generation
                                                                                                                                                                - **Interactive flow (if not --non-interactive):**
                                                                                                                                                                                                                                1. Prompt for objective (required)
                                                                                                                                                                                                                                2. Prompt for systems involved (multi-select, optional)
                                                                                                                                                                                                                                3. Prompt for initial status (default: roadmap)
                                                                                                                                                                                                                                4. Prompt for adapter choice (default: noop)
                                                                                                                                                                                                                                5. If adapter != noop: Call adapter with prompt
                                                                                                                                                                                                                                6. Generate spec structure with next available ID
                                                                                                                                                                                                                                7. Validate generated spec
                                                                                                                                                                                                                                8. Save to `.oxygen/specs/{spec-id}-{name}.oxygen.json`
                                                                                                                                                                                                                                9. Update config registry
                                                                                                                                                                                                                                10. Auto-run lint (unless --skip-lint)
                                                                                                                                                                                                                                11. Show summary (spec ID, file location, lint score)
                                                                                                                                                                - **Non-interactive flow:**
                                                                                                                                                                                                                                - Requires --name and --objective flags
                                                                                                                                                                                                                                - Uses defaults for optional fields
                                                                                                                                                                                                                                - Fails if required inputs missing
                                                                                                                                                                - **Output:** Success message with spec ID and file path (verbose) or JSON (--json)
                                                                                                                                                                - **Exit codes:** 0 (success), 1 (error), 2 (invalid arguments), 3 (config error)

2.  **Spec generation adapter (basic):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `packages/core/src/adapters/spec-generation/interface.ts` - Adapter interface
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `packages/core/src/adapters/spec-generation/noop-adapter.ts` - No-op adapter (manual entry only)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - CLI integration for choosing adapter

**Dependencies:** Phase 9 (CLI framework, init command exists), Phase 4 (config management), Phase 5 (validation), Phase 7 (linter)

---

### Phase 12: Refinement Loop System

**Branch Management Philosophy:**

- Refinement branches (`oxygen/spec-{id}-{attempt}`) are **permanent history records** for accountability and cost tracking
- Each branch documents a single refinement attempt with its outcomes (progress, questions, errors, costs)
- Branches are **NOT merged together** — each is a separate immutable record
- Branches are **NOT deleted** — they persist indefinitely as an audit trail
- Branch metadata is recorded in the spec's refinement history for cross-reference

**Files to create in `packages/core/src/refinement/`:**

1.  **Refinement orchestrator:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `loop.ts` - RefinementLoop class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Track refinement attempts in spec
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create attempt branches (`oxygen/spec-{id}-{attempt}`) as immutable history records
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Record attempt results (progress, questions, errors)

2.  **Attempt tracker:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `attempt-tracker.ts` - Attempt metadata tracking
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Progress percentage calculation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Cost/time tracking
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Status updates

3.  **Auto-improvement agent:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `auto-improver.ts` - AutoImprover class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Analyze clarification questions to identify spec gaps
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Analyze errors to find missing details
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Propose specific spec additions/updates
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Update spec file with improvements

4.  **Convergence detection:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Detect one-shot success (100% progress, 0 questions)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Detect diminishing returns (< 5% improvement)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Mark spec as validated when criteria met

**Dependencies:** Phase 8 (views needed for execution), Phase 3 (git utilities for branches), Phase 5 (can update spec files)

---

### Phase 13: Advanced CLI Commands (Modification)

**Files to create in `packages/cli/src/commands/`:**

1.  **`refine` command:**

                                                                                                - `refine.ts` - Refine spec through implementation attempt
                                                                                                                                                                - **Syntax:** `oxygen refine <spec> [options]`
                                                                                                                                                                - **Arguments:**
                                                                                                                                                                                                                                - `<spec>` - Spec ID or name (required)
                                                                                                                                                                - **Options:**
                                                                                                                                                                                                                                - `--attempt <number>` - Specific attempt number (auto-increments if not provided)
                                                                                                                                                                                                                                - `--budget <amount>` - Maximum budget for this attempt (in dollars)
                                                                                                                                                                                                                                - `--adapter <adapter>` - Implementation adapter (default: from config)
                                                                                                                                                                                                                                - `--skip-auto-improve` - Skip auto-improvement step
                                                                                                                                                                - **Behavior:**
                                                                                                                                                                                                                                1. Load spec and validate it exists
                                                                                                                                                                                                                                2. Check if refinement already in progress (optional check)
                                                                                                                                                                                                                                3. Reset working directory to clean state (git reset --hard)
                                                                                                                                                                                                                                4. Create attempt branch (`oxygen/spec-{id}-{attempt}`)
                                                                                                                                                                                                                                5. Generate execution view (Markdown)
                                                                                                                                                                                                                                6. Show progress spinner: "Executing implementation..."
                                                                                                                                                                                                                                7. Call implementation adapter with execution view
                                                                                                                                                                                                                                8. Capture questions and errors from adapter
                                                                                                                                                                                                                                9. Show progress updates during execution
                                                                                                                                                                                                                                10. Call auto-improvement agent (unless --skip-auto-improve)
                                                                                                                                                                                                                                11. Update spec file with improvements
                                                                                                                                                                                                                                12. Record attempt in spec's refinement history
                                                                                                                                                                                                                                13. Commit changes with standard message format
                                                                                                                                                                                                                                14. Show summary (progress %, questions count, errors count, cost)
                                                                                                                                                                - **Output:** Progress updates during execution, summary at end (verbose) or JSON (--json)
                                                                                                                                                                - **Exit codes:** 0 (success), 1 (error), 4 (spec not found), 5 (git error)

2.  **`review` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `review.ts` - Load spec for review, capture review comments, record review in spec history

3.  **`approve` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `approve.ts` - Check linter threshold (must pass 95% for approval), update spec status to "approved", record approval in history

4.  **`promote` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `promote.ts` - Update spec status (roadmap → draft → approved), validate transition is allowed, update spec metadata

**Dependencies:** Phase 12 (refinement loop), Phase 7 (linter for approval checks), Phase 5 (can update specs)

---

### Phase 14: Roadmap Planning

**Files to create in `packages/core/src/roadmap/`:**

1.  **Roadmap data structures:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `roadmap-schema.ts` - Roadmap file format (`.oxygen/roadmaps/Q3-2024.json`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Status transitions (roadmap → draft → approved)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Dependency tracking

2.  **Portfolio optimizer:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `optimizer.ts` - PortfolioOptimizer class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Integer Linear Programming solver (need to select ILP library)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Objective: Maximize total impact
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Constraints: budget, dependencies, capacity

3.  **Dependency resolver:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `dependency-resolver.ts` - DependencyResolver class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Build dependency graph
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Resolve dependency conflicts
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Generate timeline

4.  **Roadmap commands:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `packages/cli/src/commands/roadmap-init.ts` - Create roadmap file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `packages/cli/src/commands/roadmap-optimize.ts` - Optimize portfolio
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `packages/cli/src/commands/roadmap-status.ts` - Show roadmap status
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `packages/cli/src/commands/roadmap-view.ts` - Display roadmap

**Dependencies:** Phase 10 (analysis engine for impact/effort/risk), Phase 5 (can load multiple specs)

---

### Phase 15: Actor Adapters

**Adapter Interface Contract:**

All adapters implement a common interface pattern with async methods, progress reporting, error handling, and timeout support.

**Base Adapter Interface:**

```typescript
// packages/core/src/adapters/types.ts

export interface AdapterProgress {
  percentage: number; // 0-100
  message: string;
  stage: string; // e.g., "generating", "validating", "complete"
}

export interface AdapterResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  questions?: string[]; // Clarification questions from adapter
  progress: AdapterProgress;
  cost?: {
    tokens: number;
    estimatedCost: number; // in dollars
  };
}

export interface AdapterConfig {
  apiKey?: string; // From environment variable
  model?: string;
  timeout?: number; // milliseconds, default: 5 minutes
  maxRetries?: number; // default: 3
  retryDelay?: number; // milliseconds, default: 1000
}

export interface BaseAdapter {
  readonly name: string;
  readonly type: 'spec-generation' | 'implementation' | 'review';

  // Validate configuration
  validateConfig(config: AdapterConfig): Promise<boolean>;

  // Health check
  healthCheck(): Promise<boolean>;
}
```

**Files to create in `packages/core/src/adapters/`:**

1.  **Spec generation adapters:**

                                                                                                - `spec-generation/interface.ts` - SpecGenerationAdapter interface
                                                                                                                                                                ```typescript
                                                                                                                                                                interface SpecGenerationAdapter extends BaseAdapter {
                                                                                                                                                                  generateSpec(
                                                                                                                                                                    prompt: string,
                                                                                                                                                                    context: SpecContext,
                                                                                                                                                                    config: AdapterConfig,
                                                                                                                                                                    onProgress?: (progress: AdapterProgress) => void
                                                                                                                                                                  ): Promise<AdapterResult<PartialSpec>>;
                                                                                                                                                                }
                                                                                                                                                                ```
                                                                                                - `spec-generation/claude-adapter.ts` - ClaudeAdapter implementation
                                                                                                                                                                - Uses Anthropic API (Claude models)
                                                                                                                                                                - API key from `CLAUDE_API_KEY` environment variable
                                                                                                                                                                - Model from config or default: `claude-3-5-sonnet-20241022`
                                                                                                                                                                - Async execution with progress callbacks
                                                                                                                                                                - Error handling with retries (exponential backoff)
                                                                                                                                                                - Timeout handling (default: 5 minutes)
                                                                                                - `spec-generation/openai-adapter.ts` - OpenAAdapter implementation
                                                                                                                                                                - Uses OpenAI API (GPT models)
                                                                                                                                                                - API key from `OPENAI_API_KEY` environment variable
                                                                                                                                                                - Model from config or default: `gpt-4-turbo-preview`
                                                                                                                                                                - Same interface as ClaudeAdapter
                                                                                                - `spec-generation/noop-adapter.ts` - No-op adapter (manual entry only)
                                                                                                                                                                - Returns empty spec structure for manual filling
                                                                                                                                                                - No API calls, no cost
                                                                                                - Adapter configuration in config.json (agentProvider section)
                                                                                                - API key management (environment variables, never stored in config)

2.  **Implementation adapter:**

                                                                                                - `implementation/interface.ts` - ImplementationAdapter interface
                                                                                                                                                                ```typescript
                                                                                                                                                                interface ImplementationAdapter extends BaseAdapter {
                                                                                                                                                                  execute(
                                                                                                                                                                    executionView: string,  // Markdown execution view
                                                                                                                                                                    workspacePath: string,
                                                                                                                                                                    config: AdapterConfig,
                                                                                                                                                                    onProgress?: (progress: AdapterProgress) => void
                                                                                                                                                                  ): Promise<AdapterResult<ImplementationResult>>;
                                                                                                                                                                }

                                                                                                                                                                interface ImplementationResult {
                                                                                                                                                                  progress: number;  // 0-100
                                                                                                                                                                  questions: string[];  // Clarification questions
                                                                                                                                                                  errors: string[];  // Errors encountered
                                                                                                                                                                  filesCreated: string[];  // Files created/modified
                                                                                                                                                                  cost: {
                                                                                                                                                                    tokens: number;
                                                                                                                                                                    estimatedCost: number;
                                                                                                                                                                  };
                                                                                                                                                                }
                                                                                                                                                                ```
                                                                                                - `implementation/agent-adapter.ts` - AgentAdapter implementation
                                                                                                                                                                - Execute implementation using execution view (Markdown)
                                                                                                                                                                - Capture questions and errors during execution
                                                                                                                                                                - Track progress (percentage complete)
                                                                                                                                                                - Report files created/modified
                                                                                                                                                                - Calculate token usage and cost
                                                                                                                                                                - Async execution with progress reporting
                                                                                                                                                                - Error handling with retries
                                                                                                                                                                - Timeout handling (default: 30 minutes for implementation)

3.  **Review adapter (optional):**

                                                                                                - `review/interface.ts` - ReviewAdapter interface
                                                                                                                                                                ```typescript
                                                                                                                                                                interface ReviewAdapter extends BaseAdapter {
                                                                                                                                                                  review(
                                                                                                                                                                    spec: ParsedSpec,
                                                                                                                                                                    config: AdapterConfig,
                                                                                                                                                                    onProgress?: (progress: AdapterProgress) => void
                                                                                                                                                                  ): Promise<AdapterResult<ReviewResult>>;
                                                                                                                                                                }
                                                                                                                                                                ```
                                                                                                - `review/adapter.ts` - Actor-agnostic review workflow
                                                                                                                                                                - Review spec for completeness and quality
                                                                                                                                                                - Generate review comments and suggestions
                                                                                                                                                                - Return structured review results

**Adapter Error Handling:**

- **Timeout:** Throw timeout error after configured timeout period
- **Retries:** Retry on transient errors (network, rate limits) with exponential backoff
- **API Errors:** Map API-specific errors to OxygenError types
- **Progress Reporting:** Call onProgress callback with updates during execution

**Adapter Configuration:**

- Adapters are configured in `.oxygen/config.json` under `agentProvider`:
  ```json
  {
    "agentProvider": {
      "type": "claude",
      "model": "claude-3-5-sonnet-20241022",
      "customConfig": {}
    }
  }
  ```
- API keys are read from environment variables (never stored in config)
- Adapters validate configuration on initialization

**Dependencies:** Phase 11 (spec generation command), Phase 12 (refinement loop needs implementation adapter)

---

### Phase 16: Utility Commands

**Files to create in `packages/cli/src/commands/`:**

1.  **`list` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `list.ts` - List all specs with status, ID, name, filter by status (--status=roadmap|draft|approved), display in formatted table

2.  **`search` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `search.ts` - Search specs by name, tags, content, display matching specs

3.  **`stats` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `stats.ts` - Portfolio-level metrics (spec count by status, average completeness, total value created)

**Dependencies:** Phase 4 (config registry), Phase 5 (can load specs)

---

### Phase 17: Documentation & Examples

**Files to create in `docs/`:**

1.  **Documentation:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `README.md` - Documentation index
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `ARCHITECTURE.md` - System architecture
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `CLI.md` - CLI usage guide
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `SPEC_FORMAT.md` - Spec JSON format documentation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `REFINEMENT_LOOP.md` - Refinement loop process
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `ROADMAP_PLANNING.md` - Roadmap planning guide

2.  **Examples:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `EXAMPLES/notifications-example.md` - Example spec
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `EXAMPLES/payment-example.md` - Example spec

**Dependencies:** All previous phases (documentation reflects implemented features)

---

## Key Dependencies & Execution Order

The phases must be executed in dependency order:

```
Phase 1 (Infrastructure)
  → Phase 2 (Schemas)
    → Phase 3 (Utilities)
      → Phase 4 (Config)
        → Phase 5 (Parsing)
          → Phase 6 (CLI Foundation)
            → Phase 7 (Linter) ────┐
            → Phase 8 (Views) ─────┤
            → Phase 10 (Analysis) ─┘
              → Phase 9 (Read-Only CLI Commands)
                → Phase 11 (Generate Command)
                  → Phase 12 (Refinement Loop)
                    → Phase 13 (Modification CLI Commands)
                  → Phase 14 (Roadmap Planning)
                  → Phase 15 (Actor Adapters)
                  → Phase 16 (Utility Commands)
                      → Phase 17 (Documentation)
```

## Technology Stack Summary

- **Runtime:** Node.js 22
- **Package Manager:** PNPM 9.0.0
- **Language:** TypeScript 5.6.0
- **Build Tool:** Turbo 1.13.0, tsup 8.0.0
- **Linting:** ESLint 9.0.0 (flat config) or Biome.js 1.9.0 (alternative)
- **Formatting:** Prettier 3.3.0
- **Git Hooks:** Husky 9.1.7, lint-staged 16.0.0
- **Development Tools:** - `tsx` (^4.7.0) - TypeScript execution (development) - `@typescript-eslint/parser` (^8.0.0) - TypeScript ESLint parser - `@typescript-eslint/eslint-plugin` (^8.0.0) - TypeScript ESLint plugin - `eslint-config-prettier` (^9.1.0) - Disable ESLint rules that conflict with Prettier (flat config compatible) - `eslint-plugin-prettier` (^6.0.0) - Run Prettier as ESLint rule (flat config compatible)
- **Core Libraries:** - `commander` (^11.0.0) - CLI framework - `zod` (^3.22.0) - Schema validation - `simple-git` (^3.19.0) - Git operations - `inquirer` (^9.2.0) - Interactive prompts - `chalk` (^4.1.2) - Terminal colors - `ora` (^5.4.1) - Spinners - `glob` (^10.3.0) - File pattern matching - `globby` (^13.2.0) - Custom rule loading - `cosmiconfig` (^8.2.0) - Configuration loading

## Success Criteria

- Specs achieve 95%+ completeness before approval
- One-shot implementation success rate >90% with validated specs
- Refinement loop converges in <5 attempts on average
- 79% cost reduction at scale (100 features)
- Portfolio optimization generates viable roadmaps within budget constraints

## Roadmap Items (Future Enhancements - Not in MVP)

These features are documented but not required for first pass:

- Custom view system (plugin-based)
- Spec reuse detection & value tracking
- Historical analysis & compounding metrics
- Export/import formats (Spec Kit, Task Master)
- MCP server interface
- Web UI
- Integration with external tools (Jira, Figma, GitHub)
- Advanced refinement strategies
