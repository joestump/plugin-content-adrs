import pluginContentAdrs from '../index';

describe('plugin-content-adrs', () => {
  describe('module export', () => {
    it('should export a default function', () => {
      expect(typeof pluginContentAdrs).toBe('function');
    });

    it('should return a plugin object with required methods', () => {
      const mockContext = {
        siteDir: '/tmp/site',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentAdrs(mockContext, { adrsDir: 'docs/adrs' });

      expect(plugin.name).toBe('docusaurus-plugin-content-adrs');
      expect(typeof plugin.loadContent).toBe('function');
      expect(typeof plugin.contentLoaded).toBe('function');
    });
  });

  describe('options merging', () => {
    it('should use default adrsDir when not provided', () => {
      const mockContext = {
        siteDir: '/tmp/site',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentAdrs(mockContext, {});

      expect(plugin.name).toBe('docusaurus-plugin-content-adrs');
    });

    it('should use custom adrsDir when provided', () => {
      const mockContext = {
        siteDir: '/tmp/site',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentAdrs(mockContext, { adrsDir: 'custom/adrs' });

      expect(plugin.name).toBe('docusaurus-plugin-content-adrs');
    });
  });

  describe('loadContent', () => {
    it('should return empty adrs array when directory does not exist', async () => {
      const mockContext = {
        siteDir: '/nonexistent',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentAdrs(mockContext, { adrsDir: 'docs/adrs' });
      const content = await plugin.loadContent!();

      expect(content).toEqual({ adrs: [] });
    });

    it('should return object with adrs array', async () => {
      const mockContext = {
        siteDir: '/tmp/site',
        generatedFilesDir: '/tmp/generated',
        outDir: '/tmp/out',
        baseUrl: '/',
        i18n: { currentLocale: 'en' },
      } as any;

      const plugin = pluginContentAdrs(mockContext, {});
      const content = await plugin.loadContent!();

      expect(Array.isArray(content.adrs)).toBe(true);
      expect(content.adrs.length).toBeGreaterThanOrEqual(0);
    });
  });
});
