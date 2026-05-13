# plugin-content-adrs

Docusaurus plugin for transforming MADR (Markdown Architectural Decision Records) files into MDX pages. Scans a directory for `ADR-*.md` files, extracts metadata and content, and generates a browsable ADR documentation site with automatic landing pages, relationship graphs, and cross-references.

[![Test](https://github.com/joestump/plugin-content-adrs/actions/workflows/test.yml/badge.svg)](https://github.com/joestump/plugin-content-adrs/actions/workflows/test.yml)

## Installation

```bash
npm install plugin-content-adrs lib-artifact-transforms
```

## Quick Start

In `docusaurus.config.ts`:

```typescript
import type { Config } from '@docusaurus/types';

const config: Config = {
  plugins: [
    [
      'plugin-content-adrs',
      {
        adrsDir: 'docs/adrs',
      },
    ],
  ],
};

export default config;
```

Then create your first ADR in `docs/adrs/ADR-0001.md`:

```markdown
---
status: proposed
date: 2026-05-13
---

# ADR-0001: Use TypeScript

## Context and Problem Statement

We need to standardize on a language for our backend services.

## Decision Outcome

We will use TypeScript for all new backend services because it provides type safety while maintaining JavaScript compatibility.

## Consequences

- Developers must be familiar with TypeScript
- Build times will increase slightly due to transpilation
```

## Features

- **Automatic scanning**: Discovers all `ADR-*.md` files in the configured directory
- **Metadata extraction**: Parses YAML frontmatter for status, date, superseded-by, and custom fields
- **Landing page**: Auto-generates a table of all ADRs with sortable columns (ID, title, status, date)
- **Individual pages**: Creates MDX pages for each ADR with formatted content
- **Relationship graphs**: Renders dependency and supersession graphs using Mermaid (via `lib-artifact-transforms`)
- **Cross-references**: Links related ADRs and specs across your documentation
- **Status tracking**: Visualizes lifecycle (proposed → review → accepted → superseded/deprecated)

## Configuration

### Options

```typescript
interface PluginOptions {
  /**
   * Directory containing ADR-*.md files (relative to project root)
   * @default 'docs/adrs'
   */
  adrsDir?: string;
}
```

### Example: Multiple configuration scenarios

**Single ADR directory (default):**
```typescript
['plugin-content-adrs', { adrsDir: 'docs/adrs' }]
```

**Custom ADR directory:**
```typescript
['plugin-content-adrs', { adrsDir: 'architecture/decisions' }]
```

## ADR File Format

### Minimal example

```markdown
---
status: accepted
---

# ADR-0001: Use PostgreSQL

We chose PostgreSQL because it's proven, open-source, and supports complex queries.
```

### Full example with all supported fields

```markdown
---
status: accepted
date: 2026-05-13
superseded-by: ADR-0005
depends-on:
  - ADR-0001
  - ADR-0003
related-to:
  - SPEC-0012
---

# ADR-0002: Implement caching layer

## Context and Problem Statement

Database queries are slow under load.

## Decision Outcome

Implement Redis as a caching layer to reduce database load.

## Consequences

- Need to manage cache invalidation
- Additional operational complexity
- Significant latency improvements for read-heavy workloads
```

### Supported frontmatter fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | Lifecycle stage: `proposed`, `review`, `accepted`, `implemented`, `superseded`, `deprecated`, `rejected` |
| `date` | string | No | ISO 8601 date (YYYY-MM-DD) or RFC 3339 |
| `superseded-by` | string | No | ID of the superseding ADR (e.g., `ADR-0005`) |
| `depends-on` | string[] | No | Array of ADR IDs this decision depends on |
| `related-to` | string[] | No | Array of related SPEC IDs or other ADR IDs |

## Generated Output

This plugin generates:

1. **Landing page** at `/docs/adrs/` — Table of all ADRs
2. **Individual ADR pages** at `/docs/adrs/adr-0001/`, `/docs/adrs/adr-0002/`, etc.
3. **Sidebar entries** for each ADR (automatically integrated with Docusaurus sidebar)
4. **Relationship graphs** (Mermaid SVG) embedded in each page showing supersessions and dependencies

## Development

### Running tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Watch mode (during development)

```bash
npm run watch
```

## Testing

This plugin includes comprehensive test coverage:

```bash
npm test -- --coverage
```

Coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Integration with other plugins

This plugin works best alongside:

- [`plugin-content-openspec`](https://github.com/joestump/plugin-content-openspec) — OpenSpec specifications
- [`plugin-content-skills`](https://github.com/joestump/plugin-content-skills) — Claude skills documentation
- [`lib-artifact-transforms`](https://github.com/joestump/lib-artifact-transforms) — Shared artifact processing utilities

## Troubleshooting

**Q: ADRs not appearing in the sidebar**  
A: Ensure the sidebar configuration includes the ADRs route. The plugin auto-generates it, but you may need to restart Docusaurus.

**Q: Relationship graphs not rendering**  
A: Verify that `lib-artifact-transforms` is installed and Mermaid support is enabled in your Docusaurus config.

**Q: Status field not recognized**  
A: Check that your frontmatter uses valid YAML syntax. The plugin supports both YAML frontmatter and legacy inline-bullet format (`- **Status:** accepted`).

## License

MIT
