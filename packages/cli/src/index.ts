import { Command } from 'commander';
import { CommandContext } from './types';
import { OutputManager } from './utils/output';
import { handleError } from './utils/errors';

const program = new Command();

program
  .name('oxygen')
  .description('Actor-agnostic specification management system')
  .version('0.1.0')
  .option('-v, --verbose', 'Verbose output')
  .option('--json', 'Output in JSON format')
  .option('--no-color', 'Disable colored output')
  .option('--non-interactive', 'Skip all prompts (use defaults or fail)')
  .hook('preAction', (thisCommand, actionCommand) => {
    // Set global context from options
    const context: CommandContext = {
      verbose: thisCommand.opts().verbose || false,
      json: thisCommand.opts().json || false,
      noColor: thisCommand.opts().noColor || false,
      nonInteractive: thisCommand.opts().nonInteractive || false,
    };
    actionCommand.setOptionValue('context', context);
  });

// Global error handler
process.on('unhandledRejection', (error) => {
  const output = new OutputManager({
    verbose: false,
    json: false,
    noColor: false,
    nonInteractive: false,
  });
  const exitCode = handleError(error, output);
  process.exit(exitCode);
});

// Register commands
import { setupInitCommand } from './commands/init';
import { setupViewCommand } from './commands/view';
import { setupLintCommand } from './commands/lint';
import { setupAnalyzeCommand } from './commands/analyze';
import { setupGenerateCommand } from './commands/generate';

setupInitCommand(program);
setupViewCommand(program);
setupLintCommand(program);
setupAnalyzeCommand(program);
setupGenerateCommand(program);

program.parse();
