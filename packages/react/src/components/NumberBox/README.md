# NumberBox

The `NumberBox` component renders a number input (`<input type="number">`) with optional label, min/max/step constraints, helper text, and error state.

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
import { NumberBox } from "@cl/react";

<NumberBox label="Age" placeholder="Enter age" />;
```

### Controlled with min/max/step

```tsx
import { useState } from "react";
import { NumberBox } from "@cl/react";

function QuantityPicker() {
  const [qty, setQty] = useState(1);

  return (
    <NumberBox
      label="Quantity"
      value={qty}
      min={1}
      max={100}
      step={1}
      onChange={(val) => setQty(val)}
    />
  );
}
```

### With helper text

```tsx
<NumberBox
  label="Port number"
  helperText="Must be between 1024 and 65535"
  min={1024}
  max={65535}
/>
```

### Error state

```tsx
<NumberBox
  label="Discount (%)"
  value={discount}
  min={0}
  max={100}
  onChange={setDiscount}
  error={discount > 100 ? "Cannot exceed 100%" : undefined}
/>
```

### Required and disabled

```tsx
<NumberBox label="Invoice total" value={total} required disabled />
```

---

## Props

| Prop          | Type                      | Default | Description                                             |
| ------------- | ------------------------- | ------- | ------------------------------------------------------- |
| `label`       | `string`                  | —       | Label rendered above the input                          |
| `placeholder` | `string`                  | —       | Placeholder text                                        |
| `value`       | `number`                  | —       | Controlled numeric value                                |
| `min`         | `number`                  | —       | Minimum allowed value                                   |
| `max`         | `number`                  | —       | Maximum allowed value                                   |
| `step`        | `number`                  | `1`     | Increment/decrement step                                |
| `onChange`    | `(value: number) => void` | —       | Called with `e.target.valueAsNumber` on every change    |
| `error`       | `string`                  | —       | Error message. Turns border red and shows message below |
| `helperText`  | `string`                  | —       | Hint shown below input when no error is present         |
| `required`    | `boolean`                 | `false` | Shows `*` next to label                                 |
| `disabled`    | `boolean`                 | `false` | Greys out and disables the input                        |
| `readOnly`    | `boolean`                 | `false` | Non-editable but focusable                              |
| `className`   | `string`                  | `''`    | Extra CSS classes                                       |
| `style`       | `CSSProperties`           | —       | Inline style override                                   |
| `width`       | `string`                  | —       | CSS width                                               |
| `data-testid` | `string`                  | —       | Test selector attribute                                 |

> **Note:** `onChange` always receives a `number` (never a string), using `e.target.valueAsNumber`. If the input is empty, it receives `NaN`.

---

## Web Component

```html
<script type="module" src="path/to/custom-elements.js"></script>
<link rel="stylesheet" href="path/to/custom-elements.css" />

<cl-numberbox label="Quantity" min="1" max="99" step="1"></cl-numberbox>

<script>
  document.querySelector("cl-numberbox").addEventListener("change", (e) => {
    console.log("Value:", e.target.value);
  });
</script>
```

---

## Design Tokens used

| Token                   | Purpose                    |
| ----------------------- | -------------------------- |
| `--cl-color-primary`    | Focus border               |
| `--cl-color-focus-ring` | Focus ring color           |
| `--cl-color-error`      | Error border and text      |
| `--cl-color-surface`    | Input background           |
| `--cl-color-neutral-*`  | Label, placeholder, border |
| `--cl-radius-md`        | Corner radius              |
| `--cl-font-size-sm/md`  | Font sizes                 |
| `--cl-transition-fast`  | Border transition speed    |

---

## Accessibility

- Explicit `<label htmlFor>` links to the input for screen readers.
- `min`, `max`, and `step` constraints are forwarded as native HTML attributes, so browsers and assistive technologies can validate and announce range information.
- Error messages appear below the field for easy discoverability.
