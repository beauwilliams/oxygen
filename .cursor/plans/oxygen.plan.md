---
name: Oxygen Specification Management System - Complete Implementation Plan
overview: Build a comprehensive actor-agnostic specification management system that treats specs as first-class, versioned assets, enabling zero-ambiguity implementations through structured schemas, impact/effort/risk analysis, refinement loops, and strategic roadmap planning. The system uses a PNPM monorepo with TypeScript, targeting Node 22.
todos:
  - id: phase1-infrastructure
    content: 'Phase 1: Initialize PNPM monorepo with packages (cli, core, prettier-config, eslint-config), configure workspaces, shared configs, Turbo pipeline, Husky hooks, and CI workflow'
    status: pending
  - id: phase2-schemas
    content: 'Phase 2: Define complete JSON schema with TypeScript types for meta, spec, impact, effort, risk, analysis, refinement, and detail files using Zod'
    status: pending
  - id: phase3-utilities
    content: 'Phase 3: Implement file operations & utilities (file-utils, path-utils, errors, git utilities)'
    status: pending
  - id: phase4-config
    content: 'Phase 4: Implement config management for .oxygen/config.json (spec registry, ID counter, branch patterns, agent provider settings) with atomic writes'
    status: pending
  - id: phase5-parsing
    content: 'Phase 5: Build JSON parser with schema validation and error reporting for specs and detail files'
    status: pending
  - id: phase6-cli-foundation
    content: 'Phase 6: Create CLI command structure with commander.js, output utilities, and prompt helpers'
    status: pending
  - id: phase7-linter
    content: 'Phase 7: Implement spec linter with extensible rule system (built-in + custom rules), category-based scoring (structural, technical, product, integration, consistency), and configuration support'
    status: pending
  - id: phase8-views
    content: 'Phase 8: Build built-in view generation system (full, execution, reference) with filtering logic and token estimation'
    status: pending
  - id: phase9-readonly-commands
    content: 'Phase 9: Implement read-only CLI commands (init, view, lint)'
    status: pending
  - id: phase10-analysis
    content: 'Phase 10: Build Impact × Effort × Risk calculation engine with ROI formulas and decision recommendations'
    status: pending
  - id: phase11-generate
    content: 'Phase 11: Implement spec generation command with interactive prompts and adapter support'
    status: pending
  - id: phase12-refinement
    content: 'Phase 12: Implement refinement loop with branch management, attempt tracking, auto-improvement agent, and convergence detection'
    status: pending
  - id: phase13-modification-commands
    content: 'Phase 13: Implement modification CLI commands (refine, review, approve, promote, analyze)'
    status: pending
  - id: phase14-roadmap
    content: 'Phase 14: Implement roadmap planning with portfolio optimization (ILP solver) and dependency resolution'
    status: pending
  - id: phase15-adapters
    content: 'Phase 15: Build actor-agnostic adapters for spec generation (Claude/OpenAI), implementation, and review workflows'
    status: pending
  - id: phase16-utility-commands
    content: 'Phase 16: Implement utility commands (list, search, stats)'
    status: pending
  - id: phase17-documentation
    content: 'Phase 17: Create documentation and examples'
    status: pending
---

# Oxygen Specification Management System - Complete Implementation Plan

## System Overview

Oxygen is an actor-agnostic specification management system enabling spec-driven development for human-only, agent-only, or hybrid teams. The core principle: **Great Spec + Simple Orchestration > Shitty Spec + Complex Orchestration**.

**Architecture:**

- PNPM monorepo with TypeScript (Node 22)
- Packages: `@oxygen/cli`, `@oxygen/core`, `@oxygen/prettier-config`, `@oxygen/eslint-config`
- Turbo for build orchestration
- Workspace structure: `.oxygen/` directory with `config.json`, `specs/`, `views/`, `roadmaps/` - **Note:** Detail sections (technical, product, integration) are within spec JSON files, not separate files in a `details/` directory

**Key Components:**

1.  **Spec Schema**: JSON format with meta, spec, impact, effort, risk, analysis, workspace, history, refinement

                                                                                                                                                                                                - **Note:** Detail sections (technical, product, integration) are within the spec JSON file, not separate files

2.  **Spec Structure**: Single JSON file containing all sections including technical details, product details, and integration details
3.  **CLI Tool**: TypeScript/Node.js with 10+ commands (generate, view, lint, refine, execute, roadmap, etc.)
4.  **Spec Linter**: Extensible rule system with scoring (0-100%), built-in + custom rules
5.  **View Generation**: Full (~15K tokens), Execution (~8K tokens), Reference (~2K tokens)
6.  **Refinement Loop**: Branch-based empirical validation with auto-improvement
7.  **Analysis Engine**: Impact × Effort × Risk calculation with ROI formulas
8.  **Roadmap Planning**: Portfolio optimization with ILP solver and dependency resolution

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

                                                                                                                                                                                                - Edit spec JSON file directly or via CLI prompts
                                                                                                                                                                                                - **User provides:** Impact scores (1-10) for business/user/technical/competitive value
                                                                                                                                                                                                                                                                                                                                - Can be provided at any time (during generate, after creation, before analyze)
                                                                                                                                                                                                                                                                                                                                - Can edit directly in JSON or use CLI prompts
                                                                                                                                                                                                - **User provides:** Risk scores (1-10) with technical risks, assumptions, rollback difficulty
                                                                                                                                                                                                                                                                                                                                - Can be provided at any time
                                                                                                                                                                                                                                                                                                                                - Can edit directly in JSON or use CLI prompts
                                                                                                                                                                                                - **System calculates:** Effort (auto-calculated when analysis runs)

4.  **`oxygen view <spec>`** - Review spec

                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                - Load spec file (details are sections within spec, not separate files)
                                                                                                                                                                                                - Generate filtered views (full/execution/reference)
                                                                                                                                                                                                - Output Markdown to stdout or file
                                                                                                                                                                                                - Show token count

5.  **`oxygen lint <spec>`** - Check completeness

                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                - Load spec file (details are sections within spec, not separate files)
                                                                                                                                                                                                - Run SpecLinter with all enabled rules
                                                                                                                                                                                                - Display formatted lint results
                                                                                                                                                                                                - Exit with appropriate code based on threshold
                                                                                                                                                                                                - Shows category scores and overall score

6.  **`oxygen analyze <spec>`** - Get analysis

                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                - Load spec file (details are sections within spec, not separate files)
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
                                                                                                                                                                                                - Create attempt branch (`oxygen/spec-{id}-{attempt}`) - auto-increment if exists
                                                                                                                                                                                                - Generate execution view (Markdown)
                                                                                                                                                                                                - **Print execution view** - Developer copies and pastes into their agent/engine
                                                                                                                                                                                                - **Wait for user input** - Prompt user to paste agent logs/questions/errors
                                                                                                                                                                                                - Capture questions/errors from user input (manual paste)
                                                                                                                                                                                                - Show real-time progress as user provides information
                                                                                                                                                                                                - Record attempt in spec refinement history
                                                                                                                                                                                                - Show final summary with "Refinement complete" message
                                                                                                                                                                                                - **Note:** No deep integration with agent APIs/CLIs in MVP. Manual copy/paste workflow.

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

- **Early stage:** `generate` → edit manually → `view` → `lint` → `analyze`
- **Refinement stage:** `refine` → `analyze` → `lint` → `review` (repeat as needed)
- **Approval stage:** `approve` → `promote`
- **Planning stage:** `roadmap optimize` (optional, for multiple specs)

## Implementation Phases

### Phase 1: Monorepo Infrastructure & Setup

**Files to create:**

- `README.md` - Root project README with philosophy, vision, and quick start (see detailed specification below)
- `CHANGELOG.md` - Changelog file (auto-generated from changesets)
- `pnpm-workspace.yaml` - Workspace configuration
- Root `package.json` - Turbo scripts, engines (Node >=22), packageManager (pnpm@9.0.0)
- `.nvmrc` - Node version 22
- `turbo.json` - Pipeline configuration
- `justfile` - Development commands
- `.gitignore` - Standard patterns + `.oxygen/views/`
- `.husky/pre-commit` - Pre-commit hook (lint-staged)
- `.husky/_/husky.sh` - Husky initialization script
- `.github/workflows/ci.yml` - CI pipeline
- `.changeset/` - Changeset configuration directory - `.changeset/config.json` - Changeset configuration - `.changeset/README.md` - Changeset usage instructions
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

**Root README.md (`README.md`):**

Comprehensive project README that explains the philosophy, vision, and quick start guide:

**Structure:**

1.  **Header & Tagline:**

    ```markdown
    # Oxygen

    > For when you're building something that actually matters.
    ```

2.  **Philosophy Section:**

                                                                                                                                                                                                - **The Triviality Spectrum** - Explain why specs matter for non-trivial problems
                                                                                                                                                                                                - **Edge-Seeking Principle** - Why Oxygen exists (not for Snake games, for competitive advantages)
                                                                                                                                                                                                - **Warren Buffett Analogy** - Positioning: "Build for edge, not for volume"
                                                                                                                                                                                                - **Core Principle:** "Great Spec + Simple Orchestration > Shitty Spec + Complex Orchestration"

3.  **What Oxygen Is:**

                                                                                                                                                                                                - Actor-agnostic specification management system
                                                                                                                                                                                                - Treats specs as first-class, versioned assets
                                                                                                                                                                                                - Enables zero-ambiguity implementations
                                                                                                                                                                                                - Works for human-only, agent-only, or hybrid teams

4.  **What Oxygen Is NOT:**

                                                                                                                                                                                                - NOT for trivial problems (Snake games, todo lists)
                                                                                                                                                                                                - NOT for simple features where specs are overhead
                                                                                                                                                                                                - NOT a replacement for good engineering judgment
                                                                                                                                                                                                - NOT a magic bullet - still requires domain expertise

5.  **Key Features:**

                                                                                                                                                                                                - Structured JSON schema with Zod validation
                                                                                                                                                                                                - Impact × Effort × Risk analysis with ROI calculations
                                                                                                                                                                                                - Refinement loops with empirical validation
                                                                                                                                                                                                - Strategic roadmap planning with portfolio optimization
                                                                                                                                                                                                - Built-in view generation (full, execution, reference)
                                                                                                                                                                                                - Extensible linting system with scoring (0-100%)

6.  **Quick Start:**

    ```bash
    # Install
    pnpm install

    # Initialize workspace
    oxygen init

    # Create your first spec
    oxygen generate my-feature

    # View, lint, and analyze
    oxygen view spec-001
    oxygen lint spec-001
    oxygen analyze spec-001
    ```

7.  **Documentation Links:**

                                                                                                                                                                                                - Link to `docs/README.md` for detailed documentation
                                                                                                                                                                                                - Link to CLI guide, spec format, architecture docs

8.  **Target Audience:**

                                                                                                                                                                                                - Teams building non-trivial solutions
                                                                                                                                                                                                - Edge-seekers who need complete specs
                                                                                                                                                                                                - Organizations where getting it right creates competitive advantage

**Philosophy Content (from Conversations/1.md):**

The README should include sections explaining:

- **Triviality Spectrum:** Trivial (0-10% spec needed) vs Non-trivial (95%+ spec required)
- **Edge Definition:** Competitive advantage that creates disproportionate returns
- **ROI of Specs:** How complete specs reduce cost by 79% at scale
- **Positioning:** "Don't use Oxygen to build Snake. Use Oxygen to build your competitive advantage."

**Example Content Structure:**

```markdown
# Oxygen

> For when you're building something that actually matters.

Oxygen is an actor-agnostic specification management system that treats specs as first-class, versioned assets, enabling zero-ambiguity implementations through structured schemas, impact/effort/risk analysis, refinement loops, and strategic roadmap planning.

## Why Oxygen Exists

Oxygen is built on a simple principle: **Great Spec + Simple Orchestration > Shitty Spec + Complex Orchestration**.

### The Triviality Spectrum

Not all problems need the same level of specification. The triviality spectrum helps you understand when Oxygen is valuable:

- **Trivial problems** (Snake game, todo list): Don't need Oxygen. Just prompt Claude.
- **Non-trivial problems** (novel algorithms, complex systems): Need complete specs. This is where Oxygen shines.

[Full triviality spectrum explanation from Conversations/1.md]

### The Edge-Seeking Principle

Oxygen exists for teams building non-trivial solutions where getting it right creates competitive advantage. We're not building Oxygen for Snake games. We're building Oxygen for competitive advantages.

[Full edge-seeking explanation from Conversations/1.md]

[Rest of README with features, quick start, etc.]
```

**Changelog & Changeset Setup:**

1. **Install Changesets:**
   ```bash
   pnpm add -D @changesets/cli
   ```

Add to root `package.json` scripts:

```json
{
  "scripts": {
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "changeset:release": "changeset publish"
  }
}
```

2.  **Changeset Configuration (`.changeset/config.json`):**

    ```json
    {
      "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
      "changelog": "@changesets/cli/changelog",
      "commit": false,
      "fixed": [],
      "linked": [],
      "access": "restricted",
      "baseBranch": "main",
      "updateInternalDependencies": "patch",
      "ignore": []
    }
    ```

3.  **Changelog Generation:**

                                                                                                                                                                                                - Changesets automatically generate `CHANGELOG.md` entries
                                                                                                                                                                                                - Format follows conventional commits style
                                                                                                                                                                                                - Each package can have its own changelog if needed

4.  **Version Management:**

                                                                                                                                                                                                - Semantic versioning (major.minor.patch)
                                                                                                                                                                                                - `pnpm changeset` - Create new changeset for changes
                                                                                                                                                                                                - `pnpm changeset:version` - Bump versions based on changesets
                                                                                                                                                                                                - `pnpm changeset:release` - Publish packages (when ready)

5.  **Changeset Workflow:**

    ```bash
    # Developer workflow:
    # 1. Make changes
    # 2. Create changeset
    pnpm changeset
    # Select affected packages, type (major/minor/patch), description
    # 3. Commit changes + .changeset/*.md file
    git add .
    git commit -m "feat: add new feature"

    # Release workflow:
    # 1. Version packages based on changesets
    pnpm changeset:version
    # 2. Update CHANGELOG.md automatically
    # 3. Commit version bumps
    # 4. Tag release
    git tag v1.0.0
    # 5. Publish (when ready)
    pnpm changeset:release
    ```

6.  **CHANGELOG.md Structure:**

Auto-generated format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.0] - 2024-01-01

### Added

- Initial release of Oxygen CLI
- Spec generation command
- View generation system

### Changed

- Updated config schema

### Fixed

- Fixed bug in spec parser
```

**Dependencies:** None (foundational)

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

2.  **Detail schemas (sections within spec, not separate files):**

                                                                                                                                                                                                - `technical-detail.ts` - TechnicalDetailSchema (apis, data_models, business_logic, performance)
                                                                                                                                                                                                - `product-detail.ts` - ProductDetailSchema (user_flows, copy, ui_components)
                                                                                                                                                                                                - `integration-detail.ts` - IntegrationDetailSchema (integrations, webhooks, rate_limits)
                                                                                                                                                                                                - **Note:** These are sections within the spec JSON file, not separate files. The spec file contains all details in one JSON structure.

3.  **Config schemas:**

                                                                                                                                                                                                - `config.ts` - OxygenConfigSchema (nextSpecId, spec registry, branch patterns, agent provider settings)
                                                                                                                                                                                                - `linter-config.ts` - Linter configuration schema (rules, thresholds, weights)

**Implementation:** Use Zod (^3.22.0) for schema validation and TypeScript type inference.

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Auto-increment if branch exists:** If branch `oxygen/spec-{id}-{attempt}` exists, automatically increment attempt number and try again
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

### Phase 4: Config & State Management

**Goal:** Manage `.oxygen/config.json` - read, write, spec registry, ID generation with Zod validation and atomic writes.

**Files to create:**

1.  **ConfigManager class (`packages/core/src/config/ConfigManager.ts`):**

                                                                                                                                                                                                - Full implementation with atomic writes and Zod validation
                                                                                                                                                                                                - `read(): OxygenConfig` - Read with validation, returns defaults if file doesn't exist
                                                                                                                                                                                                - `write(config: OxygenConfig): void` - Write atomically with validation
                                                                                                                                                                                                - `incrementSpecId(): number` - Get next ID and increment atomically
                                                                                                                                                                                                - `registerSpec(id, name, file): void` - Add to registry, throws if duplicate ID
                                                                                                                                                                                                - `findSpec(idOrName): SpecRegistryEntry?` - Find by ID or name
                                                                                                                                                                                                - `getAllSpecs(): SpecRegistryEntry[]` - Get all specs
                                                                                                                                                                                                - `setBranchPattern(pattern): void` - Update branch pattern
                                                                                                                                                                                                - `setAgentProvider(provider): void` - Update agent provider
                                                                                                                                                                                                - `initialize(): void` - Create default config
                                                                                                                                                                                                - `exists(): boolean` - Check if config exists

**Error Handling:**

- `ConfigError` class extends `OxygenError`
- Handles invalid JSON syntax, schema validation failures, file I/O errors, duplicate spec ID registration

**Atomic Write Pattern:**

- Write to `config.json.tmp`
- `fs.rename('config.json.tmp', 'config.json')` - atomic on Unix/Windows
- If write fails, clean up temp file

**Concurrency behavior:**

- Last write wins (acceptable for ID counter race conditions)
- No file corruption (atomic rename prevents partial writes)

### Phase 5: Parsing & Validation

**Files to create in `packages/core/src/parser/`:**

1.  **Spec parser:**

                                                                                                                                                                                                - `spec-parser.ts` - SpecParser class
                                                                                                                                                                                                                                                                                                                                - Load spec JSON files from `.oxygen/specs/`
                                                                                                                                                                                                                                                                                                                                - Parse and validate against SpecSchema using Zod
                                                                                                                                                                                                                                                                                                                                - Handle parsing errors with detailed messages

2.  **Detail parser:**

                                                                                                                                                                                                - `detail-parser.ts` - DetailParser class
                                                                                                                                                                                                                                                                                                                                - **Note:** Details are sections within the spec JSON file, not separate files
                                                                                                                                                                                                                                                                                                                                - Extract and validate technical/product/integration detail sections from parsed spec
                                                                                                                                                                                                                                                                                                                                - Parse and validate against respective schemas
                                                                                                                                                                                                                                                                                                                                - Used for view generation and linting

3.  **Validator:**

                                                                                                                                                                                                - `validator.ts` - Validation wrapper
                                                                                                                                                                                                                                                                                                                                - Schema validation error formatting
                                                                                                                                                                                                                                                                                                                                - Type-safe validation results

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

                                                                                                                                                                                                - Each command file (`packages/cli/src/commands/{command}.ts`) follows a standard pattern
                                                                                                                                                                                                - Uses `CommandContext` for options
                                                                                                                                                                                                - Uses `OutputManager` for output
                                                                                                                                                                                                - Wraps implementation in try-catch with proper error handling

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
                                                                                                                                                                                                                                                                                                                                - **Format:** Custom rules are JSON files (ESM format)
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

1.  **Structural Rules:**

                                                                                                                                                                                                - **`require-meta`**: Check if `spec.meta` exists and contains required fields (`id`, `version`, `status`, `created_at`). Fail if any required field is missing.
                                                                                                                                                                                                - **`require-spec-section`**: Check if `spec.spec` exists. Fail if missing.
                                                                                                                                                                                                - **`field-presence`**: Validate that all required fields in spec schema are present. Traverse spec object and check against schema requirements.
                                                                                                                                                                                                - **`non-empty-validation`**: For string fields, check `value.trim().length > 0`. For arrays, check `array.length > 0`. For objects, check `Object.keys(obj).length > 0`.

2.  **Technical Rules:**

                                                                                                                                                                                                - **`architecture-decisions`**: Check if `technical_detail.architecture_decisions` exists and is non-empty array. Each decision should have `decision`, `rationale`, `alternatives`.
                                                                                                                                                                                                - **`performance-requirements`**: Check if `technical_detail.performance` exists with required metrics (latency, throughput, etc.).
                                                                                                                                                                                                - **`error-handling`**: Check if `technical_detail.error_handling` exists with strategies for different error types.
                                                                                                                                                                                                - **`edge-cases`**: Check if `technical_detail.edge_cases` exists and documents known edge cases.

3.  **Product Rules:**

                                                                                                                                                                                                - **`user-flow-completeness`**: Check if `product_detail.user_flows` exists and each flow has start, steps, and end states defined.
                                                                                                                                                                                                - **`success-criteria-measurability`**: Check if `spec.spec.success_criteria` items are measurable (contain metrics, thresholds, or testable conditions).
                                                                                                                                                                                                - **`constraint-specifications`**: Check if `spec.spec.constraints` are well-specified (have rationale, impact, and mitigation if applicable).

4.  **Integration Rules:**

                                                                                                                                                                                                - **`contract-completeness`**: Check if `integration_detail.apis` exist and each API has method, path, request/response schemas defined.
                                                                                                                                                                                                - **`data-model-completeness`**: Check if `integration_detail.data_models` exist and each model has all required fields with types.
                                                                                                                                                                                                - **`error-scenarios`**: Check if `integration_detail.error_scenarios` exist and document common error cases.
                                                                                                                                                                                                - **`retry-strategies`**: Check if `integration_detail.retry_strategies` exist for external API calls.
                                                                                                                                                                                                - **`rate-limits`**: Check if `integration_detail.rate_limits` are documented for external services.

5.  **Consistency Rules:**

                                                                                                                                                                                                - **`constraint-conflicts`**: Compare constraints in `spec.spec.constraints` and detect logical conflicts (e.g., "must be fast" vs "must process all data synchronously").
                                                                                                                                                                                                - **`assumption-contradictions`**: Find contradictory assumptions in `spec.risk.assumptions`.
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

**Key libraries:**

- `tiktoken` (^1.0.0) - Token counting for Claude/OpenAI models

### Phase 9: Basic CLI Commands (Read-Only)

**Files to create in `packages/cli/src/commands/`:**

1.  **`init` command:**

                                                                                                                                                                                                - `init.ts` - Initialize Oxygen workspace
                                                                                                                                                                                                                                                                                                                                - **Syntax:** `oxygen init [options]`
                                                                                                                                                                                                                                                                                                                                - **Options:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `--force, -f` - Overwrite existing `.oxygen/` directory
                                                                                                                                                                                                                                                                                                                                - **Behavior:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Check for existing `.oxygen/` directory (prompt if exists, unless --force)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create directory structure (`.oxygen/specs/`, `.oxygen/views/`, `.oxygen/roadmaps/`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Note:** No `details/` directory - details are sections within spec JSON files
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load spec file (details are within spec, not separate files)
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

### Phase 10: Analysis Engine

**Calculation Philosophy:**

- **Impact (1-10): USER INPUT** - Not calculated automatically. Users provide impact scores during spec creation/editing based on business/user/technical/competitive value. Stored in `impact` section of spec JSON.
- **Effort ($): AUTO-CALCULATED** - Deterministically calculated from spec characteristics. Components include token cost (estimated from spec size using tiktoken). Actor time is not relevant for agents (they work quickly, cost is per token not per time).
- **Risk (1-10): USER INPUT (with future auto-detection)** - Currently user-provided during spec creation/editing. Future enhancement: `RiskAnalyzer` can automatically identify risks from spec content (not in MVP). Stored in `risk` section of spec JSON.
- **Analysis (ROI + Decision): CALCULATED** - Generated from Impact, Effort, and Risk inputs using ROI formulas.

**Files to create in `packages/core/src/analysis/`:**

1.  **Impact calculator:**

                                                                                                                                                                                                - `impact-calculator.ts` - ImpactCalculator class
                                                                                                                                                                                                                                                                                                                                - **Read impact from spec** (user-provided values)
                                                                                                                                                                                                                                                                                                                                - **Aggregate impact score** - Weighted average of components:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `Impact = (business_value × 0.4) + (user_value × 0.3) + (technical_value × 0.2) + (competitive_value × 0.1)`
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
                                                                                                                                                                                                                                                                                                                                - **Calculate expected value:** `Expected Value = (Impact × Probability_of_Success) - Effort`
                                                                                                                                                                                                                                                                                                                                - **Probability of Success calculation:** Based on risk score (higher risk = lower probability)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `Probability_of_Success = 1 - (risk_score / 10)`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Example: risk_score = 3 → probability = 0.7 (70%)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Example: risk_score = 8 → probability = 0.2 (20%)
                                                                                                                                                                                                                                                                                                                                - **ROI Formula:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `Expected_Value = (Impact × (1 - Risk/10)) - Effort`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Impact is 1-10 scale (normalized to value units)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Effort is in dollars ($)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Expected_Value is in value units (positive = good, negative = bad)
                                                                                                                                                                                                                                                                                                                                - **Decision recommendation:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Approve: Expected_Value > threshold (default: 5)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Defer: Expected_Value between 0 and threshold
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Reject: Expected_Value < 0

5.  **Analysis result:**

                                                                                                                                                                                                - `analysis-result.ts` - AnalysisResult interface
                                                                                                                                                                                                                                                                                                                                - Impact breakdown (aggregated score + component scores)
                                                                                                                                                                                                                                                                                                                                - Effort breakdown (token cost, total effort)
                                                                                                                                                                                                                                                                                                                                - Risk breakdown (risk score, risk factors)
                                                                                                                                                                                                                                                                                                                                - ROI calculation (expected value, probability of success)
                                                                                                                                                                                                                                                                                                                                - Decision recommendation with reasoning

**Key libraries:**

- `tiktoken` (^1.0.0) - Token counting for effort estimation

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
                                                                                                                                                                                                                                                                                                                                - Record attempt results (progress, questions, errors, costs)
                                                                                                                                                                                                                                                                                                                                - Integrate with KillCriteriaTracker for termination checks
                                                                                                                                                                                                                                                                                                                                - Integrate with CostController for budget enforcement

2.  **Attempt tracker:**

                                                                                                                                                                                                - `attempt-tracker.ts` - AttemptTracker class
                                                                                                                                                                                                                                                                                                                                - Progress percentage calculation
                                                                                                                                                                                                                                                                                                                                - Cost/time tracking per attempt
                                                                                                                                                                                                                                                                                                                                - Status updates (in_progress, completed, failed, terminated)
                                                                                                                                                                                                                                                                                                                                - Attempt history persistence
                                                                                                                                                                                                                                                                                                                                - **Progress calculation:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Percentage based on implementation completion (0-100%)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Measured by: features implemented, tests passing, questions resolved
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Progress formula: `(completed_items / total_items) * 100`
                                                                                                                                                                                                                                                                                                                                - **Cost tracking:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Track token usage per attempt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Track estimated cost per attempt (from adapter)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Cumulative cost across all attempts
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Cost breakdown: tokens, time, total

3.  **Kill criteria tracker:**

                                                                                                                                                                                                - `kill-criteria.ts` - KillCriteriaTracker class
                                                                                                                                                                                                                                                                                                                                - **Configuration (from spec or defaults):**

    ```typescript
    interface KillCriteria {
      maxAttempts: number; // Default: 10
      maxCost: number; // Default: $2000 (total across all attempts)
      minProgressPerAttempt: number; // Default: 10% (minimum improvement per attempt)
      convergenceThreshold: {
        maxStalledAttempts: number; // Default: 3
        minImprovement: number; // Default: 5% (minimum improvement per attempt)
      };
    }
    ```

                                                                                                                                                                                                                                                                                                                                - **Warning signals detection:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `attemptCostIncreasing()` - Check if each attempt costs more than previous
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `questionsNotDecreasing()` - Check if clarification questions aren't reducing
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `sameQuestionsRecurring()` - Detect if agent asks same questions repeatedly
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `progressStalling()` - Check if progress improvement < minProgressPerAttempt
                                                                                                                                                                                                                                                                                                                                - **Decision matrix:**

    ```typescript
    interface KillDecision {
      shouldTerminate: boolean;
      reason: 'max_attempts' | 'max_cost' | 'convergence_failed' | 'diverging' | 'none';
      recommendation: string;
      severity: 'error' | 'warning' | 'info';
    }
    ```

                                                                                                                                                                                                                                                                                                                                - **Evaluation logic:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Max attempts check:** If attempt number > maxAttempts → terminate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Max cost check:** If cumulative cost > maxCost → terminate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Progress check:** If current attempt progress improvement < minProgressPerAttempt → warning
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Convergence check:** If last N attempts show < convergenceThreshold.minImprovement → terminate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Divergence detection:** If cost increasing AND questions increasing → terminate
                                                                                                                                                                                                                                                                                                                                - **Methods:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `evaluate(attemptHistory: AttemptHistory[], currentAttempt: Attempt): KillDecision`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `shouldTerminate(decision: KillDecision): boolean`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `getRecommendation(decision: KillDecision): string`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `checkWarningSignals(attemptHistory: AttemptHistory[]): WarningSignal[]`

4.  **Cost controller:**

                                                                                                                                                                                                - `cost-controller.ts` - CostController class
                                                                                                                                                                                                                                                                                                                                - **Budget management:**

    ```typescript
    interface Budget {
      allocated: number; // Total budget allocated (in dollars)
      spent: number; // Amount spent so far
      remaining: number; // Remaining budget
      perAttemptLimit: number; // Max cost per single attempt (default: $100)
    }
    ```

                                                                                                                                                                                                                                                                                                                                - **Circuit breakers:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Single attempt breaker:** If single attempt cost > perAttemptLimit → PAUSE, require approval
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Budget breaker:** If spent >= allocated → STOP, cannot continue
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Cost increase warning:** If attempt cost > previous attempt cost by 20% → WARN
                                                                                                                                                                                                                                                                                                                                - **Approval gates:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **50% gate:** When spent >= 50% of budget → notify stakeholder (log warning)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **90% gate:** When spent >= 90% of budget → require explicit approval to continue
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **100% gate:** When spent >= 100% of budget → hard stop, cannot continue
                                                                                                                                                                                                                                                                                                                                - **Methods:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `checkBudget(cost: number, allocated: number): BudgetStatus`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `shouldPause(attemptCost: number, perAttemptLimit: number): boolean`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `shouldStop(spent: number, allocated: number): boolean`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `requiresApproval(spent: number, allocated: number): boolean`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `getBudgetStatus(): Budget`
                                                                                                                                                                                                                                                                                                                                - **Budget status types:**

    ```typescript
    type BudgetStatus =
      | 'ok' // Within budget, can continue
      | 'warning_50' // 50% spent, notify stakeholder
      | 'warning_90' // 90% spent, require approval
      | 'exceeded'; // Budget exceeded, hard stop
    ```

5.  **Auto-improvement agent:**

                                                                                                                                                                                                - **Note:** Auto-improvement agent is NOT implemented in MVP. This is a future roadmap item.
                                                                                                                                                                                                - Future: `auto-improver.ts` - AutoImprover class
                                                                                                                                                                                                                                                                                                                                - Analyze clarification questions to identify spec gaps
                                                                                                                                                                                                                                                                                                                                - Analyze errors to find missing details
                                                                                                                                                                                                                                                                                                                                - Propose specific spec additions/updates
                                                                                                                                                                                                                                                                                                                                - Update spec file with improvements

6.  **Convergence detection:**

                                                                                                                                                                                                - `convergence.ts` - ConvergenceDetector class
                                                                                                                                                                                                                                                                                                                                - **Success detection:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - One-shot success: progress = 100% AND questions = 0 AND errors = 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Mark spec as validated when one-shot success achieved
                                                                                                                                                                                                                                                                                                                                - **Diminishing returns detection:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Calculate progress improvement per attempt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - If last N attempts show < 5% improvement → convergence failed
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Formula: `improvement = current_progress - previous_progress`
                                                                                                                                                                                                                                                                                                                                - **Methods:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `hasConverged(attemptHistory: AttemptHistory[]): boolean`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `calculateImprovement(previous: Attempt, current: Attempt): number`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `detectDiminishingReturns(attemptHistory: AttemptHistory[], threshold: number): boolean`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `isOneShotSuccess(attempt: Attempt): boolean`

**Kill Criteria Implementation Details:**

**Integration with RefinementLoop:**

```typescript
class RefinementLoop {
  private killCriteria: KillCriteriaTracker;
  private costController: CostController;
  private attemptTracker: AttemptTracker;

  async refine(specId: string, budget?: number): Promise<RefinementResult> {
    // Load spec and attempt history
    const spec = await this.loadSpec(specId);
    const history = await this.attemptTracker.getHistory(specId);

    // Check kill criteria BEFORE starting new attempt
    const killDecision = this.killCriteria.evaluate(history, null);
    if (killDecision.shouldTerminate) {
      throw new RefinementTerminatedError(killDecision.reason, killDecision.recommendation);
    }

    // Check budget
    const currentCost = await this.costController.getTotalSpent(specId);
    if (budget && currentCost >= budget) {
      throw new BudgetExceededError(
        `Budget of $${budget} exceeded. Current spend: $${currentCost}`
      );
    }

    // Create new attempt
    const attempt = await this.createAttempt(specId);

    // Execute attempt (pseudo-code, actual implementation in refine command)
    // ... attempt execution ...

    // Track attempt results
    await this.attemptTracker.recordAttempt(specId, attempt);

    // Check kill criteria AFTER attempt
    const postKillDecision = this.killCriteria.evaluate([...history, attempt], attempt);

    // Check budget after attempt
    const newCost = await this.costController.getTotalSpent(specId);
    const budgetStatus = this.costController.checkBudget(newCost, budget || Infinity);

    // Handle warnings/approvals
    if (budgetStatus === 'warning_90') {
      // In interactive mode, prompt for approval
      const approved = await this.promptApproval(
        `90% of budget spent ($${newCost} of $${budget}). Continue?`
      );
      if (!approved) {
        throw new RefinementTerminatedError('budget_warning', 'User declined to continue');
      }
    }

    if (postKillDecision.shouldTerminate) {
      throw new RefinementTerminatedError(postKillDecision.reason, postKillDecision.recommendation);
    }

    return {
      success: attempt.progress === 100,
      attempt,
      killDecision: postKillDecision,
      budgetStatus,
    };
  }
}
```

**Kill Criteria Defaults:**

```typescript
const DEFAULT_KILL_CRITERIA: KillCriteria = {
  maxAttempts: 10,
  maxCost: 2000, // $2000 default
  minProgressPerAttempt: 10, // 10% minimum improvement
  convergenceThreshold: {
    maxStalledAttempts: 3, // 3 attempts with <5% improvement
    minImprovement: 5, // 5% minimum improvement per attempt
  },
};
```

**Warning Signals Detection:**

```typescript
interface WarningSignal {
  type: 'cost_increasing' | 'questions_stagnant' | 'same_questions' | 'progress_stalling';
  severity: 'warning' | 'error';
  message: string;
  recommendation: string;
}

class KillCriteriaTracker {
  checkWarningSignals(history: AttemptHistory[]): WarningSignal[] {
    const signals: WarningSignal[] = [];

    // Check if cost is increasing
    if (this.attemptCostIncreasing(history)) {
      signals.push({
        type: 'cost_increasing',
        severity: 'warning',
        message: 'Attempt costs are increasing, suggesting possible divergence',
        recommendation: 'Review spec complexity or consider breaking into smaller specs',
      });
    }

    // Check if questions aren't decreasing
    if (this.questionsNotDecreasing(history)) {
      signals.push({
        type: 'questions_stagnant',
        severity: 'warning',
        message: 'Clarification questions are not decreasing',
        recommendation: 'Spec may have fundamental gaps requiring domain expert review',
      });
    }

    // Check for recurring questions
    const recurring = this.sameQuestionsRecurring(history);
    if (recurring.length > 0) {
      signals.push({
        type: 'same_questions',
        severity: 'error',
        message: `Same questions asked in multiple attempts: ${recurring.join(', ')}`,
        recommendation: 'Update spec to address these recurring questions immediately',
      });
    }

    // Check for stalling progress
    if (this.progressStalling(history)) {
      signals.push({
        type: 'progress_stalling',
        severity: 'warning',
        message: 'Progress improvement is below minimum threshold',
        recommendation: 'Consider pausing refinement to reassess approach',
      });
    }

    return signals;
  }

  private attemptCostIncreasing(history: AttemptHistory[]): boolean {
    if (history.length < 2) return false;

    // Check if last 3 attempts show increasing cost
    const last3 = history.slice(-3);
    for (let i = 1; i < last3.length; i++) {
      if (last3[i].cost <= last3[i - 1].cost) {
        return false;
      }
    }
    return true;
  }

  private questionsNotDecreasing(history: AttemptHistory[]): boolean {
    if (history.length < 3) return false;

    // Check if question count is not decreasing over last 3 attempts
    const last3 = history.slice(-3);
    const questionCounts = last3.map((a) => a.questions?.length || 0);

    // If all counts are the same or increasing, questions aren't decreasing
    for (let i = 1; i < questionCounts.length; i++) {
      if (questionCounts[i] < questionCounts[i - 1]) {
        return false;
      }
    }
    return true;
  }

  private sameQuestionsRecurring(history: AttemptHistory[]): string[] {
    if (history.length < 2) return [];

    // Extract questions from last 2 attempts
    const recent = history.slice(-2);
    const questions1 = recent[0].questions || [];
    const questions2 = recent[1].questions || [];

    // Find questions that appear in both attempts (normalized for comparison)
    const recurring: string[] = [];
    for (const q1 of questions1) {
      const normalized = this.normalizeQuestion(q1);
      for (const q2 of questions2) {
        if (this.normalizeQuestion(q2) === normalized) {
          recurring.push(q1);
          break;
        }
      }
    }

    return recurring;
  }

  private progressStalling(history: AttemptHistory[]): boolean {
    if (history.length < 2) return false;

    const last2 = history.slice(-2);
    const improvement = last2[1].progress - last2[0].progress;

    return improvement < this.config.minProgressPerAttempt;
  }

  private normalizeQuestion(question: string): string {
    // Normalize for comparison (lowercase, remove punctuation, etc.)
    return question
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '');
  }
}
```

**Human Override Flow:**

```typescript
interface OverridePrompt {
  message: string;
  context: {
    spent: number;
    progress: number;
    attempts: number;
    reason: string;
  };
  options: ['continue', 'abort', 'increase_budget'];
}

class RefinementLoop {
  async promptOverride(decision: KillDecision, context: RefinementContext): Promise<boolean> {
    const prompt: OverridePrompt = {
      message: `Refinement may need to be terminated: ${decision.reason}`,
      context: {
        spent: context.totalCost,
        progress: context.currentProgress,
        attempts: context.attemptCount,
        reason: decision.reason,
      },
      options: ['continue', 'abort', 'increase_budget'],
    };

    // In interactive mode, show prompt
    // In non-interactive mode, throw error
    if (this.nonInteractive) {
      throw new RefinementTerminatedError(decision.reason, decision.recommendation);
    }

    const choice = await this.promptUser(prompt);

    if (choice === 'abort') {
      return false;
    }

    if (choice === 'increase_budget') {
      const newBudget = await this.promptBudget();
      context.budget = newBudget;
      return true;
    }

    // Continue despite warning
    return true;
  }
}
```

**Dependencies:** Phase 3 (file utilities, error handling), Phase 4 (config), Phase 5 (spec parsing), Phase 10 (cost tracking)

### Phase 13: Advanced CLI Commands (Modification)

**Files to create in `packages/cli/src/commands/`:**

1.  **`refine` command:**

                                                                                                                                                                                                - `refine.ts` - Refine spec through implementation attempt with kill criteria and cost control
                                                                                                                                                                                                                                                                                                                                - **Syntax:** `oxygen refine <spec> [options]`
                                                                                                                                                                                                                                                                                                                                - **Arguments:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `<spec>` - Spec ID or name (required)
                                                                                                                                                                                                                                                                                                                                - **Options:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `--attempt <number>` - Specific attempt number (auto-increments if not provided)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `--budget <amount>` - Maximum budget for refinement (in dollars, default: $2000)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `--max-attempts <number>` - Override max attempts (default: 10)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `--skip-kill-checks` - Skip kill criteria checks (use with caution)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `--output <file>` - Write execution view to file (default: stdout)
                                                                                - **Behavior (with kill criteria and cost control):**

                                                                                                                1. Load spec and validate it exists
                                                                                                                2. Load refinement history from spec
                                                                                                                3. **Check kill criteria BEFORE starting:**

                                                                                                                            - Check if max attempts exceeded
                                                                                                                            - Check if max cost exceeded (if budget specified)
                                                                                                                            - Check for warning signals from previous attempts
                                                                                                                            - If kill criteria met, show termination message and exit

                                                                                                                1. **Check budget BEFORE starting:**

                                                                                                                            - Calculate total spent so far
                                                                                                                            - Check if budget exceeded (if specified)
                                                                                                                            - Check approval gates (50% warning, 90% approval required)
                                                                                                                            - If budget exceeded, throw error
                                                                                                                            - If 90% threshold, prompt for approval (unless --non-interactive)

                                                                                                                1. Check if refinement already in progress (optional check)
                                                                                                                2. Reset working directory to clean state (git reset --hard)
                                                                                                                3. Create attempt branch (`oxygen/spec-{id}-{attempt}`) - auto-increment if branch exists
                                                                                                                4. Generate execution view (Markdown)
                                                                                                                5. **Print execution view to stdout or file** - Developer copies this and pastes into their agent/engine
                                                                                                                6. **Wait for user input:** Prompt user to paste agent logs/questions/errors after implementation attempt
                                                                                                                7. Capture questions and errors from user input (manual paste)
                                                                                                                8. **Calculate attempt cost:**

                                                                                                                                - Estimate token usage from execution view size
                                                                                                                                - Calculate cost based on provider pricing
                                                                                                                                - Track cost per attempt

                                                                                                                1. **Calculate progress:**

                                                                                                                                - Progress based on implementation completion (0-100%)
                                                                                                                                - Measured by: features implemented, questions resolved, errors fixed

                                                                                                                1. Record attempt in spec's refinement history (questions, errors, progress, cost)
                                                                                                                2. **Check kill criteria AFTER attempt:**

                                                                                                                            - Evaluate kill criteria with updated history
                                                                                                                            - Check for warning signals
                                                                                                                            - If termination criteria met, show termination message with recommendation

                                                                                                                1. **Check budget AFTER attempt:**

                                                                                                                            - Update total spent
                                                                                                                            - Check budget status (ok, warning_50, warning_90, exceeded)
                                                                                                                            - If exceeded, throw error
                                                                                                                            - If 90% threshold, prompt for approval (unless --non-interactive)

                                                                                                                1. **Check circuit breakers:**

                                                                                                                            - If single attempt cost > $100 → PAUSE, require approval
                                                                                                                            - If cost increasing → WARN about possible divergence

                                                                                                                1. Show warning signals (if any):

                                                                                                                            - Cost increasing warnings
                                                                                                                            - Questions not decreasing warnings
                                                                                                                            - Same questions recurring errors
                                                                                                                            - Progress stalling warnings

                                                                                                                1. Commit changes with standard message format
                                                                                                                2. Show final summary:

                                                                                                                            - Attempt number, progress percentage
                                                                                                                            - Questions count, errors count
                                                                                                                            - Cost this attempt, total cost
                                                                                                                            - Budget remaining (if specified)
                                                                                                                            - Kill criteria status
                                                                                                                            - Warning signals (if any)
                                                                                                                            - Refinement status (continue, pause, terminate)

                                                                                                                1. Display message:

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - If termination criteria met: "Refinement terminated: [reason]. Recommendation: [recommendation]"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - If warning signals: "Warnings detected: [signals]. Review and update spec if needed."
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - If successful: "Refinement complete. Review the spec and run 'oxygen refine' again if needed."

                                                                                                                                                                                                                                                                                                                                - **Kill Criteria Integration:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Before each attempt: Check max attempts, max cost, warning signals
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - After each attempt: Evaluate kill criteria, check for convergence
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Display kill criteria status in summary
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Throw `RefinementTerminatedError` if termination criteria met
                                                                                                                                                                                                                                                                                                                                - **Cost Control Integration:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Budget enforcement (stop if exceeded)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Circuit breakers (pause if single attempt > $100)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Approval gates (notify at 50%, require approval at 90%)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Cost tracking per attempt and cumulative
                                                                                                                                                                                                                                                                                                                                - **Output:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Execution view (Markdown) printed to stdout or file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Real-time questions/errors display as user provides input
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Budget status updates (if verbose)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Kill criteria status updates (if verbose)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Warning signals display
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Final summary at end (verbose) or JSON (--json)
                                                                                                                                                                                                                                                                                                                                - **Exit codes:**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `0` - Success (refinement complete or continuing)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `1` - Error (general error)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `4` - Spec not found
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `5` - Git error
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `6` - Refinement terminated (kill criteria met)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `7` - Budget exceeded

                                                                                                                                                                                                                                                                                                                                - **Example output:**

    ```
    Refining spec-001 (attempt 3/10)...

    Budget: $500 allocated, $287 spent, $213 remaining

    Executing implementation attempt...
    Progress: 65% → 72% (+7% improvement)
    Questions: 8 → 5 (3 resolved)
    Errors: 3 → 1 (2 fixed)
    Cost this attempt: $45

    Warning signals:
    - ⚠️ Cost increasing: Attempt costs are increasing (attempt 1: $40, attempt 2: $42, attempt 3: $45)

    Kill criteria status: OK (7 attempts remaining, $213 budget remaining)

    Refinement complete. Review the spec and run 'oxygen refine' again if needed.
    ```

                                                                                                                                                                                                                                                                                                                                - **Termination example output:**

    ```
    Refining spec-001 (attempt 11/10)...

    ❌ Refinement terminated: max_attempts

    Reason: Maximum attempts (10) exceeded
    Recommendation: Review spec with domain expert or break into smaller specs

    Summary:
    - Total attempts: 11
    - Total cost: $485
    - Final progress: 68%
    - Unresolved questions: 12
    - Remaining errors: 5

    Consider:
    - Breaking spec into smaller, more focused specs
    - Reviewing with domain expert to identify missing knowledge
    - Reassessing if this spec is achievable with current technology
    ```

                                                                                                                                                                                                                                                                                                                                - **Budget exceeded example output:**

    ```
    Refining spec-001 (attempt 6/10)...

    Budget: $500 allocated, $512 spent, $-12 remaining

    ❌ Budget exceeded: $500 budget exceeded. Current spend: $512

    Refinement cannot continue. Please increase budget or review spec scope.
    ```

2.  **`review` command:**

                                                                                                                                                                                                - `review.ts` - Load spec for review, capture review comments, record review in spec history

3.  **`approve` command:**

                                                                                                                                                                                                - `approve.ts` - Check linter threshold (must pass 95% for approval), update spec status to "approved", record approval in history

4.  **`promote` command:**

                                                                                                                                                                                                - `promote.ts` - Update spec status (roadmap → draft → approved → executed/finalized)
                                                                                                                                                                                                                                                                                                                                - **Status transitions:** Specs can transition in any direction (e.g., approved → draft is allowed)
                                                                                                                                                                                                                                                                                                                                - **No workflow enforcement:** No validation gates or workflow rules in MVP
                                                                                                                                                                                                                                                                                                                                - Update spec metadata
                                                                                                                                                                                                                                                                                                                                - **Future roadmap:** Customizable workflow rules for status transitions

**Note:** The `analyze` command is implemented in Phase 9 (Read-Only CLI Commands), not Phase 13.

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

2.  **Implementation adapter (NOT IMPLEMENTED - Future Roadmap):**

                                                                                                                                                                                                - **Note:** Deep integration with agent APIs/CLIs is NOT in MVP. This is a future roadmap item.
                                                                                                                                                                                                - MVP behavior: `refine` command simply prints the execution view. Developer manually copies it into their agent/engine.
                                                                                                                                                                                                - Future: `implementation/interface.ts` - ImplementationAdapter interface
                                                                                                                                                                                                - Future: `implementation/agent-adapter.ts` - AgentAdapter implementation
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

- Adapters are configured in `.oxygen/config.json` under `agentProvider`
- API keys are read from environment variables (never stored in config)
- Adapters validate configuration on initialization

### Phase 16: Utility Commands

**Files to create in `packages/cli/src/commands/`:**

1.  **`list` command:**

                                                                                                                                                                                                - `list.ts` - List all specs with status, ID, name, filter by status (--status=roadmap|draft|approved), display in formatted table

2.  **`search` command:**

                                                                                                                                                                                                - `search.ts` - Search specs by name, tags, content, display matching specs

3.  **`stats` command:**

                                                                                                                                                                                                - `stats.ts` - Portfolio-level metrics (spec count by status, average completeness, total value created)

### Phase 17: Documentation & Examples

**Note:** Root `README.md` is created in Phase 1 (see Phase 1 for detailed specification). Phase 17 focuses on technical documentation in `docs/` directory.

**Files to create in `docs/`:**

1.  **Documentation:**

                                                                                                                                                                                                - `README.md` - Documentation index and navigation
                                                                                                                                                                                                                                                                                                                                - Links to all documentation files
                                                                                                                                                                                                                                                                                                                                - Documentation structure overview
                                                                                                                                                                                                                                                                                                                                - How to contribute to documentation
                                                                                                                                                                                                - `ARCHITECTURE.md` - System architecture
                                                                                                                                                                                                                                                                                                                                - High-level system overview
                                                                                                                                                                                                                                                                                                                                - Component architecture
                                                                                                                                                                                                                                                                                                                                - Data flow diagrams
                                                                                                                                                                                                                                                                                                                                - Package structure
                                                                                                                                                                                                                                                                                                                                - Technology choices and rationale
                                                                                                                                                                                                - `CLI.md` - CLI usage guide
                                                                                                                                                                                                                                                                                                                                - Complete command reference
                                                                                                                                                                                                                                                                                                                                - Command syntax and options
                                                                                                                                                                                                                                                                                                                                - Usage examples for each command
                                                                                                                                                                                                                                                                                                                                - Exit codes and error handling
                                                                                                                                                                                                                                                                                                                                - Interactive vs non-interactive mode
                                                                                                                                                                                                - `SPEC_FORMAT.md` - Spec JSON format documentation
                                                                                                                                                                                                                                                                                                                                - Complete schema reference
                                                                                                                                                                                                                                                                                                                                - Field descriptions and types
                                                                                                                                                                                                                                                                                                                                - Validation rules
                                                                                                                                                                                                                                                                                                                                - Example spec structure
                                                                                                                                                                                                                                                                                                                                - Best practices for writing specs
                                                                                                                                                                                                - `REFINEMENT_LOOP.md` - Refinement loop process
                                                                                                                                                                                                                                                                                                                                - How refinement works
                                                                                                                                                                                                                                                                                                                                - Kill criteria and termination
                                                                                                                                                                                                                                                                                                                                - Cost control and budget management
                                                                                                                                                                                                                                                                                                                                - Branch management philosophy
                                                                                                                                                                                                                                                                                                                                - Convergence detection
                                                                                                                                                                                                                                                                                                                                - Warning signals and recommendations
                                                                                                                                                                                                - `ROADMAP_PLANNING.md` - Roadmap planning guide
                                                                                                                                                                                                                                                                                                                                - How roadmap planning works
                                                                                                                                                                                                                                                                                                                                - Portfolio optimization (ILP solver)
                                                                                                                                                                                                                                                                                                                                - Dependency resolution
                                                                                                                                                                                                                                                                                                                                - Progressive refinement tracking

2.  **Examples:**

                                                                                                                                                                                                - `EXAMPLES/notifications-example.oxygen.json` - Complete example spec JSON file with all sections (meta, spec, impact, effort, risk, analysis, workspace, history, refinement, technical_details, product_details, integration_details)
                                                                                                                                                                                                - `EXAMPLES/payment-example.oxygen.json` - Complete example spec JSON file
                                                                                                                                                                                                - `EXAMPLES/config.example.json` - Example `.oxygen/config.json` file with all fields
                                                                                                                                                                                                - `EXAMPLES/linter-config.example.json` - Example linter configuration file (`.oxygenrc.json`)

**Note:** All examples should be complete, valid JSON files that demonstrate the full structure of each file type.

**Documentation Quality Standards:**

- All documentation should be clear, comprehensive, and include examples
- Code examples should be tested and working
- Diagrams should use mermaid or similar format
- Links between documentation files for easy navigation
- Keep documentation in sync with implementation (update docs when code changes)

**Dependencies:** All previous phases (documentation reflects implemented features)

## Error Handling Strategy

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

These features are documented but not required for first pass. See `ROADMAP.md` for detailed future roadmap.

### Core Features (Future)

- **Auto-improvement agent** - Automatically analyze questions/errors and propose spec improvements
- **Implementation adapter deep integration** - Direct integration with agent APIs/CLIs (Claude, OpenAI, Cursor, Aider, etc.)
- **Custom view system** - Plugin-based custom view generation
- **Spec reuse detection & value tracking** - Track when specs are reused and measure value
- **Historical analysis & compounding metrics** - Analyze spec performance over time
- **Multi-spec workflows** - Manage dependencies and workflows across multiple specs
- **Customizable status transition workflows** - Define rules for spec status transitions (like Jira workflows)
- **Workspace detection improvements** - Better handling of nested workspaces and multiple `.oxygen/` directories

### Integration & Export

- **Export/import formats** - Spec Kit, Task Master, and other formats
- **MCP server interface** - Model Context Protocol server for agent integration
- **Web UI** - Browser-based interface for spec management
- **Integration with external tools** - Jira, Figma, GitHub, Linear, etc.

### Advanced Features

- **Advanced refinement strategies** - More sophisticated refinement algorithms
- **Risk auto-detection** - Automatically identify risks from spec content
- **ILP library integration** - Select and integrate Integer Linear Programming solver for roadmap optimization
- **Real-time collaboration** - Multi-user editing and collaboration features

---

## ROADMAP.md

**File to create:** `docs/ROADMAP.md`

This document outlines future enhancements and features not included in the MVP.

### Implementation Adapter Deep Integration

**Status:** Future Roadmap

Currently, the `refine` command simply prints the execution view for developers to manually copy into their agent/engine. Future enhancement would include:

- Direct API integration with agent providers (Claude API, OpenAI API, etc.)
- CLI integration with agent tools (Cursor, Aider, etc.)
- Automatic execution of implementation attempts
- Real-time progress tracking from agent execution
- Automatic capture of questions and errors
- Callback mechanisms for progress updates

**Benefits:**

- Seamless workflow without manual copy/paste
- Automatic tracking of implementation progress
- Better integration with existing agent workflows

### Auto-Improvement Agent

**Status:** Future Roadmap

Currently, users manually analyze questions/errors and update specs. Future enhancement would include:

- Automatic analysis of clarification questions to identify spec gaps
- Automatic analysis of errors to find missing details
- AI-powered proposal of specific spec additions/updates
- Automatic or suggested updates to spec files
- Integration with spec generation adapters (Claude, OpenAI)

**Benefits:**

- Faster refinement cycles
- More consistent spec improvements
- Reduced manual analysis work

### Multi-Spec Workflows

**Status:** Future Roadmap

Currently, specs are managed independently. Future enhancement would include:

- Dependency management between specs
- Workflow orchestration across multiple specs
- Batch operations on multiple specs
- Cross-spec impact analysis
- Dependency graph visualization

**Benefits:**

- Better management of complex projects
- Understanding of spec relationships
- Coordinated execution of related specs

### Customizable Status Transition Workflows

**Status:** Future Roadmap

Currently, specs can transition between any status without validation. Future enhancement would include:

- Configurable workflow rules (like Jira workflows)
- Validation gates at status transitions
- Required approvals for certain transitions
- Automatic status updates based on conditions
- Custom status types and transitions

**Benefits:**

- Better control over spec lifecycle
- Enforced quality gates
- Customizable to team needs

### Workspace Detection Improvements

**Status:** Future Roadmap

Currently, workspace detection looks for `.oxygen/` directory. Future enhancement would include:

- Better handling of nested workspaces
- Detection of multiple `.oxygen/` directories in path
- Workspace selection when multiple found
- Workspace-specific configuration
- Global vs local workspace settings

**Benefits:**

- Better support for monorepos
- Clearer workspace boundaries
- More flexible project structures

### Risk Auto-Detection

**Status:** Future Roadmap

Currently, users manually provide risk scores. Future enhancement would include:

- Automatic risk identification from spec content
- Technical complexity analysis
- Unvalidated assumption detection
- Rollback difficulty assessment
- Blast radius analysis
- Risk scoring algorithms

**Benefits:**

- More objective risk assessment
- Faster risk identification
- Consistent risk evaluation

### ILP Library Integration

**Status:** Future Roadmap

Currently, roadmap optimization mentions ILP solver but library is TBD. Future enhancement would include:

- Selection of ILP library (e.g., `javascript-lp-solver`, `glpk.js`, or custom)
- Integration with portfolio optimizer
- Performance optimization for large portfolios
- Constraint modeling improvements

**Benefits:**

- Better roadmap optimization
- Handles larger portfolios
- More accurate optimization results

### Additional Future Enhancements

- **Custom view system (plugin-based)** - Allow users to define custom view types
- **Spec reuse detection & value tracking** - Track when specs are reused and measure value
- **Historical analysis & compounding metrics** - Analyze spec performance over time
- **Export/import formats** - Spec Kit, Task Master, and other formats
- **MCP server interface** - Model Context Protocol server for agent integration
- **Web UI** - Browser-based interface for spec management
- **Integration with external tools** - Jira, Figma, GitHub, Linear, etc.
- **Advanced refinement strategies** - More sophisticated refinement algorithms
- **Real-time collaboration** - Multi-user editing and collaboration features
