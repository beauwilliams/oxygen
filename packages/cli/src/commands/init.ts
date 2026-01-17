import { Command } from 'commander';
import { ConfigManager } from '@oxygen/core';
import { OutputManager } from '../utils/output';
import { handleError } from '../utils/errors';
import { CommandContext } from '../types';
import { EXIT_CODES } from '../constants';
import { promises as fs } from 'fs';
import { join } from 'path';

export function setupInitCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize Oxygen workspace')
    .option('-f, --force', 'Overwrite existing .oxygen/ directory')
    .action(async (options: { force?: boolean; context: CommandContext }) => {
      const output = new OutputManager(options.context);

      try {
        const configManager = new ConfigManager();

        // Check if already initialized
        const exists = await configManager.configExists();
        if (exists && !options.force) {
          if (options.context.nonInteractive) {
            output.error('Config already exists. Use --force to overwrite.');
            process.exit(EXIT_CODES.CONFIG_ERROR);
          }
          output.warning('Oxygen workspace already initialized.');
          return;
        }

        // Create directory structure (use process.cwd() directly for initial setup)
        const cwd = process.cwd();
        await fs.mkdir(join(cwd, '.oxygen/specs'), { recursive: true });
        await fs.mkdir(join(cwd, '.oxygen/views'), { recursive: true });
        await fs.mkdir(join(cwd, '.oxygen/roadmaps'), { recursive: true });

        // Initialize config
        if (!exists || options.force) {
          await configManager.initialize();
        }

        // Add .oxygen/views/ to .gitignore if it exists
        // (This would require reading and modifying .gitignore, simplified for now)

        output.success('Oxygen workspace initialized successfully.');
        if (options.context.json) {
          output.json({ success: true, data: { message: 'Workspace initialized' } });
        }
      } catch (error) {
        const exitCode = handleError(error, output);
        if (options.context.json) {
          output.json({ success: false, error: { message: String(error), code: 'UNKNOWN_ERROR' } });
        }
        process.exit(exitCode);
      }
    });
}
