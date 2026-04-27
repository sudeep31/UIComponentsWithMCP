---
id: web-components
title: Web Components Guide
sidebar_position: 7
---

# Web Components Guide

`@cl/web-components` bundles all six components as [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). React 19 is bundled inside — consumers need no React dependency.

## Installation

```bash
pnpm add @cl/web-components
```

Or via CDN / direct script:

```html
<link
  rel="stylesheet"
  href="path/to/@cl/web-components/dist/custom-elements.css"
/>
<script
  type="module"
  src="path/to/@cl/web-components/dist/custom-elements.js"
></script>
```

## Custom Element Tags

| Component | Tag              |
| --------- | ---------------- |
| Button    | `<cl-button>`    |
| TextBox   | `<cl-textbox>`   |
| NumberBox | `<cl-numberbox>` |
| Select    | `<cl-select>`    |
| TextArea  | `<cl-textarea>`  |
| List      | `<cl-list>`      |

---

## Plain HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link
      rel="stylesheet"
      href="node_modules/@cl/web-components/dist/custom-elements.css"
    />
  </head>
  <body>
    <cl-textbox label="Name" placeholder="Enter name"></cl-textbox>
    <cl-button label="Submit" variant="primary"></cl-button>

    <script
      type="module"
      src="node_modules/@cl/web-components/dist/custom-elements.js"
    ></script>
    <script>
      document.querySelector("cl-button").addEventListener("click", () => {
        alert("Submitted!");
      });
    </script>
  </body>
</html>
```

---

## Angular

1. Add `CUSTOM_ELEMENTS_SCHEMA` to your module:

```ts
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

2. Import the bundle in `main.ts`:

```ts
import "@cl/web-components";
```

3. Use in templates:

```html
<cl-textbox label="Name" [attr.value]="name"></cl-textbox>
<cl-button label="Save" variant="primary" (click)="save()"></cl-button>
```

---

## Vue 3

Tell the Vue compiler to treat `cl-*` elements as custom elements:

```ts
// vite.config.ts
import vue from "@vitejs/plugin-vue";

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("cl-"),
        },
      },
    }),
  ],
};
```

Import in `main.ts`:

```ts
import "@cl/web-components";
```

Use in templates:

```html
<template>
  <cl-textbox label="Name" :value="name"></cl-textbox>
  <cl-button label="Save" @click="save"></cl-button>
</template>
```

---

## Svelte

Import once at app root:

```ts
// app.ts or main.ts
import "@cl/web-components";
```

Use directly in `.svelte` files:

```svelte
<cl-textbox label="Name" value={name}></cl-textbox>
<cl-button label="Save" on:click={save}></cl-button>
```

---

## Array / Object Props

Because HTML attributes are always strings, array and object props (like `options` on `<cl-select>` or `items` on `<cl-list>`) must be set via **JavaScript property assignment**:

```js
const sel = document.querySelector("cl-select");
sel.options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

const list = document.querySelector("cl-list");
list.items = [
  { id: "1", label: "First item" },
  { id: "2", label: "Second item" },
];
```
