# UIComponentsWithMCP

> A custom UI component library connected to GitHub Copilot via the **Model Context Protocol (MCP)** — so your AI assistant knows your components, props, and design tokens without guessing.

---

## What Is This?

This is a proof-of-concept built in April 2026. It shows how to build a **design system from scratch** and expose it to any AI coding assistant using MCP.

The result: ask GitHub Copilot Chat _"give me a snippet for cl-button in Angular"_ and it returns accurate code from **your** library — not something hallucinated from the internet.

**Live project:** [github.com/sudeep31/UIComponentsWithMCP](https://github.com/sudeep31/UIComponentsWithMCP)

---

## What's Inside

| Package / App             | What it does                                                           |
| ------------------------- | ---------------------------------------------------------------------- |
| `packages/tokens`         | Design tokens — colours, spacing, typography (Style Dictionary)        |
| `packages/react`          | 6 React components: Button, TextBox, NumberBox, Select, TextArea, List |
| `packages/web-components` | Same 6 components as framework-agnostic Custom Elements                |
| `apps/storybook`          | Interactive component playground                                       |
| `packages/docs`           | Docusaurus documentation site                                          |
| `mcp-server/`             | Python MCP server — exposes 4 AI tools to Copilot Chat                 |

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+ — `npm install -g pnpm`
- Python 3.11+ (for the MCP server)

### 1. Install & Build

```bash
git clone https://github.com/sudeep31/UIComponentsWithMCP.git
cd UIComponentsWithMCP

pnpm install
pnpm build          # builds tokens → react → web-components in order
```

### 2. Set Up the MCP Server

```bash
cd mcp-server
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac / Linux
pip install -r requirements.txt
python test_tools.py          # all 24 tests should pass
```

### 3. Connect to VS Code

Add this to your project's `.vscode/mcp.json`:

```json
{
  "servers": {
    "cl-components": {
      "type": "stdio",
      "command": "C:/UIComponentsWithMCP/mcp-server/.venv/Scripts/python",
      "args": ["C:/UIComponentsWithMCP/mcp-server/main.py"],
      "cwd": "C:/UIComponentsWithMCP"
    }
  }
}
```

Reload VS Code → open GitHub Copilot Chat → ask anything about your components.

---

## What the AI Can Do

Once connected, Copilot Chat has access to 4 tools:

| Tool                    | What it returns                                      |
| ----------------------- | ---------------------------------------------------- |
| `list_components`       | All available components with name and description   |
| `get_component_props`   | Full prop schema for any component                   |
| `get_component_snippet` | Ready-to-use React or Web Component code             |
| `get_design_tokens`     | Design token values, optionally filtered by category |

**Example questions you can ask Copilot Chat:**

- _"What components are available in the CL library?"_
- _"Show me the props for cl-select"_
- _"Give me a snippet for cl-button in Angular"_
- _"What are the colour design tokens?"_

---

## Running the Dev Tools

### Storybook — Component Playground

Storybook requires the component packages to be built first. Run these in order:

```bash
# Step 1 — build all packages (tokens → react → web-components)
pnpm build

# Step 2 — start Storybook (opens at http://localhost:6006)
cd apps/storybook
pnpm dev
```

> If you change a component, rebuild it (`pnpm build` from the root or run `pnpm dev` in the individual package for watch mode) then Storybook will hot-reload.

**Watch mode per package** (run in separate terminals):

```bash
# Terminal 1 — watch React components
cd packages/react
pnpm dev

# Terminal 2 — watch Web Components
cd packages/web-components
pnpm dev

# Terminal 3 — Storybook
cd apps/storybook
pnpm dev
```

---

### Docs Site — Docusaurus

```bash
# Development server with hot reload (http://localhost:3000)
cd packages/docs
pnpm start

# Or build and preview the production site
pnpm build
pnpm serve
```

---

## Using the Web Components in Any Framework

```bash
npm link @cl/web-components   # or publish to npm and install normally
```

**Plain HTML:**

```html
<script type="module" src="./dist/custom-elements.js"></script>
<link rel="stylesheet" href="./dist/custom-elements.css" />
<cl-button variant="primary">Save</cl-button>
```

**Angular:**

```typescript
// main.ts
import "@cl/web-components";
// component decorator: schemas: [CUSTOM_ELEMENTS_SCHEMA]
```

Works in React, Vue, Svelte, or any project that supports standard HTML elements.

---

## Project Structure

```
UIComponentsWithMCP/
├── packages/
│   ├── tokens/          # @cl/tokens  — design tokens
│   ├── react/           # @cl/react   — React components
│   ├── web-components/  # @cl/web-components — Custom Elements
│   └── docs/            # Docusaurus docs site
├── apps/
│   └── storybook/       # Storybook playground
├── mcp-server/          # Python MCP server
│   ├── main.py          # FastMCP server entry point
│   ├── components/
│   │   └── manifests/   # One JSON file per component
│   ├── requirements.txt
│   └── test_tools.py
├── doc/                 # Phase-by-phase build documentation
└── docs/                # LinkedIn article + PDF
```

---

## Documentation

- [doc/installation.md](doc/installation.md) — full install guide
- [doc/phase-7-mcp-server.md](doc/phase-7-mcp-server.md) — MCP server deep dive
- [docs/linkedin-mcp-article.md](docs/linkedin-mcp-article.md) — article: MCP: The Missing Link Between AI and Your UI Library
- [mcp-server/README.md](mcp-server/README.md) — MCP server reference

---

## Tech Stack

**Frontend:** React 19 · TypeScript · Vite · Web Components (Custom Elements v1)  
**Design:** Style Dictionary · CSS custom properties  
**Tooling:** pnpm workspaces · Storybook 8 · Docusaurus 3  
**MCP Server:** Python 3.11 · FastMCP · JSON manifests  
**AI Integration:** VS Code MCP · GitHub Copilot Chat

---

_AI-generated · Directed and reviewed by **Sudeep Parchure** — April 2026_
