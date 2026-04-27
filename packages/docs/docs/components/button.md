---
id: button
title: Button
sidebar_position: 1
---

# Button

Triggers actions and events. Supports four visual variants, three sizes, loading state, and full-width layout.

## Props

| Prop        | Type                                              | Default     | Description                         |
| ----------- | ------------------------------------------------- | ----------- | ----------------------------------- |
| `variant`   | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style                        |
| `size`      | `'sm' \| 'md' \| 'lg'`                            | `'md'`      | Size preset                         |
| `label`     | `string`                                          | —           | Button text (or use `children`)     |
| `loading`   | `boolean`                                         | `false`     | Shows spinner, disables interaction |
| `fullWidth` | `boolean`                                         | `false`     | Stretches to container width        |
| `disabled`  | `boolean`                                         | `false`     | Native disabled state               |
| `onClick`   | `(e: MouseEvent) => void`                         | —           | Click handler                       |

_Also accepts all standard `<button>` HTML attributes and [base style props](../design-tokens)._

## React

```tsx
import { Button } from '@cl/react';

// Primary (default)
<Button label="Save" onClick={() => console.log('saved')} />

// Variants
<Button variant="secondary" label="Cancel" />
<Button variant="ghost" label="Learn more" />
<Button variant="danger" label="Delete" />

// Sizes
<Button size="sm" label="Small" />
<Button size="lg" label="Large" />

// Loading state
<Button loading label="Saving…" />

// Full width
<Button fullWidth label="Continue" />
```

## Web Component

```html
<script type="module" src="@cl/web-components/dist/custom-elements.js"></script>

<cl-button label="Save" variant="primary"></cl-button>
<cl-button label="Delete" variant="danger" size="lg"></cl-button>

<script>
  document.querySelector("cl-button").addEventListener("click", () => {
    console.log("clicked");
  });
</script>
```

## Variants

| Variant     | Background                       | Use Case             |
| ----------- | -------------------------------- | -------------------- |
| `primary`   | `--cl-color-primary` (`#4f81f5`) | Main CTA             |
| `secondary` | `--cl-color-primary-light`       | Secondary action     |
| `ghost`     | Transparent                      | Tertiary / nav links |
| `danger`    | `--cl-color-error` (`#f87171`)   | Destructive actions  |
