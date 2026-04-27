# CL Component Library — Documentation Index

This folder contains detailed developer documentation for the entire CL Component Library project — covering architecture, installation, coding decisions, and a phase-by-phase deep dive.

---

## Documents in this folder

| File                                                     | Contents                                                                |
| -------------------------------------------------------- | ----------------------------------------------------------------------- |
| [installation.md](installation.md)                       | Full environment setup from scratch — Node, pnpm, Python, all packages  |
| [phase-1-design-tokens.md](phase-1-design-tokens.md)     | Monorepo scaffold + Style Dictionary token pipeline                     |
| [phase-2-3-react-library.md](phase-2-3-react-library.md) | `@cl/react` package — Vite library build, Tailwind v4, all 6 components |
| [phase-4-web-components.md](phase-4-web-components.md)   | `@cl/web-components` — @r2wc wrappers, self-contained ESM bundle        |
| [phase-5-storybook.md](phase-5-storybook.md)             | Storybook 8 dev sandbox — stories, addons, Vite 6 setup                 |
| [phase-6-docusaurus.md](phase-6-docusaurus.md)           | Docusaurus 3 public docs site — config, sidebars, all doc pages         |
| [phase-7-mcp-server.md](phase-7-mcp-server.md)           | Python FastMCP server — tools, manifests, VS Code integration           |

---

## Architecture at a glance

```
c:\ComponentLiabery\                      ← pnpm workspace root
├── packages/
│   ├── tokens/     (@cl/tokens)          ← Phase 1: Style Dictionary design tokens
│   ├── react/      (@cl/react)           ← Phase 2+3: React component library
│   ├── web-components/ (@cl/web-components) ← Phase 4: framework-agnostic bundle
│   └── docs/       (@cl/docs)            ← Phase 6: Docusaurus public docs
├── apps/
│   └── storybook/  (@cl/storybook)       ← Phase 5: Storybook dev sandbox
├── mcp-server/                           ← Phase 7: Python MCP server
└── .vscode/mcp.json                      ← VS Code MCP registration
```

---

## Quick start

```powershell
# Install all packages
pnpm install

# Build the token pipeline first (other packages depend on it)
pnpm build:tokens

# Build the React library
pnpm build:react

# Build the Web Components bundle
pnpm build:wc

# Start Storybook on http://localhost:6006
pnpm dev:storybook

# Start Docs on http://localhost:3000
pnpm dev:docs
```

See [installation.md](installation.md) for a complete step-by-step guide including Python / MCP setup.
