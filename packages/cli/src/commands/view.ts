import { Command } from 'commander';
import {
  ConfigManager,
  SpecParser,
  DetailParser,
  ViewGenerator,
  ViewCache,
  getMtime,
  writeFile,
} from '@oxygen/core';
import { OutputManager } from '../utils/output';
import { handleError } from '../utils/errors';
import { CommandContext } from '../types';
import { EXIT_CODES, DEFAULT_VALUES } from '../constants';
import { ViewType } from '@oxygen/core';

export function setupViewCommand(program: Command): void {
  program
    .command('view <spec>')
    .description('Generate and display spec view')
    .option('-t, --type <type>', 'View type: full, execution, reference', DEFAULT_VALUES.VIEW_TYPE)
    .option('-o, --output <file>', 'Write to file instead of stdout')
    .option('--no-cache', 'Force regeneration (skip cache)')
    .action(
      async (
        specId: string,
        options: { type?: string; output?: string; cache?: boolean; context: CommandContext }
      ) => {
        const output = new OutputManager(options.context);

        try {
          const configManager = new ConfigManager();
          const specEntry = await configManager.findSpec(specId);

          if (!specEntry) {
            output.error(`Spec '${specId}' not found`);
            if (options.context.json) {
              output.json({
                success: false,
                error: { message: `Spec '${specId}' not found`, code: 'SPEC_NOT_FOUND' },
              });
            }
            process.exit(EXIT_CODES.SPEC_NOT_FOUND);
          }

          const parser = new SpecParser();
          const detailParser = new DetailParser();
          const spec = await parser.loadSpec(specEntry.file);
          const details = detailParser.parseAllDetails(spec);

          const viewType = (options.type || DEFAULT_VALUES.VIEW_TYPE) as ViewType;
          const useCache = options.cache !== false;

          // Check cache
          const cache = new ViewCache();
          const specMtime = await getMtime(specEntry.file);
          let viewResult;

          if (useCache && (await cache.isCached(spec.meta.id, viewType, specMtime))) {
            const cached = await cache.getCached(spec.meta.id, viewType);
            if (cached) {
              viewResult = cached;
            }
          }

          if (!viewResult) {
            const generator = new ViewGenerator();
            viewResult = generator.generate(
              spec,
              details.technical,
              details.product,
              details.integration,
              viewType
            );
            await cache.cache(spec.meta.id, viewType, viewResult.markdown, viewResult.metadata);
          }

          // Output
          if (options.output) {
            await writeFile(options.output, viewResult.markdown);
            output.success(`View written to ${options.output}`);
          } else {
            output.text(viewResult.markdown);
          }

          if (options.context.verbose) {
            output.info(`Token estimate: ${viewResult.metadata.tokenEstimate}`);
          }

          if (options.context.json) {
            output.json({
              success: true,
              data: {
                markdown: viewResult.markdown,
                metadata: viewResult.metadata,
              },
            });
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
