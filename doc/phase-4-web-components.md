# Phase 4 — Web Components

## Goal

Export all six React components as native **Custom Elements** (Web Components) in a single self-contained JavaScript bundle. The bundle must work in any framework — Angular, Vue, Svelte — or in plain HTML with no build tool.

---

## What was built

| Artifact     | Path                                                         |
| ------------ | ------------------------------------------------------------ |
| Package root | `packages/web-components/`                                   |
| Vite config  | `packages/web-components/vite.config.ts`                     |
| Entry point  | `packages/web-components/src/index.ts`                       |
| Test page    | `packages/web-components/test/index.html`                    |
| ESM bundle   | `packages/web-components/dist/custom-elements.js` (~771 kB)  |
| Style output | `packages/web-components/dist/custom-elements.css` (~7.8 kB) |

---

## 4.1 Why Web Components?

React component libraries are first-class citizens in React apps, but they are painful to use in:

- **Angular** — requires a special `CUSTOM_ELEMENTS_SCHEMA` and wrapper components
- **Vue** — React JSX is not understood natively
- **Svelte** — different compiler pipeline entirely
- **Plain HTML / CMS** — no build tool, no framework

Web Components (Custom Elements v1) are a W3C standard supported by all modern browsers. Any framework can consume them as if they were regular HTML elements.

---

## 4.2 @r2wc/react-to-web-component

The [`@r2wc/react-to-web-component`](https://github.com/bitovi/react-to-web-component) library (v2.1.1) converts a React component into a Custom Element class. It:

1. Creates a shadow DOM root (or uses the light DOM if `shadow: false`).
2. Mounts the React component inside the shadow root.
3. Maps HTML attributes to React props via a declared prop schema.
4. Forwards DOM events from the React component through the shadow root.

### Shadow DOM mode

This project uses **open shadow DOM** (`shadow: 'open'`). Open mode allows external CSS and JavaScript to access the shadow root via `element.shadowRoot`.

---

## 4.3 Prop type schema

HTML attributes are always strings. React props can be strings, numbers, booleans, arrays, or functions. `@r2wc` needs an explicit mapping to perform the conversion.

```ts
const CLButton = r2wc(Button, {
  shadow: "open",
  props: {
    variant: String,
    size: String,
    label: String,
    loading: Boolean,
    fullWidth: Boolean,
    disabled: Boolean,
    onClick: Function,
    // ... base props
    color: String,
    backgroundColor: String,
    width: String,
  },
});
```

- **`Boolean`** — r2wc treats the presence of the attribute (or the string `"true"`) as `true`.
- **`Function`** — r2wc creates a DOM event listener named after the prop (`onclick`) and converts it to the React callback.
- **`Array`** — r2wc accepts a JSON-encoded string from the attribute and parses it: `el.items = JSON.stringify([...])`.

---

## 4.4 Custom element registration

```ts
if (!customElements.get("cl-button")) {
  customElements.define("cl-button", CLButton);
}
```

The `customElements.get()` guard prevents "already defined" errors when the bundle is loaded more than once on the same page (e.g. in micro-frontend architectures or when two different script tags load the bundle).

### Custom element tag names

| React component | Custom element tag |
| --------------- | ------------------ |
| `Button`        | `cl-button`        |
| `TextBox`       | `cl-textbox`       |
| `NumberBox`     | `cl-numberbox`     |
| `Select`        | `cl-select`        |
| `TextArea`      | `cl-textarea`      |
| `List`          | `cl-list`          |

The `cl-` prefix namespaces the elements away from browser-native elements and host application custom elements.

---

## 4.5 Import path strategy

The web-components entry imports **directly from the React component source**, not from the built dist:

```ts
import { Button } from "../../react/src/components/Button/Button";
```

Why not `from '@cl/react'`?

- `@cl/react/dist` would need to be built first and the CSS side-effect import in `@cl/react/src/index.ts` would attempt to import styles in a non-standard way for the web-components bundler.
- Importing source directly lets Vite compile everything in a single pass — one dependency graph, one CSS bundle.
- The React external exclusion list in `@cl/react`'s config is irrelevant here because this bundle includes React.

---

## 4.6 Self-contained bundle strategy

`packages/web-components/vite.config.ts` sets `external: []` (nothing excluded):

```ts
rollupOptions: {
  external: [],    // bundle React + ReactDOM + all deps
}
```

This means **React 19**, all components, all styles, and all utilities are compiled into a single `custom-elements.js`. The output (~771 kB uncompressed) is larger than the React library build, but:

- No dependency to install: drop one `<script>` tag.
- Works in vanilla HTML, in a `<script>` tag in a CMS, or as a CDN-loaded module.

For production use in a large app the `external` list can be selectively populated to reduce bundle size.

---

## 4.7 Vite 8 + Oxc minifier

```ts
minify: true; // NOT minify: 'esbuild'
```

Vite 8 removed the bundled esbuild binary and switched the default minifier to **Oxc** (a Rust-based JS toolchain). Specifying `minify: 'esbuild'` in Vite 8 throws an error because esbuild is no longer included. Using `minify: true` uses the Vite-version-appropriate default.

---

## 4.8 Framework integration

### Plain HTML

```html
<script type="module" src="dist/custom-elements.js"></script>
<link rel="stylesheet" href="dist/custom-elements.css" />

<cl-button label="Save" variant="primary"></cl-button>
```

### Angular

```ts
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

```html
<!-- component.html -->
<cl-button label="Submit" variant="primary" [disabled]="isLoading"></cl-button>
```

Import the bundle in `angular.json` scripts array or in `main.ts`:

```ts
import "@cl/web-components";
```

### Vue 3

```ts
// vite.config.ts
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("cl-"),
        },
      },
    }),
  ],
});
```

```vue
<template>
  <cl-button label="Submit" variant="primary" @click="handleClick"></cl-button>
</template>

<script setup>
import "@cl/web-components";
function handleClick() {
  console.log("clicked");
}
</script>
```

### Svelte

```svelte
<script>
  import '@cl/web-components';
</script>

<cl-button label="Submit" variant="primary" on:click={() => console.log('clicked')} />
```

---

## 4.9 Passing array props

HTML attributes cannot natively contain arrays. For `Select.options` and `List.items`, set the property directly in JavaScript:

```js
const el = document.getElementById("myList");
el.items = JSON.stringify([
  { id: "1", label: "Option A" },
  { id: "2", label: "Option B" },
]);
```

`@r2wc` parses the JSON string and passes the resulting array to the React prop automatically.
