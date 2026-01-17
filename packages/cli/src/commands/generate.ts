import { Command } from 'commander';
import { ConfigManager, SpecSchema, writeFile, ensureDir } from '@oxygen/core';
import { OutputManager } from '../utils/output';
import { PromptManager } from '../utils/prompts';
import { handleError } from '../utils/errors';
import { CommandContext } from '../types';
import { EXIT_CODES } from '../constants';

export function setupGenerateCommand(program: Command): void {
  program
    .command('generate [name]')
    .description('Generate new spec')
    .option('-n, --name <name>', 'Spec name')
    .option('-o, --objective <text>', 'Objective description')
    .option('-s, --status <status>', 'Initial status: roadmap, draft', 'roadmap')
    .option('--skip-lint', 'Skip auto-linting after generation')
    .action(
      async (
        name: string | undefined,
        options: {
          name?: string;
          objective?: string;
          status?: string;
          skipLint?: boolean;
          context: CommandContext;
        }
      ) => {
        const output = new OutputManager(options.context);
        const prompts = new PromptManager(options.context);

        try {
          const configManager = new ConfigManager();

          // Get spec name
          const specName = options.name || name || (await prompts.promptText('Spec name:', ''));
          if (!specName) {
            output.error('Spec name is required');
            process.exit(EXIT_CODES.INVALID_ARGUMENTS);
          }

          // Get objective
          const objective = options.objective || (await prompts.promptText('Objective:', ''));
          if (!objective) {
            output.error('Objective is required');
            process.exit(EXIT_CODES.INVALID_ARGUMENTS);
          }

          // Get status
          const status = (options.status || 'roadmap') as 'roadmap' | 'draft';

          // Get next spec ID
          const nextId = await configManager.incrementSpecId();
          const specId = `spec-${String(nextId).padStart(3, '0')}`;

          // Create spec structure
          const now = new Date().toISOString();
          const spec = SpecSchema.parse({
            meta: {
              id: specId,
              version: '1.0.0',
              status,
              created_at: now,
              updated_at: now,
            },
            spec: {
              objective,
              scope: '',
              success_criteria: [],
            },
          });

          // Save spec file
          await ensureDir('.oxygen/specs');
          const specFileName = `.oxygen/specs/${specId}-${specName}.oxygen.json`;
          await writeFile(specFileName, JSON.stringify(spec, null, 2));

          // Register in config
          await configManager.registerSpec(specId, specName, specFileName);

          output.success(`Spec ${specId} created: ${specFileName}`);
          if (options.context.json) {
            output.json({
              success: true,
              data: {
                id: specId,
                name: specName,
                file: specFileName,
              },
            });
          }

          // Auto-run lint unless skipped
          if (!options.skipLint) {
            // Import and run lint (simplified - would normally call lint command)
            output.info('Run "oxygen lint" to check spec completeness');
          }
        } catch (error) {
          const exitCode = handleError(error, output);
          if (options.context.json) {
            output.json({
              success: false,
              error: { message: String(error), code: 'UNKNOWN_ERROR' },
            });
          }
          process.exit(exitCode);
        }
      }
    );
}
