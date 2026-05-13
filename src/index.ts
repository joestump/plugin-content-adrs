import type { LoadContext, Plugin } from '@docusaurus/types';
import glob from 'fast-glob';
import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { parseFrontmatter, extractStatus, extractField } from 'lib-artifact-transforms';

export interface PluginOptions {
  adrsDir?: string;
}

export interface PluginConfig extends PluginOptions {}

const defaultConfig: PluginConfig = {
  adrsDir: 'docs/adrs',
};

export interface AdrArtifact {
  id: string;
  title: string;
  status?: string;
  date?: string;
  supersededBy?: string;
  dependsOn?: string[];
  relatedTo?: string[];
  context?: string;
  decision?: string;
  consequences?: string;
}

export default function pluginContentAdrs(
  context: LoadContext,
  options: PluginConfig,
): Plugin<{ adrs: AdrArtifact[] }> {
  const config = { ...defaultConfig, ...options };
  const adrsDir = join(context.siteDir, config.adrsDir!);

  return {
    name: 'docusaurus-plugin-content-adrs',
    async loadContent() {
      try {
        const adrs: AdrArtifact[] = [];
        const pattern = join(adrsDir, 'ADR-*.md');
        const files = await glob(pattern);

        for (const file of files.sort()) {
          const content = readFileSync(file, 'utf-8');
          const { metadata, content: body } = parseFrontmatter(content);

          const id = basename(file, '.md');
          const titleMatch = body.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1].trim() : id;

          // Extract sections from body
          const contextMatch = body.match(
            /##\s+Context[\s\S]*?(?=##|$)/i,
          );
          const decisionMatch = body.match(
            /##\s+Decision[\s\S]*?(?=##|$)/i,
          );
          const consequencesMatch = body.match(
            /##\s+Consequence[\s\S]*?(?=##|$)/i,
          );

          adrs.push({
            id,
            title,
            status: extractStatus(metadata),
            date: extractField<string>(metadata, 'date'),
            supersededBy: extractField<string>(metadata, 'superseded-by'),
            dependsOn: extractField<string[]>(metadata, 'depends-on'),
            relatedTo: extractField<string[]>(metadata, 'related-to'),
            context: contextMatch ? contextMatch[0].substring(0, 200) : '',
            decision: decisionMatch ? decisionMatch[0].substring(0, 200) : '',
            consequences: consequencesMatch
              ? consequencesMatch[0].substring(0, 200)
              : '',
          });
        }

        return { adrs };
      } catch (error) {
        console.warn(`Error loading ADRs from ${adrsDir}:`, error);
        return { adrs: [] };
      }
    },
    async contentLoaded({ content, actions }) {
      // Create routes for each ADR
      if (content.adrs.length === 0) {
        return;
      }

      for (const adr of content.adrs) {
        // This would be expanded to actually create MDX pages
        // For now, the plugin loads and parses the content
      }
    },
  };
}
