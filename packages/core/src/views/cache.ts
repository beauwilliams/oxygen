import { exists, readFile, writeFile, ensureDir } from '../utils/file-utils';
import { joinPaths } from '../utils/path-utils';
import { ViewMetadata } from './types';

export class ViewCache {
  /**
   * Get cache file path for a view
   */
  private getCachePath(specId: string, viewType: string): string {
    return joinPaths('.oxygen', 'views', `${specId}-${viewType}.md`);
  }

  /**
   * Get metadata file path for a view
   */
  private getMetadataPath(specId: string, viewType: string): string {
    return joinPaths('.oxygen', 'views', `${specId}-${viewType}.meta.json`);
  }

  /**
   * Check if cached view exists and is valid
   */
  async isCached(specId: string, viewType: string, specFileMtime: Date): Promise<boolean> {
    const cachePath = this.getCachePath(specId, viewType);
    const metadataPath = this.getMetadataPath(specId, viewType);

    if (!(await exists(cachePath)) || !(await exists(metadataPath))) {
      return false;
    }

    try {
      const metadataContent = await readFile(metadataPath);
      const metadata: ViewMetadata = JSON.parse(metadataContent);
      const cacheMtime = new Date(metadata.specFileMtime);

      // Cache is valid if spec file hasn't been modified since cache was created
      return specFileMtime <= cacheMtime;
    } catch {
      return false;
    }
  }

  /**
   * Get cached view
   */
  async getCached(
    specId: string,
    viewType: string
  ): Promise<{ markdown: string; metadata: ViewMetadata } | null> {
    const cachePath = this.getCachePath(specId, viewType);
    const metadataPath = this.getMetadataPath(specId, viewType);

    if (!(await exists(cachePath)) || !(await exists(metadataPath))) {
      return null;
    }

    try {
      const markdown = await readFile(cachePath);
      const metadataContent = await readFile(metadataPath);
      const metadata: ViewMetadata = JSON.parse(metadataContent);
      return { markdown, metadata };
    } catch {
      return null;
    }
  }

  /**
   * Cache a view
   */
  async cache(
    specId: string,
    viewType: string,
    markdown: string,
    metadata: ViewMetadata
  ): Promise<void> {
    await ensureDir('.oxygen/views');

    const cachePath = this.getCachePath(specId, viewType);
    const metadataPath = this.getMetadataPath(specId, viewType);

    await writeFile(cachePath, markdown);
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Invalidate cache for a spec
   */
  async invalidate(_specId: string): Promise<void> {
    // Cache invalidation happens automatically via isCached check
    // This method can be used for manual invalidation if needed
  }
}
