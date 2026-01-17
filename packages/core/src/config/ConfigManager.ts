import { readFile, writeFile, exists, ensureDir } from '../utils/file-utils';
import { ConfigError } from '../utils/errors';
import { OxygenConfig, OxygenConfigSchema, SpecRegistryEntry } from '../schema/config';

const CONFIG_FILE = '.oxygen/config.json';

export class ConfigManager {
  /**
   * Read config with validation, returns defaults if file doesn't exist
   */
  async read(): Promise<OxygenConfig> {
    const configExists = await exists(CONFIG_FILE);
    if (!configExists) {
      return this.getDefaultConfig();
    }

    try {
      const content = await readFile(CONFIG_FILE);
      const parsed = JSON.parse(content);
      return OxygenConfigSchema.parse(parsed);
    } catch (error) {
      if (error instanceof Error) {
        throw new ConfigError(`Failed to parse config file: ${error.message}`, error);
      }
      throw new ConfigError('Failed to parse config file', error);
    }
  }

  /**
   * Write config atomically with validation
   */
  async write(config: OxygenConfig): Promise<void> {
    // Validate before writing
    const validated = OxygenConfigSchema.parse(config);

    // Ensure .oxygen directory exists
    await ensureDir('.oxygen');

    // Write atomically
    const content = JSON.stringify(validated, null, 2);
    await writeFile(CONFIG_FILE, content);
  }

  /**
   * Get next spec ID and increment atomically
   */
  async incrementSpecId(): Promise<number> {
    const config = await this.read();
    const nextId = config.nextSpecId;
    config.nextSpecId = nextId + 1;
    await this.write(config);
    return nextId;
  }

  /**
   * Register a spec in the registry, throws if duplicate ID
   */
  async registerSpec(id: string, name: string, file: string): Promise<void> {
    const config = await this.read();

    // Check for duplicate ID
    const existing = config.specs.find((s) => s.id === id);
    if (existing) {
      throw new ConfigError(`Spec with ID '${id}' already exists in registry`);
    }

    // Add to registry
    config.specs.push({
      id,
      name,
      file,
    });

    await this.write(config);
  }

  /**
   * Find spec by ID or name
   */
  async findSpec(idOrName: string): Promise<SpecRegistryEntry | null> {
    const config = await this.read();
    return config.specs.find((s) => s.id === idOrName || s.name === idOrName) || null;
  }

  /**
   * Get all specs from registry
   */
  async getAllSpecs(): Promise<SpecRegistryEntry[]> {
    const config = await this.read();
    return config.specs;
  }

  /**
   * Update branch pattern
   */
  async setBranchPattern(pattern: string): Promise<void> {
    const config = await this.read();
    config.branchPattern = pattern;
    await this.write(config);
  }

  /**
   * Update agent provider
   */
  async setAgentProvider(type: 'noop' | 'claude' | 'openai', model?: string): Promise<void> {
    const config = await this.read();
    config.agentProvider = {
      type,
      model,
    };
    await this.write(config);
  }

  /**
   * Initialize default config file
   */
  async initialize(): Promise<void> {
    const configExists = await exists(CONFIG_FILE);
    if (configExists) {
      throw new ConfigError('Config file already exists. Use --force to overwrite.');
    }

    const defaultConfig = this.getDefaultConfig();
    await this.write(defaultConfig);
  }

  /**
   * Check if config file exists
   */
  async configExists(): Promise<boolean> {
    return await exists(CONFIG_FILE);
  }

  /**
   * Get default config
   */
  private getDefaultConfig(): OxygenConfig {
    return {
      nextSpecId: 1,
      specs: [],
      branchPattern: 'oxygen/spec-{id}-{attempt}',
      agentProvider: {
        type: 'noop',
      },
    };
  }
}
