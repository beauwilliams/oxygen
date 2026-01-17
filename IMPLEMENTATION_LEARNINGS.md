# Implementation Learnings & Refinements

This document captures issues encountered during implementation and their solutions, to be incorporated into the plan.

## ESM Module System

**Issue:** Initial confusion about `.js` extensions in TypeScript imports.

**Solution:**

- All packages must have `"type": "module"` in package.json
- All relative imports should be **extensionless** (no `.js` extensions)
- TypeScript with `moduleResolution: "bundler"` handles extensionless imports correctly
- Package imports (like `@oxygen/core`) don't need extensions
- **NO dynamic imports:** Use static `import` statements only - no `import()`, no `require()`
- **NO ESLint disable comments:** Fix issues properly instead of disabling rules

**Prohibited Patterns:**

- ❌ `const { X } = await import('module')` - Use static `import { X } from 'module'` instead
- ❌ `const X = require('module')` - Use static `import X from 'module'` instead
- ❌ `// eslint-disable-next-line` - Fix the underlying issue instead
- ❌ `/* eslint-disable */` - Fix the underlying issue instead

**Rationale:**

- Dynamic imports make code harder to analyze and can cause runtime errors
- ESLint disable comments hide problems instead of fixing them
- Static imports are more predictable and enable better tooling support

**Files affected:**

- All TypeScript files in `packages/`
- Root `package.json`
- `packages/prettier-config/package.json`
- `packages/eslint-config/package.json`

## Package Installation Issues

**Issues encountered:**

1. `eslint-plugin-prettier@^6.0.0` doesn't exist (latest is 5.5.5)
2. Missing `@types/inquirer` for TypeScript support

**Solutions:**

- Use `eslint-plugin-prettier@^5.5.5` (latest stable)
- Add `@types/inquirer@^9.0.0` to CLI package devDependencies

## Type Re-export Conflicts

**Issue:** `LinterConfig` and `RuleSeverity` were exported from both:

- `packages/core/src/schema/linter-config.ts` (Zod schema types)
- `packages/core/src/linter/types.ts` (runtime types)

**Solution:**

- Use explicit type exports in `linter/index.ts` to avoid conflicts
- Rename conflicting exports: `RuleSeverity as LinterRuleSeverity`, `LinterConfig as LinterConfigType`
- Or: Use schema types in linter module instead of duplicating

**Recommendation:** Prefer using schema types in implementation modules to avoid duplication.

## Unused Imports/Parameters

**Issue:** TypeScript strict mode flags unused imports and parameters.

**Solutions:**

- Prefix unused parameters with `_` (e.g., `_text`, `_specId`)
- Remove truly unused imports
- Keep imports that are used for type-only purposes (TypeScript will handle these)

## Ora Spinner Integration

**Issue:** `createSpinner` method is stubbed but ora is not integrated.

**Current state:**

- `ora` package is in dependencies but not used
- Spinner returns a no-op object

**Required:**

- Integrate `ora` package for actual spinner functionality
- Update `OutputManager.createSpinner()` to return real ora spinner instance
- Use spinner in commands that need progress indication (generate, refine, etc.)

## Build & Type Check as Definition of Done

**Issue:** Build and type-check were not explicitly part of success criteria.

**Solution:**

- Add to Definition of Done:
  - ✅ `pnpm build` completes successfully for all packages
  - ✅ `pnpm type-check` passes with no errors
  - ✅ All packages compile to ESM format
  - ✅ Type definitions are generated correctly

## Husky v10 Deprecation

**Issue:** Husky v9 uses deprecated initialization script.

**Solution:**

- Update to Husky v10+ when available, or
- Use simplified husky setup that doesn't require deprecated `_/husky.sh`
- Current workaround: Simplified script that shows deprecation warning

## ESLint Configuration

**Issue:** ESLint v9 flat config requires different setup than v8.

**Solution:**

- Use `typescript-eslint` package (not separate parser/plugin)
- Use `@eslint/js` for base config
- Export flat config arrays from shared config package
- Root `eslint.config.js` imports and exports the flat config

## File Path Handling

**Issue:** File utilities need to handle both relative and absolute paths.

**Solution:**

- Check if path is absolute before resolving from workspace root
- Support both relative paths (from workspace root) and absolute paths
- Use proper path detection for cross-platform compatibility

## Type Safety in Error Handling

**Issue:** Error objects in JSON output need consistent structure.

**Solution:**

- Always include `code` property in error objects
- Use consistent error code format
- Update `JsonOutput` interface to require `code` field

## Package Bundling for ESM Runtime

**Issue:** When `bundle: false` in tsup config, output files contain extensionless relative imports (e.g., `export * from "./schema/index"`). Node.js ESM requires `.js` extensions in import paths at runtime, but we should NOT add `.js` extensions to source code imports.

**Solution:**

- Use `bundle: true` in tsup config for all packages
- Bundling resolves all imports and inlines them, eliminating the need for `.js` extensions in output
- Source code remains extensionless (as per ESM requirements)
- Output is a single bundled file with no relative imports

**Files affected:**

- `packages/core/tsup.config.ts` - Changed from `bundle: false` to `bundle: true`
- `packages/cli/tsup.config.ts` - Already had `bundle: true`

**Reference:** Follow pattern from `lucid-agents` repo - they use bundling to avoid extension issues

## Init Command Workspace Resolution

**Issue:** `init` command failed because `ensureDir()` uses `resolvePath()`, which calls `resolveWorkspaceRoot()`. This requires `.oxygen/` to already exist, but `init` is trying to create it for the first time.

**Solution:**

- For initial workspace creation, use `process.cwd()` directly instead of workspace-relative paths
- Use Node.js `fs.mkdir()` with `recursive: true` for initial directory creation
- Only use `ensureDir()` from core utilities after workspace exists

**Files affected:**

- `packages/cli/src/commands/init.ts` - Use `process.cwd()` and `fs.mkdir()` for initial setup

## Recommendations for Plan Updates

1. **Add ESM requirements explicitly:**
   - All packages must use `"type": "module"`
   - Extensionless relative imports
   - No CommonJS patterns

2. **Add dependency version constraints:**
   - Document exact versions or version ranges that work
   - Include all type definition packages

3. **Add type re-export guidelines:**
   - Avoid exporting same type from multiple modules
   - Use explicit type aliases when needed
   - Prefer schema types in implementation

4. **Add ora integration to Phase 6:**
   - Integrate ora spinner in OutputManager
   - Use in commands that need progress indication

5. **Add Definition of Done section:**
   - Build must pass
   - Type check must pass
   - All packages compile successfully
   - No TypeScript errors

6. **Add troubleshooting section:**
   - Common build errors and solutions
   - Type re-export conflicts
   - Unused import warnings
