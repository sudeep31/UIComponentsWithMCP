# Installation Guide

This document walks through setting up the CL Component Library workspace from scratch on a fresh Windows machine.

---

## Prerequisites

| Tool                   | Required version | Install                       |
| ---------------------- | ---------------- | ----------------------------- |
| Node.js                | 20 LTS (20.x)    | https://nodejs.org            |
| pnpm                   | 10.x             | `npm install -g pnpm@latest`  |
| Python                 | 3.10+            | https://python.org            |
| Git                    | Any recent       | https://git-scm.com           |
| VS Code                | 1.99+            | https://code.visualstudio.com |
| Copilot Chat extension | Latest           | VS Code marketplace           |

Verify your environment:

```powershell
node  --version   # v20.x.x
pnpm  --version   # 10.x.x
python --version  # 3.10+
git   --version
```

---

## Step 1 — Clone / open the workspace

```powershell
# If cloning from a repo
git clone <repo-url> c:\ComponentLiabery
cd c:\ComponentLiabery

# Or simply open the folder if it already exists
code c:\ComponentLiabery
```

> **Important:** Always open the workspace root `c:\ComponentLiabery` in VS Code, not a sub-folder. The `.vscode/mcp.json` config uses `${workspaceFolder}` which must resolve to the root.

---

## Step 2 — Install all JavaScript / TypeScript dependencies

```powershell
cd c:\ComponentLiabery
pnpm install
```

pnpm reads `pnpm-workspace.yaml` and installs dependencies for all packages simultaneously:

| Package              | Path                       | Role                          |
| -------------------- | -------------------------- | ----------------------------- |
| `@cl/tokens`         | `packages/tokens/`         | Style Dictionary token build  |
| `@cl/react`          | `packages/react/`          | React component library       |
| `@cl/web-components` | `packages/web-components/` | Framework-agnostic bundle     |
| `@cl/storybook`      | `apps/storybook/`          | Storybook dev environment     |
| `@cl/docs`           | `packages/docs/`           | Docusaurus documentation site |

After `pnpm install` completes, all `node_modules/` folders are populated via hard-links from the global pnpm store.

---

## Step 3 — Build the design tokens

All other packages depend on the token output (`packages/tokens/dist/tokens.css` and `tokens.json`), so this must be built first.

```powershell
pnpm build:tokens
# Equivalent: pnpm --filter @cl/tokens build
```

Outputs:

```
packages/tokens/dist/
├── tokens.css     ← CSS custom properties under :root {}
├── tokens.json    ← Nested JSON map for the MCP server
├── tokens.js      ← ESM module
└── tokens.d.ts    ← TypeScript declarations
```

---

## Step 4 — Build the React library

```powershell
pnpm build:react
# Equivalent: pnpm --filter @cl/react build
```

Outputs:

```
packages/react/dist/
├── index.es.js    ← ESM build
├── index.cjs.js   ← CommonJS build
└── styles.css     ← Component styles (tokens + Tailwind utilities)
```

---

## Step 5 — Build the Web Components bundle

```powershell
pnpm build:wc
# Equivalent: pnpm --filter @cl/web-components build
```

Outputs:

```
packages/web-components/dist/
├── custom-elements.js   ← Self-contained ESM (~771 kB, React bundled in)
└── custom-elements.css  ← Companion styles (~7.8 kB)
```

---

## Step 6 — Start Storybook

```powershell
pnpm dev:storybook
```

Opens the Storybook development server at **http://localhost:6006**.

Stories are in `apps/storybook/src/stories/`. Hot-reload is active.

---

## Step 7 — Start the Docs site

```powershell
pnpm dev:docs
```

Opens the Docusaurus site at **http://localhost:3000**.

Documentation source is in `packages/docs/docs/`. Hot-reload is active.

---

## Step 8 — Set up the Python MCP server

### 8a. Create the virtual environment

```powershell
cd c:\ComponentLiabery\mcp-server
python -m venv .venv
```

### 8b. Install the MCP SDK

```powershell
.venv\Scripts\pip install -r requirements.txt
```

`requirements.txt` pins `mcp>=1.0.0`. This installs **mcp 1.27.0** (FastMCP).

### 8c. Verify the install

```powershell
cd c:\ComponentLiabery
mcp-server\.venv\Scripts\python.exe -m py_compile mcp-server\main.py
mcp-server\.venv\Scripts\python.exe mcp-server\test_tools.py
```

Expected output of `test_tools.py`:

```
=== list_components ===
  PASS  returns 6 components
  ...

All tests passed!
```

### 8d. Register in VS Code

The file `.vscode/mcp.json` is already in the repo. VS Code reads it automatically when the workspace root is open.

To activate:

1. Press `Ctrl + Shift + P`
2. Type **MCP: Start Server**
3. Select **cl-components**

---

## Full build in one command

To build everything (tokens → react → web-components) in the correct order:

```powershell
pnpm build
```

The root `package.json` `build` script chains them in dependency order.

---

## Common problems

### `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`

A workspace package cannot find another. Check `pnpm-workspace.yaml` declares both `packages/*` and `apps/*`.

### `tokens.css not found` at Vite build time

Tokens were not built first. Run `pnpm build:tokens` before `pnpm build:react`.

### Storybook fails with "Vite version incompatible"

Storybook 8 supports **Vite ≤6** only. The `apps/storybook/` package has its own `vite@6` in its `package.json` — do not upgrade it to Vite 7/8 without checking Storybook compatibility.

### Python `ModuleNotFoundError: mcp`

The venv was not activated or `pip install` was not run. Repeat Step 8b.

### Docusaurus error: `Duplicate routes`

If you add a `src/pages/index.tsx` while `routeBasePath: '/'` is set in `docusaurus.config.ts`, Docusaurus will report a conflict. Remove the custom index page.

---

## Package dependency graph

```
@cl/tokens
    ↓ (dist/tokens.css, dist/tokens.json)
@cl/react  ──────────────────────────────────► @cl/storybook
    ↓ (src/ components imported directly)       (uses workspace:*)
@cl/web-components

@cl/tokens (dist/tokens.json)
    ↓
mcp-server/main.py
```
