export interface CommandContext {
  verbose: boolean;
  json: boolean;
  noColor: boolean;
  nonInteractive: boolean;
}

export type OutputFormat = 'console' | 'json' | 'markdown';

export interface CommandOptions {
  verbose?: boolean;
  json?: boolean;
  noColor?: boolean;
  nonInteractive?: boolean;
}
