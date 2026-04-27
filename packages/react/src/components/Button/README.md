# Button

The `Button` component triggers actions and events. It supports four visual variants, three sizes, a loading state, and full-width layout.

---

## Installation

```bash
pnpm add @cl/react
```

Import styles once at your application entry point:

```ts
import "@cl/react/styles.css";
```

---

## Usage

### Basic

```tsx
import { Button } from "@cl/react";

export default function App() {
  return <Button label="Save" onClick={() => alert("Saved!")} />;
}
```

### Variants

```tsx
<Button variant="primary"   label="Primary" />
<Button variant="secondary" label="Secondary" />
<Button variant="ghost"     label="Ghost" />
<Button variant="danger"    label="Delete" />
```

### Sizes

```tsx
<Button size="sm" label="Small" />
<Button size="md" label="Medium" />   {/* default */}
<Button size="lg" label="Large" />
```

### Loading state

```tsx
<Button label="Saving…" loading />
```

While `loading` is `true` the button is disabled and shows a spinner.

### Full-width

```tsx
<Button label="Submit Form" fullWidth />
```

### Children instead of `label`

```tsx
<Button variant="primary">
  <span>Custom content</span>
</Button>
```

### Controlled disabled

```tsx
<Button label="Confirm" disabled={!isValid} />
```

---

## Props

| Prop              | Type                                              | Default     | Description                                     |
| ----------------- | ------------------------------------------------- | ----------- | ----------------------------------------------- |
| `variant`         | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style variant                            |
| `size`            | `'sm' \| 'md' \| 'lg'`                            | `'md'`      | Size preset (padding + font size)               |
| `label`           | `string`                                          | —           | Button text. Can use `children` instead         |
| `loading`         | `boolean`                                         | `false`     | Shows spinner and disables interaction          |
| `fullWidth`       | `boolean`                                         | `false`     | Stretches button to fill container width        |
| `disabled`        | `boolean`                                         | `false`     | Native disabled state                           |
| `onClick`         | `(e: MouseEvent) => void`                         | —           | Click event handler                             |
| `className`       | `string`                                          | `''`        | Extra CSS classes to merge                      |
| `style`           | `CSSProperties`                                   | —           | Inline style override                           |
| `color`           | `string`                                          | —           | Text / foreground color (CSS value or CL token) |
| `backgroundColor` | `string`                                          | —           | Background color (CSS value or CL token)        |
| `width`           | `string`                                          | —           | CSS width, e.g. `'200px'`                       |
| `data-testid`     | `string`                                          | —           | Test selector attribute                         |

All standard `<button>` HTML attributes are also supported via spread.

---

## Web Component

Import the self-contained bundle once on a page, then use the `cl-button` custom element anywhere — no framework required.

```html
<script type="module" src="path/to/custom-elements.js"></script>
<link rel="stylesheet" href="path/to/custom-elements.css" />

<cl-button label="Save" variant="primary"></cl-button>

<script>
  document.querySelector("cl-button").addEventListener("click", () => {
    console.log("Button clicked");
  });
</script>
```

---

## Design Tokens used

| Token                      | Purpose             |
| -------------------------- | ------------------- |
| `--cl-color-primary`       | Primary fill        |
| `--cl-color-primary-dark`  | Hover fill          |
| `--cl-color-primary-light` | Secondary fill      |
| `--cl-color-error`         | Danger variant fill |
| `--cl-color-focus-ring`    | Keyboard focus ring |
| `--cl-radius-sm/md/lg`     | Corner radius       |
| `--cl-font-size-sm/md/lg`  | Font size per size  |

---

## Accessibility

- Renders a native `<button>` element — keyboard-navigable and screen-reader-friendly by default.
- `loading` sets `disabled` automatically so the button cannot be activated while async work is in progress.
- Focus ring uses `focus-visible` so it only appears for keyboard navigation.
