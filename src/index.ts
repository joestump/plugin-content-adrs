import type { LoadContext, Plugin } from '@docusaurus/types';

export interface PluginOptions {
  adrsDir?: string;
}

export interface PluginConfig extends PluginOptions {}

const defaultConfig: PluginConfig = {
  adrsDir: 'docs/adrs',
};

export default function pluginContentAdrs(
  context: LoadContext,
  options: PluginConfig,
): Plugin<void> {
  const config = { ...defaultConfig, ...options };

  return {
    name: 'docusaurus-plugin-content-adrs',
    async loadContent() {
      // TODO: Scan adrsDir for ADR-*.md files
      // Extract status, date, title, problem statement, decision outcome, superseded-by
      return { adrs: [] };
    },
    async contentLoaded({ content, actions }) {
      // TODO: Generate MDX pages for each ADR
      // Create landing page with ADR table
      // Create individual ADR pages
    },
  };
}
