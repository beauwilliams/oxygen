import { Command } from 'commander';
import { ConfigManager, SpecParser, DetailParser, SpecLinter, builtInRules } from '@oxygen/core';
import { OutputManager } from '../utils/output';
import { handleError } from '../utils/errors';
import { CommandContext } from '../types';
import { EXIT_CODES } from '../constants';

export function setupLintCommand(program: Command): void {
  program
    .command('lint <spec>')
    .description('Lint spec for completeness and quality')
    .option('-f, --format <format>', 'Output format: console, json, markdown', 'console')
    .option('-t, --threshold <score>', 'Override threshold (0-100)', (v) => parseFloat(v))
    .action(
      async (
        specId: string,
        options: { format?: string; threshold?: number; context: CommandContext }
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

          // Setup linter
          const linter = new SpecLinter();
          linter.registerRules(builtInRules);

          // Run linter
          const result = await linter.lint(
            spec,
            details.technical,
            details.product,
            details.integration
          );

          // Check threshold
          const threshold = options.threshold !== undefined ? options.threshold / 100 : undefined;
          const passed = threshold !== undefined ? result.overallScore >= threshold : result.passed;

          // Output results
          if (options.context.json || options.format === 'json') {
            output.json({
              success: passed,
              data: {
                passed,
                overallScore: result.overallScore,
                categoryScores: result.categoryScores,
                issues: result.issues,
                rulesRun: result.rulesRun,
                rulesPassed: result.rulesPassed,
                rulesFailed: result.rulesFailed,
              },
            });
          } else {
            output.text(`Lint Results for ${specId}`);
            output.text(`Overall Score: ${(result.overallScore * 100).toFixed(1)}%`);
            output.text(`Status: ${passed ? 'PASS' : 'FAIL'}`);
            output.text(`\nCategory Scores:`);
            output.text(`  Structural: ${(result.categoryScores.structural * 100).toFixed(1)}%`);
            output.text(`  Technical: ${(result.categoryScores.technical * 100).toFixed(1)}%`);
            output.text(`  Product: ${(result.categoryScores.product * 100).toFixed(1)}%`);
            output.text(`  Integration: ${(result.categoryScores.integration * 100).toFixed(1)}%`);
            output.text(`  Consistency: ${(result.categoryScores.consistency * 100).toFixed(1)}%`);

            if (result.issues.length > 0) {
              output.text(`\nIssues (${result.issues.length}):`);
              result.issues.forEach((issue) => {
                const icon =
                  issue.severity === 'error' ? '✗' : issue.severity === 'warning' ? '⚠' : 'ℹ';
                output.text(`  ${icon} [${issue.severity}] ${issue.message}`);
                if (issue.suggestion) {
                  output.text(`     Suggestion: ${issue.suggestion}`);
                }
              });
            }
          }

          process.exit(passed ? 0 : EXIT_CODES.GENERAL_ERROR);
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
