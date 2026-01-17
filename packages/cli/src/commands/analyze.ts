import { Command } from 'commander';
import {
  ConfigManager,
  SpecParser,
  ImpactCalculator,
  EffortEstimator,
  RiskAnalyzer,
  ROICalculator,
  writeFile,
  readFile,
} from '@oxygen/core';
import { OutputManager } from '../utils/output';
import { handleError } from '../utils/errors';
import { CommandContext } from '../types';
import { EXIT_CODES } from '../constants';

export function setupAnalyzeCommand(program: Command): void {
  program
    .command('analyze <spec>')
    .description('Analyze spec impact, effort, risk, and ROI')
    .option('-u, --update', 'Write calculated analysis back to spec file')
    .action(async (specId: string, options: { update?: boolean; context: CommandContext }) => {
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
        const spec = await parser.loadSpec(specEntry.file);

        // Read spec file content for effort estimation
        const specContent = await readFile(specEntry.file);

        // Calculate impact
        const impactCalculator = new ImpactCalculator();
        const impactScore = spec.impact ? impactCalculator.calculate(spec.impact) : 0;
        const impactBreakdown = spec.impact ? impactCalculator.getBreakdown(spec.impact) : null;

        // Calculate effort
        const effortEstimator = new EffortEstimator();
        const effort = effortEstimator.estimate(specContent);

        // Get risk
        const riskAnalyzer = new RiskAnalyzer();
        const riskScore = riskAnalyzer.getRiskScore(spec.risk);
        const riskBreakdown = riskAnalyzer.getBreakdown(spec.risk);

        // Calculate ROI
        const roiCalculator = new ROICalculator();
        const roi = roiCalculator.calculateROI(impactScore, riskScore, effort.total || 0);

        // Output results
        if (options.context.json) {
          output.json({
            success: true,
            data: {
              impact: impactBreakdown,
              effort,
              risk: riskBreakdown,
              roi,
            },
          });
        } else {
          output.text(`Analysis Results for ${specId}\n`);
          output.text(`Impact Score: ${impactScore}/10`);
          if (impactBreakdown) {
            output.text(`  Business Value: ${impactBreakdown.business_value}/10`);
            output.text(`  User Value: ${impactBreakdown.user_value}/10`);
            output.text(`  Technical Value: ${impactBreakdown.technical_value}/10`);
            output.text(`  Competitive Value: ${impactBreakdown.competitive_value}/10`);
          }
          output.text(`\nEffort: $${(effort.total || 0).toFixed(2)}`);
          output.text(`  Token Cost: $${(effort.token_cost || 0).toFixed(2)}`);
          output.text(`  Estimated Tokens: ${effort.estimated_tokens || 0}`);
          output.text(`\nRisk Score: ${riskScore}/10`);
          output.text(`\nROI Analysis:`);
          output.text(`  Expected Value: ${roi.expected_value.toFixed(2)}`);
          output.text(
            `  Probability of Success: ${(roi.probability_of_success * 100).toFixed(0)}%`
          );
          output.text(`  Recommendation: ${roi.recommendation.toUpperCase()}`);
          output.text(`  Reasoning: ${roi.reasoning}`);
        }

        // Update spec file if requested
        if (options.update) {
          const specData = JSON.parse(specContent);
          specData.effort = effort;
          specData.analysis = {
            roi: {
              expected_value: roi.expected_value,
              probability_of_success: roi.probability_of_success,
              calculated_at: new Date().toISOString(),
            },
            decision: {
              recommendation: roi.recommendation,
              reasoning: roi.reasoning,
              calculated_at: new Date().toISOString(),
            },
          };
          await writeFile(specEntry.file, JSON.stringify(specData, null, 2));
          output.success('Analysis written to spec file');
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
