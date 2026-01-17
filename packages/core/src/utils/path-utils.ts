import { existsSync } from 'fs';
import { join, resolve, normalize } from 'path';
import { ConfigError } from './errors';

const OXYGEN_DIR = '.oxygen';

/**
 * Find the workspace root by walking up from the current directory
 * looking for the .oxygen/ directory
 */
export function resolveWorkspaceRoot(): string {
  let currentDir = process.cwd();
  const root = resolve('/');

  while (currentDir !== root) {
    const oxygenPath = join(currentDir, OXYGEN_DIR);
    if (existsSync(oxygenPath)) {
      return currentDir;
    }
    currentDir = resolve(currentDir, '..');
  }

  throw new ConfigError(
    `Workspace root not found. No '.oxygen/' directory found in current path or parent directories.`
  );
}

/**
 * Resolve a relative path from the workspace root to an absolute path
 */
export function resolvePath(relativePath: string): string {
  const workspaceRoot = resolveWorkspaceRoot();
  return resolve(workspaceRoot, relativePath);
}

/**
 * Join multiple path segments (cross-platform)
 */
export function joinPaths(...paths: string[]): string {
  return join(...paths);
}

/**
 * Normalize a path (handle Windows/Unix differences)
 */
export function normalizePath(path: string): string {
  return normalize(path);
}
