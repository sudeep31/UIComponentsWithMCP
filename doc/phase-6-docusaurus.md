# Phase 6 — Docusaurus Documentation Site

## Goal

Build a public-facing documentation website using **Docusaurus 3** that covers installation, design tokens, all six components (React + Web Component usage), web component framework integrations, and the MCP server setup.

---

## What was built

| Artifact            | Path                                     |
| ------------------- | ---------------------------------------- |
| Docs package        | `packages/docs/`                         |
| Docusaurus config   | `packages/docs/docusaurus.config.ts`     |
| Sidebar config      | `packages/docs/sidebars.ts`              |
| Brand CSS           | `packages/docs/src/css/custom.css`       |
| Documentation pages | `packages/docs/docs/` (8 Markdown files) |

---

## 6.1 Technology choices

### Docusaurus 3 (classic preset)

Docusaurus is Meta's open-source documentation framework built on React. The classic preset provides:

- Markdown/MDX page authoring.
- Versioning support.
- Full-text search integration.
- Built-in syntax highlighting (Prism).
- Responsive theme with dark mode.

### `@docusaurus/faster` (Rspack)

Docusaurus 3.3+ ships an optional `@docusaurus/faster` plugin that replaces the default webpack bundler with **Rspack** (a Rust-based webpack-compatible bundler). This is enabled by the `future: { v4: true }` flag in the config.

The result: cold start build times are 3–5× faster than with webpack, which is significant for large doc sites.

---

## 6.2 `docusaurus.config.ts`

### `routeBasePath: '/'`

```ts
docs: {
  sidebarPath: './sidebars.ts',
  routeBasePath: '/',   // docs root IS the site root
},
blog: false,
```

Setting `routeBasePath: '/'` moves all documentation pages to the root of the site (e.g. `/getting-started` instead of `/docs/getting-started`). Combined with `blog: false`, this removes the default landing page and blog routes.

> **Critical:** With `routeBasePath: '/'`, you must **not** have a `src/pages/index.tsx` file. Docusaurus will report a "duplicate routes" error because both `routeBasePath` and the custom page would try to claim `/`. The default `src/pages/` files (`index.tsx`, `index.module.css`, `markdown-page.mdx`) must be deleted.

### Color mode

```ts
colorMode: {
  defaultMode: 'light',
  respectPrefersColorScheme: true,
},
```

The site defaults to light mode but respects the operating system preference if the user has not manually toggled.

### Navbar

```ts
items: [
  { type: "docSidebar", sidebarId: "mainSidebar", label: "Docs" },
  { href: "http://localhost:6006", label: "Storybook", position: "right" },
];
```

A direct link to the Storybook instance gives developers a one-click path from documentation to the interactive sandbox.

### Footer style

```ts
footer: {
  style: "light";
}
```

Infima (Docusaurus's CSS framework) renders the footer in light mode. Using `style: 'dark'` would invert the footer colours regardless of the page's color mode.

### Removed config option: `onBrokenMarkdownLinks`

In Docusaurus v3/v4, `onBrokenMarkdownLinks` was moved to `markdown.hooks`. Using the old top-level key triggers a deprecation warning and in some versions an error. It is omitted from this config.

---

## 6.3 Brand customization: `src/css/custom.css`

Docusaurus uses **Infima**, a CSS framework with a token-based theming system. The primary color is overridden to match the CL brand blue:

```css
:root {
  --ifm-color-primary: #4f81f5;
  --ifm-color-primary-dark: #2d5dd4;
  --ifm-color-primary-darker: #2354cc;
  --ifm-color-primary-darkest: #1a40b3;
  --ifm-color-primary-light: #71a0f7;
  --ifm-color-primary-lighter: #8ab4f9;
  --ifm-color-primary-lightest: #b3ccfb;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}
```

These match the `--cl-color-primary` (#4F81F5) and `--cl-color-primary-dark` (#2D5DD4) design tokens so the docs site feels visually consistent with the component library.

---

## 6.4 Sidebar: `sidebars.ts`

```ts
const sidebars: SidebarsConfig = {
  mainSidebar: [
    "getting-started",
    "design-tokens",
    {
      type: "category",
      label: "Components",
      collapsed: false,
      items: [
        "components/button",
        "components/textbox",
        "components/numberbox",
        "components/select",
        "components/textarea",
        "components/list",
      ],
    },
    "web-components",
    "mcp-server",
  ],
};
```

- The **Components category** is `collapsed: false` so all 6 component links are visible in the sidebar without a click.
- Each string in the `items` array refers to the `id` field in the corresponding Markdown file's frontmatter, or defaults to the file path relative to `docs/`.

---

## 6.5 Documentation pages

### `docs/getting-started.md`

Covers installation (`pnpm add @cl/react`), styles import, first component usage, and a component quick-reference table.

### `docs/design-tokens.md`

Full tables for all 7 token categories (color, spacing, font, radius, shadow, transition, z-index) with token names, values, and descriptions. Explains how to override tokens with CSS custom property re-declarations.

### `docs/components/*.md` (6 files)

Each component doc page follows the same structure:

1. One-line description
2. Props table (name, type, default, description)
3. React usage code block
4. Web Component usage code block

### `docs/web-components.md`

Framework integration guides for Plain HTML, Angular, Vue 3, and Svelte. Includes the array prop note (JSON stringify for `options` and `items`).

### `docs/mcp-server.md`

Installation steps, VS Code `mcp.json` config, tools table, and example Copilot Chat prompts.

---

## 6.6 Running the docs site

```powershell
pnpm dev:docs
# Opens http://localhost:3000
```

Changes to `.md` files hot-reload in the browser instantly.

To build the static site for deployment:

```powershell
pnpm --filter @cl/docs build
# Output: packages/docs/build/
```

The static output can be deployed to any CDN (Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront) without a server.

---

## 6.7 Key problem resolutions

### Duplicate routes error

**Problem:** Docusaurus reported `ERROR: Two routes are using the path /` on startup.  
**Cause:** `src/pages/index.tsx` (the default Docusaurus landing page) conflicts with `routeBasePath: '/'`.  
**Fix:** Deleted `src/pages/index.tsx`, `index.module.css`, and `markdown-page.mdx`.

### `onBrokenMarkdownLinks` deprecation

**Problem:** Using `onBrokenMarkdownLinks: 'warn'` at the top level of `docusaurus.config.ts` caused a warning/error in Docusaurus 3.x.  
**Fix:** Removed the key entirely. The default behaviour (warn on broken links) is acceptable for this project.
