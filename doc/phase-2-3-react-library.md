# Phase 2 + 3 — React Component Library

## Goal

Build `@cl/react`: a tree-shakeable React component library compiled to ES module and CommonJS bundles, styled with Tailwind CSS v4 and driven entirely by CL design tokens.

---

## What was built

| Artifact          | Path                                     |
| ----------------- | ---------------------------------------- |
| Package root      | `packages/react/`                        |
| Vite config       | `packages/react/vite.config.ts`          |
| Global styles     | `packages/react/src/styles/index.css`    |
| Base type system  | `packages/react/src/types/base.types.ts` |
| Public API barrel | `packages/react/src/index.ts`            |
| 6 components      | `packages/react/src/components/`         |
| Built outputs     | `packages/react/dist/`                   |

---

## 2.1 Package metadata

`packages/react/package.json` key fields:

```json
{
  "name": "@cl/react",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js",
  "exports": {
    ".": { "import": "./dist/index.es.js", "require": "./dist/index.cjs.js" },
    "./styles.css": "./dist/styles.css"
  },
  "peerDependencies": { "react": ">=19", "react-dom": ">=19" },
  "devDependencies": {
    "vite": "^8.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

Key choices:

- **`exports` map** — modern Node/bundler path. `@cl/react/styles.css` is a named export so consumers can import the stylesheet as a first-class module path.
- **`peerDependencies: react >=19`** — React is not bundled into the library; the host application provides it. This avoids duplicate React instances and reduces bundle size.

---

## 2.2 Vite library build

Vite is used in **library mode**, which produces a distributable package rather than a web application.

### `vite.config.ts`

```ts
export default defineConfig({
  plugins: [tailwindcss(), react()],
  publicDir: false, // no static assets for a library
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CLReact",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "es" : "cjs"}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        assetFileNames: (info) =>
          info.names?.some((n) => n.endsWith(".css"))
            ? "styles.css"
            : "[name][extname]",
      },
    },
    sourcemap: true,
    minify: false, // consumers minify; keeps debugging easy
  },
});
```

Why `minify: false`?

- Library consumers run their own minifier as part of their own build.
- Unminified distributable makes it easy to inspect the library source or debug unexpected behaviour.

Why `formats: ['es', 'cjs']`?

- **ES module** (`.es.js`) — for bundlers (Vite, webpack, Rollup) that understand static imports for tree-shaking.
- **CommonJS** (`.cjs.js`) — backward compatibility with Jest, Next.js pages router, and older toolchains.

---

## 2.3 Tailwind CSS v4

Tailwind v4 introduced a fundamentally different setup: **there is no `tailwind.config.js`**. Configuration is done entirely in CSS using `@import "tailwindcss"` and `@theme {}`.

### `packages/react/src/styles/index.css`

```css
/* 1. Import design tokens as CSS custom properties */
@import "../../tokens/dist/tokens.css";

/* 2. Activate Tailwind base + components + utilities */
@import "tailwindcss";

/* 3. Map CL tokens into Tailwind v4 theme variables */
@theme {
  --color-cl-primary: var(--cl-color-primary);
  --color-cl-primary-light: var(--cl-color-primary-light);
  --color-cl-primary-dark: var(--cl-color-primary-dark);
  /* ... all token categories */
}
```

The `@theme {}` block bridges two worlds:

- **`--cl-color-primary`** is a raw CSS custom property from `tokens.css`.
- **`--color-cl-primary`** is a Tailwind v4 theme variable. Once mapped, you can use `bg-cl-primary` as a Tailwind class, but in this library we use the raw CSS variable syntax directly in class strings (e.g. `bg-[var(--cl-color-primary)]`) for maximum flexibility.

Why use `bg-[var(--cl-color-primary)]` instead of `bg-cl-primary`?

- Explicit — the class reads exactly what CSS property it applies.
- Avoids Tailwind purge false negatives: dynamic class strings are not tree-shaken.
- Works identically whether or not Tailwind is in the consumer's project.

---

## 2.4 Base type system

### `CLBaseProps` interface

Every component extends `CLBaseProps` to share a common set of universal override props:

```ts
interface CLBaseProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  color?: string; // text / foreground color
  backgroundColor?: string;
  padding?: string; // CSS shorthand
  paddingX?: string; // horizontal only
  paddingY?: string; // vertical only
  width?: string;
  height?: string;
  "data-testid"?: string;
}
```

This gives users a predictable, component-agnostic API for one-off style adjustments.

### `resolveBaseStyle()` helper

```ts
function resolveBaseStyle(
  props: Omit<CLBaseProps, "id" | "className" | "data-testid">,
): CSSProperties {
  const style: CSSProperties = { ...props.style };
  if (props.color) style.color = props.color;
  if (props.backgroundColor) style.backgroundColor = props.backgroundColor;
  if (props.paddingX) {
    style.paddingLeft = props.paddingX;
    style.paddingRight = props.paddingX;
  }
  if (props.paddingY) {
    style.paddingTop = props.paddingY;
    style.paddingBottom = props.paddingY;
  }
  if (props.padding && !props.paddingX && !props.paddingY)
    style.padding = props.padding;
  if (props.width) style.width = props.width;
  if (props.height) style.height = props.height;
  return style;
}
```

Every component calls `resolveBaseStyle()` and spreads the result onto its root element's `style` prop. This keeps each component's JSX clean and ensures consistent prop-to-inline-style translation.

---

## 2.5 Barrel export: `src/index.ts`

```ts
import "./styles/index.css"; // side-effect: registers CSS with bundler

export type { CLBaseProps } from "./types/base.types";
export { resolveBaseStyle } from "./types/base.types";

export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
// ... all 6 components
```

The CSS import is at the top of the barrel so bundlers (Vite, webpack) capture it as a CSS side-effect and emit `styles.css` in the output.

Named exports for both the component function and its TypeScript interface allow consumers to use:

```ts
import { Button } from "@cl/react"; // tree-shaken — only Button bundled
import type { ButtonProps } from "@cl/react"; // type-only — zero runtime cost
```

---

## 3.1 Component architecture

All six components follow the same pattern:

```
packages/react/src/components/{Name}/
├── {Name}.tsx        ← component implementation
├── index.ts          ← re-export barrel
└── README.md         ← component documentation
```

### Anatomy of a component

Taking `Button` as a representative example:

```
1. Import types (HTMLButtonAttributes, CLBaseProps, resolveBaseStyle)
2. Define variant/size union types
3. Define Props interface extending CLBaseProps + native HTML element attributes
4. Define variant/size → Tailwind class maps (static objects, not inline logic)
5. Component function:
   a. Destructure all props (explicit, not rest-only) for clarity
   b. Call resolveBaseStyle() to compute inline styles
   c. Return native HTML element with:
      - Native attributes spread (accessibility, form integration)
      - className composed from: cl-component base, variant class, size class, custom className
      - style from resolveBaseStyle()
```

### Why native HTML elements?

Each component renders a semantic HTML element (`<button>`, `<input>`, `<select>`, `<textarea>`, `<ul>/<ol>`):

- Zero dependency on a UI framework or headless library.
- Native browser accessibility (keyboard, screen reader, form participation) for free.
- Easy to test with standard DOM APIs.

---

## 3.2 Component summary

### Button

Renders `<button>`. Four variants (primary / secondary / ghost / danger), three sizes (sm / md / lg), loading spinner state, and full-width layout.

The loading state renders a small animated spinner (SVG `<circle>` with `animate-spin`) and sets `disabled` automatically to prevent double-submits.

### TextBox

Renders `<div><label/><input type="text"/><p?/></div>`. The wrapper `<div>` holds the label, input, and optional helper/error text. The `onChange` prop is simplified to `(value: string) => void` — consumers receive the value directly, not the event.

### NumberBox

Identical structure to TextBox but uses `<input type="number">`. The `onChange` callback uses `e.target.valueAsNumber` so consumers always receive a `number`, not a string.

### Select

Renders `<div><label/><div.relative><select/><span.chevron/></div></div>`. Options are passed as `SelectOption[]` data (not JSX children), enabling data-driven usage and Web Component compatibility. A custom SVG chevron replaces the browser's native dropdown arrow via `appearance-none` + absolute-positioned icon.

### TextArea

Renders `<div><label-row/><textarea/><p?/></div>`. The label row conditionally shows a character counter (`{length}/{maxLength}`) when `showCount` and `maxLength` are both set. `resize` maps to Tailwind's `resize-none`, `resize-y`, `resize-x`, or `resize` classes.

### List

Renders `<ul>` or `<ol>` depending on `variant`. The `descriptive` variant uses the same `<ul>` but each `<li>` can show a `description` paragraph below the label. When `selectable` is `true`, items get `role="option"` and `aria-selected`, turning the list into an accessible listbox.

---

## 3.3 Shared patterns across all components

| Pattern                | How it's implemented                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| CSS-token-only styling | All colours, sizes, radii use `var(--cl-*)` — no hard-coded hex values                                  |
| Focus ring             | `focus:ring-2 focus:ring-[var(--cl-color-focus-ring)]` on every interactive element                     |
| Error state            | `border-[var(--cl-color-error)]` + `text-[var(--cl-color-error)]` on the message `<p>`                  |
| Disabled state         | `disabled:opacity-50 disabled:cursor-not-allowed` applied as Tailwind modifier                          |
| `data-testid`          | Forwarded from `CLBaseProps` to the interactive element's `data-testid` attribute                       |
| `className` merge      | All class strings are joined with a simple `.filter(Boolean).join(' ')` — no external `clsx` dependency |

---

## 3.4 Tree-shaking

Because each component is a named export and no component imports from another, bundlers can include only the components actually used:

```ts
import { Button } from "@cl/react";
// Only Button's code ends up in the consumer's bundle
```
