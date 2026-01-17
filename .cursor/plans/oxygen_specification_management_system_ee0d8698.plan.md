---
name: Oxygen Specification Management System
overview: Build a comprehensive actor-agnostic specification management system that treats specs as first-class, versioned assets, enabling zero-ambiguity implementations through structured schemas, impact/effort/risk analysis, refinement loops, and strategic roadmap planning.
todos:
  - id: setup
    content: Initialize PNPM monorepo with packages (cli, core, prettier-config, eslint-config), configure workspaces and shared configs
    status: pending
  - id: schema
    content: Define complete JSON schema with TypeScript types for meta, spec, impact, effort, risk, analysis, refinement, and detail files
    status: pending
    dependencies:
      - setup
  - id: config
    content: Implement config management for .oxygen/config.json (spec registry, ID counter, branch patterns)
    status: pending
    dependencies:
      - setup
  - id: parser
    content: Build JSON parser with schema validation and error reporting
    status: pending
    dependencies:
      - schema
  - id: cli-structure
    content: Create CLI command structure (generate, view, lint, refine, execute, roadmap, etc.)
    status: pending
    dependencies:
      - config
  - id: linter
    content: Implement spec linter with extensible rule system (built-in + custom rules), category-based scoring (structural, technical, product, integration, consistency), and configuration support
    status: pending
    dependencies:
      - parser
  - id: views
    content: Build built-in view generation system (full, execution, reference) with filtering logic. Custom views are a roadmap item (not required for first pass).
    status: pending
    dependencies:
      - parser
  - id: refinement
    content: Implement refinement loop with branch management and auto-improvement agent integration
    status: pending
    dependencies:
      - views
      - git-utils
  - id: analysis
    content: Build Impact × Effort × Risk calculation engine with ROI formulas
    status: pending
    dependencies:
      - parser
  - id: roadmap
    content: Implement roadmap planning with portfolio optimization (ILP solver) and dependency resolution
    status: pending
    dependencies:
      - analysis
  - id: git-utils
    content: Create Git utilities for branch creation, cleanup, and status tracking
    status: pending
    dependencies:
      - config
  - id: adapters
    content: Build actor-agnostic adapters for spec generation, implementation, and review workflows
    status: pending
    dependencies:
      - cli-structure
---

# Oxygen: Actor-Agnostic Specification Management System

## Architecture Overview

Oxygen is an actor-agnostic system that enables spec-driven development regardless of actor composition (all-human, all-agent, or hybrid teams). The core principle: **Great Spec + Simple Orchestration > Shitty Spec + Complex Orchestration**.

## Core Components

### 1. Spec Schema & Format (`.oxygen.json`)

**Location:** `.oxygen/specs/*.oxygen.json` and `.oxygen/details/*/*.json`

Structured JSON schema with:

- `meta`: Versioning, status, project context
- `spec`: Objective, scope, success criteria, constraints, dependencies
- `impact`: Business/user/technical/competitive value (1-10 scale)
- `effort`: Token cost, spec creation, time, complexity breakdown
- `risk`: Technical risks, assumptions, rollback plans (1-10 scale)
- `analysis`: ROI calculation, decision recommendation
- `workspace`: Open questions, research, alternatives
- `history`: Version tracking, changes, reviews
- `refinement`: Attempt tracking, validation status, reuse metrics

Detail files (separated for zero-ambiguity):

- `technical.json`: APIs, data models, business logic, performance
- `product.json`: User flows, copy, UI components
- `integrations.json`: External service contracts, webhooks, rate limits

### 2. CLI Tool (TypeScript/Node.js)

**Location:** `packages/cli/src/` directory

Commands:

- `oxygen generate <name> [--roadmap Q3-2024]`: Actor-driven spec creation (creates .oxygen.json)
- `oxygen view <spec> --type=execution|reference|full`: Generate filtered views
- `oxygen lint <spec>`: Completeness scoring, gap detection
- `oxygen review <spec>`: Actor review workflow
- `oxygen approve <spec>`: Approval tracking
- `oxygen refine <spec>`: Refinement loop with auto-improvement
- `oxygen execute <spec>`: Implementation execution
- `oxygen roadmap init/view/optimize/status <quarter>`: Strategic planning
- `oxygen promote <spec> --from roadmap --to draft`: Status transitions
- `oxygen search/list/stats`: Discovery and portfolio metrics

### 3. Spec Linter

**Location:** `packages/core/src/linter/`

Extensible rule-based linting system with built-in rules and support for custom rules. Similar architecture to ESLint with enable/disable rules and configurable severity.

**Scoring System (0-100%)** with minimum thresholds:

- Roadmap spec: 45%
- Draft spec: 80%
- Approved spec: 95%

**Rule Categories:**

- **Structural**: Required sections (meta, spec, impact, effort, risk), field presence, non-empty validation
- **Technical**: Architecture decisions, performance requirements, error handling, state machines, edge cases
- **Product**: User flows, success criteria measurability, edge case definitions, constraint specifications
- **Integration**: API contracts, data models, error scenarios, retry strategies, rate limits
- **Consistency**: Constraint conflicts, assumption contradictions, dependency consistency, scope/criteria alignment

**Implementation Architecture:**

- **Rule Engine**: Custom rule system with `Rule` interface (`id`, `category`, `description`, `severity`, `run()` method)
- **Built-in Rules**: Pre-configured rules for common checks (can be enabled/disabled via config)
- **Custom Rules**: Support for loading custom rules from file paths or npm packages
- **Configuration**: `.oxygenrc.json` or `oxygen.config.js` for rule configuration, thresholds, and weights
- **Scoring**: Category-based scores (structural, technical, product, integration) with weighted overall score
- **Output**: Structured results with issues, paths, suggestions, and pass/fail status

**Key Libraries:**

- `zod` (^3.22.0): Schema validation and TypeScript type inference
- `ajv` (^8.12.0): Alternative JSON Schema validation (faster for large files)
- `globby` (^13.2.0): Loading custom rules from file paths
- `cosmiconfig` (^8.2.0): Configuration file loading (`.oxygenrc`, `oxygen.config.js`)

**Rule Configuration:**

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
    "overall": 0.7
  },
  "weights": {
    "structural": 0.2,
    "technical": 0.3,
    "product": 0.3,
    "integration": 0.2
  }
}
```

### 4. Refinement Loop System

**Location:** `packages/core/src/refinement/`

Branch-based empirical validation:

- Creates `oxygen/spec-{id}-{attempt}` branches
- Each attempt: execution → questions/errors → auto-improvement
- Fresh branch = automatic reset (no complex cleanup)
- Converges to one-shot capable spec

Auto-improvement agent analyzes failures and proposes specific spec additions.

### 5. Impact × Effort × Risk Analysis

**Location:** `packages/core/src/analysis/`

Decision framework:

- **Impact** (1-10): Business/user/technical/competitive value
- **Effort** ($): Token cost + actor time (89% is spec quality work)
- **Risk** (1-10): Technical risks, assumptions, rollback difficulty

Expected Value = (Impact × Probability_of_Success) - Effort

### 6. Roadmap Planning & Portfolio Optimization

**Location:** `packages/core/src/roadmap/`

Ahead-of-Time (AOT) planning:

- Low-completeness specs (45%) for strategic planning
- Progressive refinement over months
- Integer Linear Programming for portfolio optimization
- Capacity constraints, dependency resolution

### 7. Config & State Management

**Location:** `.oxygen/config.json`

Project configuration:

- Spec ID counter (`nextSpecId`)
- Spec registry (id, name, file mapping)
- Branch pattern configuration
- Agent provider settings (Claude/OpenAI/custom)

## View Generation System

### Built-in Views (Required for First Pass)

The view generation system supports three standardized built-in views:

1. **Full View** (~15K tokens):

- Complete spec for actor review/approval
- Includes all sections: meta, spec, impact, effort, risk, analysis, workspace, history
- Includes all detail files (technical, product, integrations)
- Purpose: Decision-making, approval, learning

2. **Execution View** (~8K tokens):

- Implementation-focused, removes business context
- Removes: `impact`, `effort`, `risk.unknown_unknowns`, `analysis`, `workspace`, `history`
- Keeps: `meta`, `spec`, `risk.technical_risks`, `risk.assumptions` (validated only)
- Keeps: ALL detail files (technical, product, integrations) - never compress implementation details
- Purpose: One-shot implementation with zero ambiguity

3. **Reference View** (~2K tokens):

- Integration surface for dependent specs
- Contains: objective (one-line), summary, scope, public APIs (contracts only), data models (shared fields only), events, dependencies, constraints, ownership
- Removes: Internal implementation details, decision rationale, risk/effort analysis
- Purpose: Understanding dependencies, integration points

**Key principle:** Never compress implementation details. Only filter audience-specific context.

### Custom Views (Roadmap Item)

**Status:** Not required for first pass

**Future capability:** Allow actors to define custom view filters via configuration files or programmatic API. This enables:

- Team-specific views (e.g., "security-review" view that only includes security-relevant sections)
- Tool-specific views (e.g., "jira-export" view formatted for Jira import)
- Domain-specific views (e.g., "api-only" view for API documentation)

**Implementation approach:**

- View filter configuration schema (JSON/YAML)
- Custom view generator plugin system
- View registry and caching

This is marked as a roadmap item because the three built-in views (full, execution, reference) cover the core use cases for MVP.

## Roadmap Items (Future Enhancements)

The following features are planned but not required for the first pass/MVP:

### 1. Custom Views

- Allow actors to define custom view filters via configuration
- Plugin system for custom view generators
- View registry and caching

### 2. Spec Reuse Detection & Value Tracking

- Automatic detection of similar specs
- Metrics on spec reuse and value generation
- Recommendations for spec consolidation

### 3. Historical Analysis & Compounding Metrics

- Long-term ROI tracking
- Spec value appreciation over time
- Portfolio-level analytics dashboard

### 4. Export/Import Formats

- Spec Kit format interoperability
- Task Master format export
- Import from other spec management tools

### 5. MCP Server Interface

- Oxygen as Model Context Protocol server
- Enable any MCP client to use Oxygen specs
- Standard protocol for spec integration

### 6. Web UI

- Browser-based spec review interface (PR-style)
- Visual spec editor
- Team collaboration features

### 7. Advanced Portfolio Analytics

- Multi-quarter planning
- Historical trend analysis
- Predictive capacity planning

### 8. Spec Templates & Patterns

- Reusable spec templates for common patterns
- Pattern library for recurring feature types
- Template marketplace

### 9. Integration with External Tools

- Jira/Linear ticket linking
- Figma design spec linking
- GitHub PR integration

### 10. Advanced Refinement Strategies

- Multi-agent refinement (parallel attempts)
- Refinement prediction (estimate attempts needed)
- Auto-refinement suggestions

## File Structure (Detailed)

**Monorepo Structure:**

```
oxygen/
├── pnpm-workspace.yaml            # PNPM workspace configuration
├── package.json                    # Root package.json with workspace scripts
├── turbo.json                      # Turbo repo configuration
├── justfile                        # Development commands (justfile)
├── prettier.config.js              # Root prettier config (references package)
├── .eslintrc.json                  # Root eslint config (references package)
├── .nvmrc                          # Node version (20)
├── .gitignore                      # Git ignore patterns
├── README.md
├── docs/                           # Documentation
│   ├── README.md                   # Documentation index
│   ├── ARCHITECTURE.md             # System architecture
│   ├── CLI.md                      # CLI usage guide
│   ├── SPEC_FORMAT.md              # Spec JSON format documentation
│   ├── REFINEMENT_LOOP.md          # Refinement loop process
│   ├── ROADMAP_PLANNING.md         # Roadmap planning guide
│   └── EXAMPLES/                   # Example specs
│       ├── notifications-example.md
│       └── payment-example.md
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI workflow
├── .husky/                         # Git hooks
│   ├── _/
│   │   └── husky.sh                # Husky initialization script
│   └── pre-commit                  # Pre-commit hook
├── packages/
│   ├── cli/                        # @oxygen/cli package
│   ├── core/                       # @oxygen/core package
│   ├── prettier-config/            # @oxygen/prettier-config package
│   ├── eslint-config/              # @oxygen/eslint-config package
│   ├── tsconfig.base.json          # Shared TypeScript base config
│   └── tsup.config.base.ts         # Shared tsup base config (if needed)
└── .oxygen/                        # Project workspace (created by `oxygen init`)
    ├── config.json                  # Project config, spec registry
    ├── specs/                       # Main spec files
    ├── details/                     # Detail files (technical/product/integrations)
    ├── views/                       # Generated views (gitignored)
    └── roadmaps/                    # Roadmap artifacts
```

## Monorepo Structure

### Overview

Oxygen uses a PNPM workspace monorepo structure, similar to lucid-agents, with packages for:

- `@oxygen/cli`: CLI tool package
- `@oxygen/core`: Core logic (parsing, validation, analysis, views, refinement)
- `@oxygen/prettier-config`: Shared Prettier configuration
- `@oxygen/eslint-config`: Shared ESLint configuration

### Root Configuration

**`pnpm-workspace.yaml`:**

```yaml
packages:
  - packages/*
```

**`package.json` (root):**

```json
{
  "name": "oxygen",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "prepare": "husky install",
    "build": "turbo build",
    "lint": "turbo lint:check",
    "lint:fix": "turbo lint:write",
    "format": "turbo format:check",
    "format:fix": "turbo format:write",
    "type-check": "turbo type-check",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@oxygen/eslint-config": "workspace:*",
    "@oxygen/prettier-config": "workspace:*",
    "@types/node": "^20.10.0",
    "eslint": "^8.55.0",
    "husky": "^9.1.7",
    "prettier": "^3.1.0",
    "turbo": "^1.13.0",
    "typescript": "^5.3.0"
  }
}
```

**`.nvmrc`:**

```
22
```

**`turbo.json`:**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "lint:check": {
      "cache": false
    },
    "lint:write": {
      "cache": false
    },
    "format:check": {
      "cache": false
    },
    "format:write": {
      "cache": false
    },
    "type-check": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

**`.gitignore`:**

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/
out/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Local env files
.env
.env.local
.env.*.local

# Turbo
.turbo

# Cache
.cache/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.cursor/
AGENTS.md

# Oxygen workspace
.oxygen/views/
```

## Implementation Details

### Tech Stack & Dependencies

**Core Dependencies:**

- `commander` (^11.0.0): CLI framework with subcommands, options, help text
- `zod` (^3.22.0): Runtime type validation, schema generation from TypeScript types, spec linter rule validation
- `ajv` (^8.12.0): JSON Schema validation (faster than zod for large JSON files, optional alternative)
- `simple-git` (^3.19.0): Git operations (branch creation, commits, status)
- `inquirer` (^9.2.0): Interactive prompts for spec generation workflow
- `chalk` (^4.1.2): Terminal colors for CLI output
- `ora` (^5.4.1): Spinners for async operations
- `glob` (^10.3.0): File pattern matching for spec discovery
- `globby` (^13.2.0): Loading custom linter rules from file paths (used in spec linter)
- `cosmiconfig` (^8.2.0): Configuration file loading for linter rules (`.oxygenrc`, `oxygen.config.js`)

**Dev Dependencies:**

- `typescript` (^5.3.0): Type system
- `@types/node` (^20.10.0): Node.js type definitions
- `tsx` (^4.7.0): TypeScript execution (development)
- `prettier` (^3.1.0): Code formatting
- `eslint` (^8.55.0): Linting
- `turbo` (^1.13.0): Monorepo build system
- `husky` (^9.1.7): Git hooks

## Implementation Phases (Logical Dependency Order)

### Phase 1: Monorepo Infrastructure & Setup

**Goal:** Establish foundation - monorepo structure, build tooling, shared configs

**Tasks:**

1.  **Monorepo structure:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `pnpm-workspace.yaml` with `packages: ["packages/*"]`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create root `package.json` with turbo scripts, engines (Node >=22), packageManager (pnpm@9.0.0)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `.nvmrc` with Node version (22)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `turbo.json` with pipeline configuration
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `justfile` with development commands
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `.gitignore` with standard patterns + Oxygen-specific (`.oxygen/views/`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Set up Husky with pre-commit hook (lint, type-check, format-check)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `.github/workflows/ci.yml` with CI pipeline
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `docs/` folder structure

2.  **Shared config packages:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `packages/prettier-config/` with prettier config (from lucid-agents pattern)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `packages/eslint-config/` with eslint config (from lucid-agents pattern)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `packages/tsconfig.base.json` for shared TypeScript config

3.  **Package structure:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `packages/cli/` package directory structure
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `packages/core/` package directory structure
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Initialize `package.json` files for each package
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Set up `tsup.config.ts` for both packages
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Configure TypeScript (extending base configs)

**Dependencies:** None (foundational)

**Deliverables:** Working monorepo with packages that can build and run tests

---

### Phase 2: Core Schemas & Type Definitions

**Goal:** Define all data structures - spec schemas, detail schemas, config schemas

**Tasks:**

1.  **Spec schema definitions:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create `packages/core/src/schema/` directory
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `MetaSchema` (id, version, status, timestamps, etc.)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `SpecContentSchema` (objective, scope, success_criteria, constraints, dependencies)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `ImpactSchema` (score, business_value, user_value, technical_value, competitive_value)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `EffortSchema` (breakdown, total, development_cost, time_cost, complexity)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `RiskSchema` (technical_risks, assumptions, rollback, blast_radius)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `AnalysisSchema` (roi, decision)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `WorkspaceSchema` (open_questions, research, alternatives)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `HistorySchema` (version tracking, changes, reviews)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `RefinementSchema` (attempts, validation status, reuse metrics)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define complete `SpecSchema` combining all above

2.  **Detail schemas:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `TechnicalDetailSchema` (apis, data_models, business_logic, performance)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `ProductDetailSchema` (user_flows, copy, ui_components)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `IntegrationDetailSchema` (integrations, webhooks, rate_limits)

3.  **Config schemas:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `OxygenConfigSchema` (project config, spec registry, git patterns, adapters)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define linter configuration schema (rules, thresholds, weights)

**Dependencies:** Phase 1 (packages must exist)

**Deliverables:** Complete TypeScript types and Zod schemas for all data structures

---

### Phase 3: File Operations & Utilities

**Goal:** Core utilities needed before parsing - file I/O, path resolution, error handling

**Tasks:**

1.  **File utilities:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement file reading/writing utilities (`packages/core/src/utils/file-utils.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement path resolution utilities (`packages/core/src/utils/path-utils.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement directory creation utilities

2.  **Error handling:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define error types (`ConfigError`, `SpecNotFoundError`, `ValidationError`, `GitError`, `LinterError`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `OxygenError` base class (`packages/core/src/utils/errors.ts`)

3.  **Git utilities:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `GitManager` class (`packages/core/src/utils/git.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Branch creation/deletion
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Branch existence checking
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Current branch detection
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Commit operations

**Dependencies:** Phase 2 (types exist for config/specs)

**Deliverables:** Working file operations and git utilities

---

### Phase 4: Config & State Management

**Goal:** Manage `.oxygen/config.json` - read, write, spec registry, ID generation

**Tasks:**

1.  **Config manager:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `ConfigManager` class (`packages/core/src/config/manager.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load/save config.json with validation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Get next spec ID (increment counter)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Register spec in registry
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Find spec by ID or name

2.  **Initialization:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `init` logic for creating `.oxygen/` directory structure
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create default `config.json` with initial values

**Dependencies:** Phase 3 (file utilities, error handling)

**Deliverables:** Working config management - can initialize workspace and manage spec registry

---

### Phase 5: Parsing & Validation

**Goal:** Load and validate spec files and detail files

**Tasks:**

1.  **Spec parser:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `SpecParser` class (`packages/core/src/parser/spec-parser.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load spec JSON files
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Parse and validate against `SpecSchema` using Zod
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Handle parsing errors with detailed messages

2.  **Detail parser:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `DetailParser` class (`packages/core/src/parser/detail-parser.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load technical/product/integration detail files
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Parse and validate against respective schemas

3.  **Validator:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement validation wrapper (`packages/core/src/parser/validator.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Schema validation error formatting
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Type-safe validation results

**Dependencies:** Phase 4 (can find spec files via config), Phase 2 (schemas exist)

**Deliverables:** Can load and validate any spec file

---

### Phase 6: CLI Foundation

**Goal:** Basic CLI structure - command framework, entry point, no commands yet

**Tasks:**

1.  **CLI structure:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Set up commander.js in `packages/cli/src/index.ts`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create command framework structure
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement basic help/version commands
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Set up error handling for CLI

2.  **CLI utilities:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement output formatting helpers (`packages/cli/src/utils/output.ts` using chalk/ora)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement prompt helpers (`packages/cli/src/utils/prompts.ts` using inquirer)

**Dependencies:** Phase 5 (can reference core functionality)

**Deliverables:** CLI executable that shows help/version, ready for commands

---

### Phase 7: Basic CLI Commands (Read-Only)

**Goal:** Commands that read specs - init, view, lint (no spec modification yet)

**Tasks:**

1.  **`oxygen init` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Check for existing `.oxygen/` directory
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create directory structure
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Initialize default `config.json`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Add `.oxygen/views/` to `.gitignore`

2.  **`oxygen view` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load spec and detail files
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement view generator (full, execution, reference filters)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Output filtered JSON to stdout or file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Show token count

3.  **`oxygen lint` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load spec and detail files
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement basic linting (call linter from Phase 8)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Format and display lint results
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Exit with appropriate code based on threshold

**Dependencies:** Phase 6 (CLI framework), Phase 5 (parsing), Phase 4 (config), Phase 8 (linter)

**Deliverables:** Can initialize workspace and view/lint existing specs

---

### Phase 8: Spec Linter

**Goal:** Extensible rule-based linting system with built-in and custom rules

**Tasks:**

1.  **Rule engine architecture:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define `Rule` interface (`id`, `category`, `description`, `severity`, `run()` method)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `SpecLinter` class (`packages/core/src/linter/linter.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Rule execution engine
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Result aggregation and scoring

2.  **Built-in rules:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Structural rules (require-meta, require-spec-section, etc.)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Technical rules (api-completeness, error-handling-coverage, etc.)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Product rules (user-flow-completeness, success-criteria-measurability, etc.)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Integration rules (contract-completeness, rate-limit-specification, etc.)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Consistency rules (constraint-conflicts, assumption-contradictions, etc.)

3.  **Custom rule system:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Custom rule loader (`packages/core/src/linter/custom-rule-loader.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load rules from file paths (globby)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load rules from npm packages
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Rule validation

4.  **Configuration system:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Linter config loader (cosmiconfig - `.oxygenrc.json`, `oxygen.config.js`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Rule enable/disable configuration
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Severity configuration
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Threshold and weight configuration

5.  **Scoring system:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Category-based scoring (structural, technical, product, integration, consistency)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Weighted overall score calculation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Threshold checking per spec status

6.  **Reporting:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Issue reporting with paths, severity, suggestions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Formatted output (`packages/core/src/linter/reporter.ts`)

**Dependencies:** Phase 5 (can parse specs to lint)

**Deliverables:** Complete linter with built-in rules and custom rule support

---

### Phase 8: Basic CLI Commands (Read-Only)

**Goal:** Commands that read specs - init, view, lint (no spec modification yet)

**Tasks:**

1.  **`oxygen init` command:**

                                                                                                                                                                                                - Check for existing `.oxygen/` directory
                                                                                                                                                                                                - Create directory structure
                                                                                                                                                                                                - Initialize default `config.json`
                                                                                                                                                                                                - Add `.oxygen/views/` to `.gitignore`

2.  **`oxygen view` command:**

                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                - Load spec and detail files
                                                                                                                                                                                                - Call view generator (will be implemented in Phase 11, but command structure here)
                                                                                                                                                                                                - Output filtered JSON to stdout or file
                                                                                                                                                                                                - Show token count

3.  **`oxygen lint` command:**

                                                                                                                                                                                                - Resolve spec by name/ID
                                                                                                                                                                                                - Load spec and detail files
                                                                                                                                                                                                - Call linter (from Phase 7)
                                                                                                                                                                                                - Format and display lint results
                                                                                                                                                                                                - Exit with appropriate code based on threshold

**Dependencies:** Phase 6 (CLI framework), Phase 5 (parsing), Phase 4 (config), Phase 7 (linter)

**Deliverables:** Can initialize workspace and view/lint existing specs

---

### Phase 9: Analysis Engine (Impact/Effort/Risk)

**Goal:** Calculate impact, effort, risk scores and ROI

**Tasks:**

1.  **Impact calculator:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `ImpactCalculator` class (`packages/core/src/analysis/impact-calculator.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Aggregate business/user/technical/competitive value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Calculate impact score (1-10)

2.  **Effort estimator:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `EffortEstimator` class (`packages/core/src/analysis/effort-estimator.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Calculate token cost (estimate from spec size)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Estimate actor time based on complexity
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Calculate total effort

3.  **Risk analyzer:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `RiskAnalyzer` class (`packages/core/src/analysis/risk-analyzer.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Assess technical risks
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Validate assumptions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Evaluate rollback difficulty
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Calculate risk score (1-10)

4.  **ROI calculator:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `ROICalculator` class (`packages/core/src/analysis/roi-calculator.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Calculate expected value: (Impact × Probability_of_Success) - Effort
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Generate decision recommendations (approve/defer/reject)

**Dependencies:** Phase 5 (can parse specs to analyze)

**Deliverables:** Can calculate impact, effort, risk, and ROI for any spec

---

### Phase 10: View Generation System

**Goal:** Generate filtered views (full, execution, reference)

**Tasks:**

1.  **View generator:**

                                                - Implement `ViewGenerator` class (`packages/core/src/views/generator.ts`)
                                                - Full view (all sections, all details)
                                                - Execution view (filters business context, keeps implementation details)
                                                - Reference view (extracts integration surface only)
                                                - Token estimation

2.  **View filters:**

                                                - Implement filter logic (`packages/core/src/views/filters.ts`)
                                                - Section filtering
                                                - Field filtering within sections
                                                - Detail file inclusion/exclusion

3.  **View caching (optional):**

                                                - Cache generated views in `.oxygen/views/`
                                                - Cache invalidation on spec update

**Dependencies:** Phase 5 (can parse specs)

**Deliverables:** Can generate all three view types for any spec

---

### Phase 11: Spec Generation Command

**Goal:** Create new specs interactively or programmatically

**Tasks:**

1.  **`oxygen generate` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Interactive prompts (objective, systems, status, etc.)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Generate initial spec structure with next available ID
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Call spec generation adapter (optional AI assistance)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Validate generated spec
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Save to `.oxygen/specs/`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Update config registry
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Auto-run lint and show score

2.  **Spec generation adapter (basic):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Define adapter interface (`packages/core/src/adapters/spec-generation/interface.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement no-op adapter (manual entry only)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - CLI integration for choosing adapter

**Dependencies:** Phase 7 (CLI framework, init command exists), Phase 4 (config management), Phase 5 (validation), Phase 8 (linter)

**Deliverables:** Can generate new specs interactively

---

### Phase 11: View Generation System

**Goal:** Generate filtered views (full, execution, reference)

**Tasks:**

1.  **View generator:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `ViewGenerator` class (`packages/core/src/views/generator.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Full view (all sections, all details)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Execution view (filters business context, keeps implementation details)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Reference view (extracts integration surface only)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Token estimation

2.  **View filters:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement filter logic (`packages/core/src/views/filters.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Section filtering
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Field filtering within sections
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Detail file inclusion/exclusion

3.  **View caching (optional):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Cache generated views in `.oxygen/views/`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Cache invalidation on spec update

**Dependencies:** Phase 5 (can parse specs)

**Deliverables:** Can generate all three view types for any spec

---

### Phase 12: Refinement Loop System

**Goal:** Empirical validation through execution attempts with auto-improvement

**Tasks:**

1.  **Refinement orchestrator:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `RefinementLoop` class (`packages/core/src/refinement/loop.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Track refinement attempts in spec
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create attempt branches (`oxygen/spec-{id}-{attempt}`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Record attempt results (progress, questions, errors)

2.  **Attempt tracker:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement attempt metadata tracking (`packages/core/src/refinement/attempt-tracker.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Progress percentage calculation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Cost/time tracking
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Status updates

3.  **Auto-improvement agent:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `AutoImprover` class (`packages/core/src/refinement/auto-improver.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Analyze clarification questions to identify spec gaps
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Analyze errors to find missing details
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Propose specific spec additions/updates
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Update spec file with improvements

4.  **Convergence detection:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Detect one-shot success (100% progress, 0 questions)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Detect diminishing returns (< 5% improvement)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Mark spec as validated when criteria met

**Dependencies:** Phase 10 (views needed for execution), Phase 3 (git utilities for branches), Phase 5 (can update spec files)

**Deliverables:** Can run refinement loop on specs to improve them iteratively

---

### Phase 13: Advanced CLI Commands (Modification)

**Goal:** Commands that modify specs - refine, review, approve, promote

**Tasks:**

1.  **`oxygen refine` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Check if refinement in progress
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Create attempt branch
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Generate execution view
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Call implementation adapter (execute attempt)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Capture questions/errors
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Call auto-improvement agent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Update spec with improvements
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Record attempt in spec

2.  **`oxygen review` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Load spec for review
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Capture review comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Record review in spec history

3.  **`oxygen approve` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Check linter threshold (must pass 95% for approval)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Update spec status to "approved"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Record approval in history

4.  **`oxygen promote` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Update spec status (roadmap → draft → approved)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Validate transition is allowed
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Update spec metadata

**Dependencies:** Phase 12 (refinement loop), Phase 8 (linter for approval checks), Phase 5 (can update specs)

**Deliverables:** Can refine, review, approve, and promote specs

---

### Phase 14: Roadmap Planning

**Goal:** Strategic planning with portfolio optimization

**Tasks:**

1.  **Roadmap data structures:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Roadmap file format (`.oxygen/roadmaps/Q3-2024.json`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Status transitions (roadmap → draft → approved)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Dependency tracking

2.  **Portfolio optimizer:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `PortfolioOptimizer` class (`packages/core/src/roadmap/optimizer.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Integer Linear Programming solver (ILP library)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Objective: Maximize total impact
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Constraints: budget, dependencies, capacity

3.  **Dependency resolver:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `DependencyResolver` class (`packages/core/src/roadmap/dependency-resolver.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Build dependency graph
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Resolve dependency conflicts
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Generate timeline

4.  **Roadmap commands:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `oxygen roadmap init <quarter>` - Create roadmap file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `oxygen roadmap optimize <quarter> --capacity <$>` - Optimize portfolio
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `oxygen roadmap status <quarter>` - Show roadmap status
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `oxygen roadmap view <quarter>` - Display roadmap

**Dependencies:** Phase 9 (analysis engine for impact/effort/risk), Phase 5 (can load multiple specs)

**Deliverables:** Can create and optimize roadmaps

---

### Phase 15: Actor Adapters

**Goal:** Integrate with AI agents for spec generation and implementation

**Tasks:**

1.  **Spec generation adapters:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `ClaudeAdapter` (`packages/core/src/adapters/spec-generation/claude-adapter.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `OpenAAdapter` (`packages/core/src/adapters/spec-generation/openai-adapter.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Adapter configuration in config.json
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - API key management (environment variables)

2.  **Implementation adapter:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Implement `AgentAdapter` (`packages/core/src/adapters/implementation/agent-adapter.ts`)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Execute implementation using execution view
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Capture questions and errors
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Track progress

3.  **Review adapter (optional):**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Actor-agnostic review workflow
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Support for automated review checks

**Dependencies:** Phase 10 (spec generation command), Phase 12 (refinement loop needs implementation adapter)

**Deliverables:** Can use AI agents for spec generation and implementation

---

### Phase 16: Utility Commands

**Goal:** Discovery, search, and portfolio metrics

**Tasks:**

1.  **`oxygen list` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - List all specs with status, ID, name
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Filter by status (--status=roadmap|draft|approved)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Display in formatted table

2.  **`oxygen search` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Search specs by name, tags, content
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Display matching specs

3.  **`oxygen stats` command:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Portfolio-level metrics
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Spec count by status
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Average completeness
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Total value created

**Dependencies:** Phase 4 (config registry), Phase 5 (can load specs)

**Deliverables:** Can discover and search specs, view portfolio statistics

---

### Phase 17: Advanced Features (Roadmap Items)

**Goal:** Features for future releases

**Tasks:**

- Spec reuse detection and value tracking
- Historical analysis and compounding metrics
- Portfolio analytics dashboard
- Export/import (Spec Kit, Task Master formats)
- Custom view system
- Web UI
- MCP server interface
- Integration with external tools (Jira, Figma, GitHub)

**Dependencies:** All previous phases

**Deliverables:** Advanced features for power users

## Key Design Principles

1. **Actor-Agnostic**: System works identically for human-only, agent-only, or hybrid teams
2. **Zero-Ambiguity**: Detail files force complete specification
3. **Empirical Validation**: Refinement loop converges through execution attempts
4. **Compounding Assets**: Specs appreciate in value through reuse
5. **Strategic + Tactical**: Supports both AOT roadmap planning and JIT execution

## Success Criteria

- Specs achieve 95%+ completeness before approval
- One-shot implementation success rate >90% with validated specs
- Refinement loop converges in <5 attempts on average
- 79% cost reduction at scale (100 features)
- Portfolio optimization generates viable roadmaps within budget constraints
