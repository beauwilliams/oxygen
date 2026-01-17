import { promises as fs } from 'fs';
import { dirname } from 'path';
import { resolvePath } from './path-utils';

/**
 * Read a file with error handling
 */
export async function readFile(path: string): Promise<string> {
  try {
    const absolutePath = resolvePath(path);
    return await fs.readFile(absolutePath, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read file ${path}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Write a file atomically (write to temp file, then rename)
 */
export async function writeFile(path: string, content: string): Promise<void> {
  try {
    const absolutePath = resolvePath(path);
    const dir = dirname(absolutePath);
    await ensureDir(dir);

    // Write to temp file first
    const tempPath = `${absolutePath}.tmp`;
    await fs.writeFile(tempPath, content, 'utf-8');

    // Atomic rename
    await fs.rename(tempPath, absolutePath);
  } catch (error) {
    // Clean up temp file on error
    try {
      let absolutePath: string;
      if (path.startsWith('/') || (process.platform === 'win32' && /^[A-Z]:/.test(path))) {
        absolutePath = path;
      } else {
        absolutePath = resolvePath(path);
      }
      await fs.unlink(`${absolutePath}.tmp`);
    } catch {
      // Ignore cleanup errors
    }

    if (error instanceof Error) {
      throw new Error(`Failed to write file ${path}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Create directory recursively
 * If path is absolute, use it directly; otherwise resolve from workspace root
 */
export async function ensureDir(path: string): Promise<void> {
  try {
    let absolutePath: string;
    if (path.startsWith('/') || (process.platform === 'win32' && /^[A-Z]:/.test(path))) {
      absolutePath = path; // Absolute path
    } else {
      absolutePath = resolvePath(path);
    }
    await fs.mkdir(absolutePath, { recursive: true });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create directory ${path}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Check if file or directory exists
 */
export async function exists(path: string): Promise<boolean> {
  try {
    const absolutePath = resolvePath(path);
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file modification time
 */
export async function getMtime(path: string): Promise<Date> {
  try {
    const absolutePath = resolvePath(path);
    const stats = await fs.stat(absolutePath);
    return stats.mtime;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get mtime for ${path}: ${error.message}`);
    }
    throw error;
  }
}
