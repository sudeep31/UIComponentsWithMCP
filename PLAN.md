# CL (Component Library) — Full Project Plan

## Project Identity

| Field                 | Value                                                  |
| --------------------- | ------------------------------------------------------ |
| Library name          | **CL (Component Library)**                             |
| NPM scope             | `@cl`                                                  |
| Custom Element prefix | `cl-`                                                  |
| Package manager       | pnpm 9 + Node 20 LTS                                   |
| Root workspace        | `c:\ComponentLiabery`                                  |
| Language              | TypeScript 5                                           |
| Styling               | Tailwind CSS 3 + CSS Custom Properties (design tokens) |
| Build tool            | Vite 5 (library mode)                                  |

---

## Key Architectural Decisions

| Concern          | Decision                                | Reason                                                                        |
| ---------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| Framework export | Web Components via `@r2wc`              | Works in Angular, Vue, Svelte, plain HTML — no React dependency for consumers |
| Design tokens    | Style Dictionary → CSS Variables + JSON | Framework-agnostic; consumed by Tailwind, plain CSS, and the MCP server       |
| Dev sandbox      | Storybook 8                             | Interactive Controls per component, a11y checks                               |
| Public docs      | Docusaurus 3                            | Static site with MDX, auto token tables from JSON                             |
| MCP server       | Python 3.11 + official `mcp` SDK        | Stdio process; integrates with VS Code mcp.json for GitHub Copilot Chat       |
| Color scheme     | Light by default                        | Soft blues / violets on neutral whites/grays                                  |

---

## Repository Structure

```
c:\ComponentLiabery\
│
├── PLAN.md                      ← this file
├── pnpm-workspace.yaml          # declares workspace packages
├── package.json                 # root — scripts only, no deps
├── tsconfig.base.json           # shared TS config
│
├── packages/
│   ├── tokens/                  # @cl/tokens — Style Dictionary
│   │   ├── src/
│   │   │   └── tokens.json      # single source of truth for all tokens
│   │   ├── sd.config.js         # Style Dictionary config
│   │   └── package.json
│   │
│   ├── react/                   # @cl/react — React components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── TextBox/
│   │   │   │   ├── NumberBox/
│   │   │   │   ├── Select/
│   │   │   │   ├── TextArea/
│   │   │   │   └── List/
│   │   │   ├── types/
│   │   │   │   └── base.types.ts   # CLBaseProps shared interface
│   │   │   ├── tokens.css           # imports @cl/tokens dist
│   │   │   └── index.ts             # barrel export
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── web-components/          # @cl/web-components — Custom Elements
│   │   ├── src/
│   │   │   └── index.ts         # @r2wc wrappers for each component
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── docs/                    # @cl/docs — Docusaurus site
│       ├── docs/
│       │   ├── getting-started.md
│       │   ├── design-tokens.md
│       │   └── components/
│       │       ├── button.md
│       │       ├── textbox.md
│       │       ├── numberbox.md
│       │       ├── select.md
│       │       ├── textarea.md
│       │       └── list.md
│       └── package.json
│
├── apps/
│   └── storybook/               # Storybook sandbox app
│       ├── stories/
│       │   ├── Button.stories.tsx
│       │   ├── TextBox.stories.tsx
│       │   ├── NumberBox.stories.tsx
│       │   ├── Select.stories.tsx
│       │   ├── TextArea.stories.tsx
│       │   └── List.stories.tsx
│       └── package.json
│
└── mcp-server/                  # Python MCP server
    ├── main.py
    ├── components/
    │   └── manifests/
    │       ├── button.json
    │       ├── textbox.json
    │       ├── numberbox.json
    │       ├── select.json
    │       ├── textarea.json
    │       └── list.json
    ├── requirements.txt
    └── mcp.json.example          # VS Code .vscode/mcp.json snippet
```

---

## Phase 1 — Monorepo Scaffold + Design Tokens

### Goals

- pnpm workspace root with shared scripts
- `@cl/tokens` package with Style Dictionary
- All design tokens defined in one JSON source
- Outputs: `tokens.css` (CSS custom properties) + `tokens.json` (flat map)

### Token Categories

#### Colors — Light Scheme (Default)

| Token Name    | CSS Variable               | Default Value |
| ------------- | -------------------------- | ------------- |
| Primary       | `--cl-color-primary`       | `#4F81F5`     |
| Primary Light | `--cl-color-primary-light` | `#EBF0FE`     |
| Primary Dark  | `--cl-color-primary-dark`  | `#2D5DD4`     |
| Secondary     | `--cl-color-secondary`     | `#7C6AF5`     |
| Neutral 50    | `--cl-color-neutral-50`    | `#F9FAFB`     |
| Neutral 100   | `--cl-color-neutral-100`   | `#F3F4F6`     |
| Neutral 200   | `--cl-color-neutral-200`   | `#E5E7EB`     |
| Neutral 500   | `--cl-color-neutral-500`   | `#6B7280`     |
| Neutral 900   | `--cl-color-neutral-900`   | `#111827`     |
| Success       | `--cl-color-success`       | `#34D399`     |
| Error         | `--cl-color-error`         | `#F87171`     |
| Warning       | `--cl-color-warning`       | `#FBBF24`     |
| Surface       | `--cl-color-surface`       | `#FFFFFF`     |
| Border        | `--cl-color-border`        | `#E5E7EB`     |

#### Spacing Scale

| Token | CSS Variable       | Value  |
| ----- | ------------------ | ------ |
| xs    | `--cl-spacing-xs`  | `4px`  |
| sm    | `--cl-spacing-sm`  | `8px`  |
| md    | `--cl-spacing-md`  | `12px` |
| lg    | `--cl-spacing-lg`  | `16px` |
| xl    | `--cl-spacing-xl`  | `24px` |
| 2xl   | `--cl-spacing-2xl` | `32px` |
| 3xl   | `--cl-spacing-3xl` | `48px` |

#### Typography

| Token           | CSS Variable                | Value                            |
| --------------- | --------------------------- | -------------------------------- |
| Font Family     | `--cl-font-family`          | `'Inter', system-ui, sans-serif` |
| Size xs         | `--cl-font-size-xs`         | `12px`                           |
| Size sm         | `--cl-font-size-sm`         | `14px`                           |
| Size md         | `--cl-font-size-md`         | `16px`                           |
| Size lg         | `--cl-font-size-lg`         | `18px`                           |
| Size xl         | `--cl-font-size-xl`         | `24px`                           |
| Weight normal   | `--cl-font-weight-normal`   | `400`                            |
| Weight medium   | `--cl-font-weight-medium`   | `500`                            |
| Weight semibold | `--cl-font-weight-semibold` | `600`                            |
| Weight bold     | `--cl-font-weight-bold`     | `700`                            |

#### Border Radius & Shadow

| Token       | CSS Variable       | Value                          |
| ----------- | ------------------ | ------------------------------ |
| Radius sm   | `--cl-radius-sm`   | `4px`                          |
| Radius md   | `--cl-radius-md`   | `6px`                          |
| Radius lg   | `--cl-radius-lg`   | `8px`                          |
| Radius full | `--cl-radius-full` | `9999px`                       |
| Shadow sm   | `--cl-shadow-sm`   | `0 1px 2px rgba(0,0,0,0.05)`   |
| Shadow md   | `--cl-shadow-md`   | `0 4px 6px rgba(0,0,0,0.07)`   |
| Shadow lg   | `--cl-shadow-lg`   | `0 10px 15px rgba(0,0,0,0.10)` |

### Verification

```
pnpm --filter @cl/tokens build
# Expected: packages/tokens/dist/tokens.css + dist/tokens.json
```

---

## Phase 2 — React Library Scaffold

### Goals

- Vite in library mode → ESM + CJS + `.d.ts` type declarations
- Tailwind configured to use token CSS vars
- Peer deps: `react ^18`, `react-dom ^18`

### Shared Base Props (CLBaseProps) — Every Component Inherits These

| Prop              | Type            | Description           |
| ----------------- | --------------- | --------------------- |
| `id`              | `string`        | HTML id               |
| `className`       | `string`        | Extra CSS classes     |
| `style`           | `CSSProperties` | Inline style override |
| `color`           | `string`        | Text/foreground color |
| `backgroundColor` | `string`        | Background color      |
| `padding`         | `string`        | CSS shorthand padding |
| `paddingX`        | `string`        | Horizontal padding    |
| `paddingY`        | `string`        | Vertical padding      |
| `width`           | `string`        | CSS width             |
| `height`          | `string`        | CSS height            |
| `data-testid`     | `string`        | Testing selector      |

### Verification

```
pnpm --filter @cl/react build
# Expected: packages/react/dist/index.es.js + index.cjs.js + index.d.ts
```

---

## Phase 3 — Core Components

### 3a — Button

| Prop        | Type                                      | Default   | Description   |
| ----------- | ----------------------------------------- | --------- | ------------- |
| `variant`   | `primary \| secondary \| ghost \| danger` | `primary` | Visual style  |
| `size`      | `sm \| md \| lg`                          | `md`      | Size preset   |
| `label`     | `string`                                  | —         | Button text   |
| `disabled`  | `boolean`                                 | `false`   |               |
| `loading`   | `boolean`                                 | `false`   | Shows spinner |
| `fullWidth` | `boolean`                                 | `false`   | 100% width    |
| `onClick`   | `(e: MouseEvent) => void`                 | —         |               |
| `type`      | `button \| submit \| reset`               | `button`  |               |

Web Component: `<cl-button>`

---

### 3b — TextBox

| Prop                 | Type                      | Default | Description   |
| -------------------- | ------------------------- | ------- | ------------- |
| `label`              | `string`                  | —       | Field label   |
| `placeholder`        | `string`                  | —       |               |
| `value`              | `string`                  | —       | Controlled    |
| `defaultValue`       | `string`                  | —       | Uncontrolled  |
| `disabled`           | `boolean`                 | `false` |               |
| `readOnly`           | `boolean`                 | `false` |               |
| `error`              | `string`                  | —       | Error message |
| `helperText`         | `string`                  | —       | Hint text     |
| `required`           | `boolean`                 | `false` |               |
| `maxLength`          | `number`                  | —       |               |
| `onChange`           | `(value: string) => void` | —       |               |
| `onBlur` / `onFocus` | `(e) => void`             | —       |               |

Web Component: `<cl-textbox>`

---

### 3c — NumberBox

All TextBox props, plus:

| Prop       | Type                      | Default |
| ---------- | ------------------------- | ------- |
| `min`      | `number`                  | —       |
| `max`      | `number`                  | —       |
| `step`     | `number`                  | `1`     |
| `value`    | `number`                  | —       |
| `onChange` | `(value: number) => void` | —       |

Web Component: `<cl-numberbox>`

---

### 3d — Select (Dropdown)

| Prop          | Type                                                     | Default       | Description |
| ------------- | -------------------------------------------------------- | ------------- | ----------- |
| `label`       | `string`                                                 | —             |             |
| `options`     | `{ value: string; label: string; disabled?: boolean }[]` | `[]`          |             |
| `value`       | `string`                                                 | —             | Controlled  |
| `placeholder` | `string`                                                 | `'Select...'` |             |
| `disabled`    | `boolean`                                                | `false`       |             |
| `error`       | `string`                                                 | —             |             |
| `helperText`  | `string`                                                 | —             |             |
| `required`    | `boolean`                                                | `false`       |             |
| `onChange`    | `(value: string) => void`                                | —             |             |

Web Component: `<cl-select>`

---

### 3e — TextArea

All TextBox props, plus:

| Prop        | Type                                     | Default    |
| ----------- | ---------------------------------------- | ---------- |
| `rows`      | `number`                                 | `4`        |
| `resize`    | `none \| vertical \| horizontal \| both` | `vertical` |
| `showCount` | `boolean`                                | `false`    |

Web Component: `<cl-textarea>`

---

### 3f — List

| Prop         | Type                                                    | Default     | Description           |
| ------------ | ------------------------------------------------------- | ----------- | --------------------- |
| `items`      | `{ id: string; label: string; description?: string }[]` | `[]`        |                       |
| `variant`    | `unordered \| ordered \| descriptive`                   | `unordered` |                       |
| `selectable` | `boolean`                                               | `false`     | Hover + active states |
| `selectedId` | `string`                                                | —           | Controlled selection  |
| `onSelect`   | `(id: string) => void`                                  | —           |                       |
| `dividers`   | `boolean`                                               | `false`     | Lines between items   |
| `compact`    | `boolean`                                               | `false`     | Reduced padding       |

Web Component: `<cl-list>`

---

## Phase 4 — Web Components Export

- `@r2wc` wraps each React component into a native Custom Element
- Single ESM bundle: `packages/web-components/dist/custom-elements.js`
- Self-contained (React runtime bundled in)
- Prop mapping: camelCase React props → hyphenated or lowercase HTML attributes

**Angular usage:**

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
```

**Vue usage:**

```javascript
// vite.config.js
vue({
  template: {
    compilerOptions: { isCustomElement: (tag) => tag.startsWith("cl-") },
  },
});
```

**Plain HTML:**

```html
<script type="module" src="custom-elements.js"></script>
<cl-button label="Click me" variant="primary"></cl-button>
```

### Verification

```
pnpm --filter @cl/web-components build
# Drop dist/custom-elements.js into a plain HTML file — all 6 components render
```

---

## Phase 5 — Storybook

- Storybook 8 with Vite builder
- One `.stories.tsx` file per component
- Each story includes:
  - Default story (all props at defaults)
  - Variant matrix (all variant combinations as a grid)
  - **Controls addon** — every prop editable from sidebar
- **A11y addon** — accessibility audit per story
- Token theme preview panel

### Verification

```
pnpm --filter storybook dev
# All 6 components visible at http://localhost:6006 with live Controls
```

---

## Phase 6 — Docusaurus Public Docs

### Pages

1. **Getting Started** — install, import tokens CSS, first component example
2. **Design Tokens** — table auto-rendered from `tokens.json` at build time
3. **Button / TextBox / NumberBox / Select / TextArea / List** — prop table, React + Web Component snippets, iframe to Storybook story
4. **Web Components Guide** — Angular, Vue, Svelte, plain HTML integration
5. **MCP Server Setup** — how to add to `mcp.json`, example Copilot prompts

### Verification

```
pnpm --filter @cl/docs start
# Docs site loads at http://localhost:3000
```

---

## Phase 7 — Python MCP Server

### Tools

| Tool                    | Inputs                                                            | Output                         |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------ |
| `list_components`       | none                                                              | `[{ name, tag, description }]` |
| `get_component_props`   | `component: str`                                                  | Full prop schema JSON          |
| `get_component_snippet` | `component: str, flavor: "react"\|"webcomponent"`                 | Code snippet string            |
| `get_design_tokens`     | `category?: "color"\|"spacing"\|"typography"\|"shadow"\|"radius"` | Filtered token map             |

### Data Sources

- `packages/tokens/dist/tokens.json` — read at runtime
- `mcp-server/components/manifests/*.json` — prop schemas per component

### VS Code Integration

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "cl-components": {
      "type": "stdio",
      "command": "python",
      "args": ["mcp-server/main.py"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

Example Copilot Chat prompts:

- _"List all CL components"_
- _"What props does cl-button accept?"_
- _"Show me a React snippet for cl-select"_
- _"What are the color design tokens?"_

### Verification

- Add `mcp.json` to VS Code
- Open Copilot Chat → ask `"What components are available in the CL library?"`
- Copilot responds with the component list from `list_components`

---

## Implementation Checklist

### Phase 1 — Monorepo + Tokens

- [ ] pnpm workspace root (`package.json` + `pnpm-workspace.yaml`)
- [ ] `tsconfig.base.json`
- [ ] `packages/tokens/package.json`
- [ ] `packages/tokens/src/tokens.json` — full token definitions
- [ ] `packages/tokens/sd.config.js` — Style Dictionary config
- [ ] Build passes: `dist/tokens.css` + `dist/tokens.json` generated

### Phase 2 — React Library

- [ ] `packages/react/` scaffolded with Vite + Tailwind
- [ ] `CLBaseProps` interface defined
- [ ] Tailwind config wired to token CSS vars
- [ ] Build passes: ESM + CJS + types output

### Phase 3 — Components

- [ ] Button
- [ ] TextBox
- [ ] NumberBox
- [ ] Select
- [ ] TextArea
- [ ] List
- [ ] All accept `CLBaseProps` + component-specific props

### Phase 4 — Web Components

- [ ] `@r2wc` wrappers for all 6 components
- [ ] Single `custom-elements.js` bundle
- [ ] Plain HTML verification file

### Phase 5 — Storybook

- [ ] Scaffolded with Vite builder
- [ ] Stories for all 6 components
- [ ] Controls + A11y addons active

### Phase 6 — Docusaurus

- [ ] Site scaffolded
- [ ] Token table page
- [ ] All 6 component pages with prop tables

### Phase 7 — MCP Server

- [ ] Python venv + `mcp` SDK installed
- [ ] `main.py` with 4 tools
- [ ] Component manifests JSON (6 files)
- [ ] VS Code `mcp.json` working
- [ ] Copilot Chat responds to component queries

---

## Terminal Commands Reference

```powershell
# Phase 1 — Monorepo root
cd c:\ComponentLiabery
pnpm init

# Tokens package
mkdir packages\tokens
cd packages\tokens
pnpm init
pnpm add -D style-dictionary

# Phase 2 — React package
cd c:\ComponentLiabery\packages
pnpm create vite react --template react-ts
cd react
pnpm add -D tailwindcss postcss autoprefixer
pnpm add react react-dom
npx tailwindcss init -p

# Phase 4 — Web Components package
cd c:\ComponentLiabery\packages
mkdir web-components
cd web-components
pnpm init
pnpm add @r2wc/react-to-web-component
pnpm add -D vite @vitejs/plugin-react typescript

# Phase 5 — Storybook
mkdir c:\ComponentLiabery\apps
cd c:\ComponentLiabery\apps
mkdir storybook
cd storybook
pnpm dlx storybook@latest init --type react

# Phase 6 — Docusaurus
cd c:\ComponentLiabery\packages
pnpm dlx create-docusaurus@latest docs classic --typescript

# Phase 7 — Python MCP Server
cd c:\ComponentLiabery
mkdir mcp-server
cd mcp-server
python -m venv .venv
.venv\Scripts\activate
pip install mcp
```
