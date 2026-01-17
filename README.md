# Oxygen

> For when you're building something that actually matters.

Oxygen is an actor-agnostic specification management system that treats specs as first-class, versioned assets, enabling zero-ambiguity implementations through structured schemas, impact/effort/risk analysis, refinement loops, and strategic roadmap planning.

## Why Oxygen Exists

Oxygen is built on a simple principle: **Great Spec + Simple Orchestration > Shitty Spec + Complex Orchestration**.

### The Triviality Spectrum

Not all problems need the same level of specification. The triviality spectrum helps you understand when Oxygen is valuable:

- **Trivial problems** (Snake game, todo list): Don't need Oxygen. Just prompt Claude.
- **Non-trivial problems** (novel algorithms, complex systems): Need complete specs. This is where Oxygen shines.

The spectrum ranges from 0-10% spec needed for trivial problems to 95%+ spec required for non-trivial problems where ambiguity leads to costly mistakes.

### The Edge-Seeking Principle

Oxygen exists for teams building non-trivial solutions where getting it right creates competitive advantage. We're not building Oxygen for Snake games. We're building Oxygen for competitive advantages.

**Edge** is defined as a competitive advantage that creates disproportionate returns. When you're building something that creates edge, the cost of getting it wrong is high, and the value of getting it right is even higher.

### ROI of Specs

Complete specs reduce implementation cost by 79% at scale. When you're building 100 features:

- Without specs: High ambiguity, multiple iterations, costly rework
- With complete specs: One-shot implementations, minimal clarification, predictable costs

**Positioning:** "Don't use Oxygen to build Snake. Use Oxygen to build your competitive advantage."

## What Oxygen Is

- **Actor-agnostic specification management system** - Works for human-only, agent-only, or hybrid teams
- **First-class, versioned assets** - Specs are treated as valuable artifacts, not throwaway documents
- **Zero-ambiguity implementations** - Structured schemas ensure complete specifications
- **Strategic decision support** - Impact × Effort × Risk analysis with ROI calculations
- **Empirical validation** - Refinement loops with branch-based tracking
- **Portfolio optimization** - Strategic roadmap planning with dependency resolution

## What Oxygen Is NOT

- **NOT for trivial problems** - Snake games, todo lists don't need this level of specification
- **NOT for simple features** - Where specs are overhead, not value
- **NOT a replacement for good engineering judgment** - Still requires domain expertise
- **NOT a magic bullet** - Specs must be complete and accurate to provide value

## Key Features

- **Structured JSON schema** with Zod validation
- **Impact × Effort × Risk analysis** with ROI calculations and decision recommendations
- **Refinement loops** with empirical validation and convergence detection
- **Strategic roadmap planning** with portfolio optimization (ILP solver)
- **Built-in view generation** (full ~15K tokens, execution ~8K tokens, reference ~2K tokens)
- **Extensible linting system** with scoring (0-100%) and category-based rules
- **Actor adapters** for spec generation (Claude, OpenAI) and future implementation workflows

## Quick Start

```bash
# Install dependencies
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

## Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - System architecture and design decisions
- [CLI Reference](docs/CLI.md) - Complete command reference and usage examples
- [Spec Format](docs/SPEC_FORMAT.md) - Spec JSON format and schema documentation
- [Refinement Loop](docs/REFINEMENT_LOOP.md) - How refinement works with kill criteria and cost control
- [Roadmap Planning](docs/ROADMAP_PLANNING.md) - Portfolio optimization and dependency resolution

## Target Audience

Oxygen is designed for:

- **Teams building non-trivial solutions** - Where ambiguity leads to costly mistakes
- **Edge-seekers** - Who need complete specs to build competitive advantages
- **Organizations** - Where getting it right creates disproportionate returns

## Philosophy

Oxygen follows Warren Buffett's principle: "Build for edge, not for volume." We're not optimizing for the 90% of trivial problems. We're optimizing for the 10% of problems where getting it right creates competitive advantage.

When you're building something that actually matters, the cost of a complete spec is always less than the cost of an incomplete spec.
