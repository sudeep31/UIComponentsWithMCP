# Phase 1 — Monorepo Scaffold & Design Tokens

## Goal

Establish the project foundation: a pnpm workspace monorepo and a single-source-of-truth design token pipeline that all other packages consume.

---

## What was built

| Artifact                | Path                              |
| ----------------------- | --------------------------------- |
| Workspace root          | `c:\ComponentLiabery\`            |
| Workspace config        | `pnpm-workspace.yaml`             |
| Shared TypeScript base  | `tsconfig.base.json`              |
| Tokens package          | `packages/tokens/` (`@cl/tokens`) |
| Token source            | `packages/tokens/src/tokens.json` |
| Style Dictionary config | `packages/tokens/sd.config.js`    |
| Built outputs           | `packages/tokens/dist/`           |

---

## 1.1 Monorepo structure

The project uses **pnpm workspaces** to manage multiple packages from a single root.

### `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

This tells pnpm that any folder directly inside `packages/` or `apps/` is a workspace package. Running `pnpm install` at the root installs all dependencies for every package simultaneously and links inter-package dependencies by symlink (e.g. `@cl/react` can import `@cl/tokens` without publishing to npm).

### `package.json` (root)

```json
{
  "name": "@cl/root",
  "private": true,
  "scripts": {
    "build": "pnpm build:tokens && pnpm build:react && pnpm build:wc",
    "build:tokens": "pnpm --filter @cl/tokens build",
    "build:react": "pnpm --filter @cl/react build",
    "build:wc": "pnpm --filter @cl/web-components build",
    "dev:storybook": "pnpm --filter @cl/storybook dev",
    "dev:docs": "pnpm --filter @cl/docs start"
  }
}
```

`--filter @cl/tokens` tells pnpm to run the command only inside the `packages/tokens/` workspace package. The root `build` script chains the three build-order-sensitive packages.

### `tsconfig.base.json`

Shared TypeScript compiler settings extended by every package:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

Key choices:

- **`moduleResolution: bundler`** — matches Vite's resolution algorithm; enables bare-specifier imports and path aliases without extra configuration.
- **`declaration: true` + `declarationMap: true`** — generates `.d.ts` files so consumers get full intellisense.

---

## 1.2 Design tokens

Design tokens are the single source of truth for all visual values in the library. Storing them centrally means:

- One change propagates to CSS, JavaScript, TypeScript declarations, and the MCP server simultaneously.
- Application teams can override individual tokens with CSS custom property overrides without touching component code.

### Token source: `packages/tokens/src/tokens.json`

All tokens are defined using the [W3C Design Token Community Group](https://design-tokens.github.io/community-group/format/) format (`$value`, `$type`, `$description`):

```json
{
  "color": {
    "primary": {
      "$value": "#4F81F5",
      "$type": "color",
      "$description": "Main brand blue — buttons, links, focus rings"
    },
    "primary-light": { "$value": "#EBF0FE", ... },
    "primary-dark":  { "$value": "#2D5DD4", ... },
    ...
  },
  "spacing": {
    "xs": { "$value": "4px",  "$type": "dimension" },
    "sm": { "$value": "8px",  "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "24px", "$type": "dimension" },
    "xl": { "$value": "32px", "$type": "dimension" }
  },
  "font": { ... },
  "radius": { ... },
  "shadow": { ... },
  "transition": { ... },
  "z-index": { ... }
}
```

Token categories:

| Category     | Purpose                                          |
| ------------ | ------------------------------------------------ |
| `color`      | All brand, neutral, semantic, and state colors   |
| `spacing`    | Consistent spacing scale (xs → xl)               |
| `font`       | Font size, weight, line-height, family           |
| `radius`     | Corner radius per size (sm / md / lg / full)     |
| `shadow`     | Box shadow levels (sm / md / lg)                 |
| `transition` | Duration presets (fast / normal / slow)          |
| `z-index`    | Layering scale (base / dropdown / modal / toast) |

---

## 1.3 Style Dictionary v5

**Style Dictionary** (by Amazon) reads the token source and transforms it into every output format the project needs.

### Why Style Dictionary?

- Platform-agnostic: one config produces CSS, JSON, JS, and TypeScript from the same source.
- Built-in transforms handle color format conversion, naming conventions, and comment generation.
- v5 supports native ESM config files (`sd.config.js` with `"type": "module"` in `package.json`).

### `packages/tokens/sd.config.js`

```js
import StyleDictionary from "style-dictionary";

const sd = new StyleDictionary({
  source: ["src/tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "cl", // all CSS vars are prefixed --cl-
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: { selector: ":root", outputReferences: false },
        },
      ],
    },
    json: {
      transformGroup: "js",
      prefix: "cl",
      buildPath: "dist/",
      files: [{ destination: "tokens.json", format: "json/nested" }],
    },
    js: {
      transformGroup: "js",
      prefix: "cl",
      buildPath: "dist/",
      files: [
        { destination: "tokens.js", format: "javascript/es6" },
        { destination: "tokens.d.ts", format: "typescript/es6-declarations" },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
```

Key decisions:

- **`prefix: "cl"`** — every CSS variable becomes `--cl-color-primary`, `--cl-spacing-md`, etc. This namespaces the library to avoid collisions with host application variables.
- **`transformGroup: "css"`** — applies the full chain of CSS-appropriate transforms (kebab-case names, CSS value formatting).
- **`outputReferences: false`** — all tokens are emitted as resolved values, not `var()` references. This means consumers can use `tokens.css` standalone without needing any other file.
- **`selector: ":root"`** — CSS variables are globally available as custom properties.

### Build outputs

```
packages/tokens/dist/
├── tokens.css     ← :root { --cl-color-primary: #4F81F5; ... }
├── tokens.json    ← { "cl": { "color": { "primary": { "value": "#4F81F5" } } } }
├── tokens.js      ← export const clColorPrimary = "#4F81F5";
└── tokens.d.ts    ← declare const clColorPrimary: string; export { ... }
```

---

## 1.4 Why no `@tokens-studio/sd-transforms`?

Tokens Studio is a Figma plugin that stores tokens in a proprietary format requiring a special Style Dictionary plugin (`@tokens-studio/sd-transforms`). This project intentionally avoids that dependency to keep the pipeline simpler and more maintainable. The W3C format used here (`$value`, `$type`) is the emerging open standard.

---

## 1.5 How other packages consume tokens

**`@cl/react`** imports the built CSS file in its global stylesheet:

```css
@import "../../tokens/dist/tokens.css";
```

This works in the pnpm workspace because both packages live under `packages/` and Vite resolves the relative path at build time.

**The MCP server** reads `packages/tokens/dist/tokens.json` directly with Python's `json` module, enabling Copilot Chat to answer questions about token values.

---

## 1.6 Overriding tokens in a host application

Consumers can override any token by re-declaring it after importing the library styles:

```css
/* app.css */
@import "@cl/react/styles.css";

:root {
  --cl-color-primary: #e53e3e; /* switch brand to red */
  --cl-radius-md: 0px; /* make all components square */
}
```

All components pick up the new values automatically — no component code changes required.
