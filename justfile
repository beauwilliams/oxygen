# Development commands for Oxygen

# Install dependencies
install:
    pnpm install

# Build all packages
build:
    pnpm build

# Run linting
lint:
    pnpm lint

# Fix linting issues
lint-fix:
    pnpm lint:fix

# Check formatting
format:
    pnpm format

# Fix formatting
format-fix:
    pnpm format:fix

# Type check
type-check:
    pnpm type-check

# Clean build artifacts
clean:
    pnpm clean

# Run all checks (lint, format, type-check)
check: lint format type-check

# Prepare for commit (run checks)
precommit: lint-fix format-fix type-check
