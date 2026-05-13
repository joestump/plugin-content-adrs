# plugin-content-adrs

Docusaurus plugin for transforming MADR (Markdown Architectural Decision Records) files into MDX pages.

## Installation

```bash
npm install plugin-content-adrs lib-artifact-transforms
```

## Usage

In `docusaurus.config.ts`:

```typescript
export default {
  plugins: [
    [
      'plugin-content-adrs',
      {
        adrsDir: 'docs/adrs',
      },
    ],
  ],
};
```

## Features

- Scans a directory for `ADR-*.md` files
- Extracts YAML frontmatter and content sections
- Generates a landing page with an ADR table (sortable by status, date)
- Generates individual ADR pages with cross-references and relationship graphs
- Integrates with `lib-artifact-transforms` for graph visualization

## Options

- `adrsDir` (string, default: `'docs/adrs'`) — Path to directory containing ADR files

## License

MIT
