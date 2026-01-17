import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import { resolveWorkspaceRoot } from './path-utils';
import { GitError } from './errors';

export interface GitStatus {
  current: string;
  files: string[];
  ahead: number;
  behind: number;
}

export class GitManager {
  private git: SimpleGit;
  private workspaceRoot: string;

  constructor(workspaceRoot?: string) {
    this.workspaceRoot = workspaceRoot || resolveWorkspaceRoot();
    this.git = simpleGit(this.workspaceRoot);
  }

  /**
   * Create a new branch with auto-increment if branch exists
   */
  async createBranch(branchName: string): Promise<string> {
    try {
      // Check if branch already exists
      let finalBranchName = branchName;
      let attempt = 1;

      while (await this.branchExists(finalBranchName)) {
        // Extract base name and attempt number if it exists
        const match = branchName.match(/^(.+)-(\d+)$/);
        if (match && match[1] && match[2]) {
          const base = match[1];
          const existingAttempt = match[2];
          attempt = parseInt(existingAttempt, 10) + 1;
          finalBranchName = `${base}-${attempt}`;
        } else {
          finalBranchName = `${branchName}-${attempt}`;
          attempt++;
        }
      }

      await this.git.checkoutLocalBranch(finalBranchName);
      return finalBranchName;
    } catch (error) {
      if (error instanceof Error) {
        throw new GitError(`Failed to create branch ${branchName}: ${error.message}`, error);
      }
      throw new GitError(`Failed to create branch ${branchName}`, error);
    }
  }

  /**
   * Check if branch exists
   */
  async branchExists(branchName: string): Promise<boolean> {
    try {
      const branches = await this.git.branchLocal();
      return branches.all.includes(branchName);
    } catch {
      return false;
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<string> {
    try {
      const status = await this.git.status();
      return status.current || 'main';
    } catch (error) {
      if (error instanceof Error) {
        throw new GitError(`Failed to get current branch: ${error.message}`, error);
      }
      throw new GitError('Failed to get current branch', error);
    }
  }

  /**
   * Checkout a branch
   */
  async checkoutBranch(branchName: string): Promise<void> {
    try {
      await this.git.checkout(branchName);
    } catch (error) {
      if (error instanceof Error) {
        throw new GitError(`Failed to checkout branch ${branchName}: ${error.message}`, error);
      }
      throw new GitError(`Failed to checkout branch ${branchName}`, error);
    }
  }

  /**
   * Commit files with standard message format
   */
  async commit(message: string, files: string[]): Promise<void> {
    try {
      await this.git.add(files);
      await this.git.commit(message);
    } catch (error) {
      if (error instanceof Error) {
        throw new GitError(`Failed to commit: ${error.message}`, error);
      }
      throw new GitError('Failed to commit', error);
    }
  }

  /**
   * Check if working directory has uncommitted changes
   */
  async isDirty(): Promise<boolean> {
    try {
      const status = await this.git.status();
      return !status.isClean();
    } catch {
      return false;
    }
  }

  /**
   * Reset working directory to clean state
   */
  async resetHard(): Promise<void> {
    try {
      await this.git.reset(['--hard', 'HEAD']);
      await this.git.clean(CleanOptions.FORCE);
    } catch (error) {
      if (error instanceof Error) {
        throw new GitError(`Failed to reset working directory: ${error.message}`, error);
      }
      throw new GitError('Failed to reset working directory', error);
    }
  }

  /**
   * Get git status information
   */
  async getStatus(): Promise<GitStatus> {
    try {
      const status = await this.git.status();
      return {
        current: status.current || 'main',
        files: status.files.map((f) => f.path),
        ahead: status.ahead,
        behind: status.behind,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new GitError(`Failed to get git status: ${error.message}`, error);
      }
      throw new GitError('Failed to get git status', error);
    }
  }
}
