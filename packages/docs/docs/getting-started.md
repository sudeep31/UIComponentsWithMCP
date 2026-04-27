---
id: getting-started
title: Getting Started
slug: /
sidebar_position: 1
---

# Getting Started

**CL Component Library** provides six accessible, themeable UI components built with React and Tailwind CSS. Components are also available as framework-agnostic [Web Components](./web-components) via Custom Elements.

## Installation

```bash
# React (with your own React project)
pnpm add @cl/react @cl/tokens

# Or Web Components (no framework needed)
pnpm add @cl/web-components
```

## Import styles

Add the token variables and component styles once — typically in your app entry point:

```ts
// main.ts / main.tsx
import "@cl/react/styles.css";
```

Or link the stylesheet directly in HTML:

```html
<link rel="stylesheet" href="node_modules/@cl/react/dist/styles.css" />
```

## Your first component

```tsx
import { Button, TextBox } from "@cl/react";

export default function App() {
  return (
    <div>
      <TextBox label="Name" placeholder="Enter your name" />
      <Button variant="primary" label="Submit" />
    </div>
  );
}
```

## Available Components

| Component | React import | Web Component tag |
| --------- | ------------ | ----------------- |
| Button    | `Button`     | `<cl-button>`     |
| TextBox   | `TextBox`    | `<cl-textbox>`    |
| NumberBox | `NumberBox`  | `<cl-numberbox>`  |
| Select    | `Select`     | `<cl-select>`     |
| TextArea  | `TextArea`   | `<cl-textarea>`   |
| List      | `List`       | `<cl-list>`       |

## Color Scheme

All components use a **light color scheme by default**, built on soft blues and violets over neutral whites and grays. Colors are defined as CSS custom properties (`--cl-color-*`) and can be overridden per-scope.

```css
/* Override primary color for a specific section */
.my-section {
  --cl-color-primary: #0ea5e9;
  --cl-color-primary-dark: #0284c7;
}
```
