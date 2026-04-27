---
id: numberbox
title: NumberBox
sidebar_position: 3
---

# NumberBox

Numeric input with optional min/max/step constraints, label, helper text, and error display.

## Props

| Prop          | Type                      | Default | Description                           |
| ------------- | ------------------------- | ------- | ------------------------------------- |
| `label`       | `string`                  | —       | Field label                           |
| `placeholder` | `string`                  | —       | Placeholder text                      |
| `value`       | `number`                  | —       | Controlled value                      |
| `min`         | `number`                  | —       | Minimum allowed value                 |
| `max`         | `number`                  | —       | Maximum allowed value                 |
| `step`        | `number`                  | `1`     | Increment/decrement step              |
| `error`       | `string`                  | —       | Validation error message              |
| `helperText`  | `string`                  | —       | Helper text below input               |
| `disabled`    | `boolean`                 | `false` | Disables the input                    |
| `readOnly`    | `boolean`                 | `false` | Read-only mode                        |
| `required`    | `boolean`                 | `false` | Required field marker                 |
| `onChange`    | `(value: number) => void` | —       | Called with `valueAsNumber` on change |

_Also accepts all standard `<input>` HTML attributes (except `type`) and [base style props](../design-tokens)._

## React

```tsx
import { NumberBox } from '@cl/react';
import { useState } from 'react';

// Basic
<NumberBox label="Quantity" />

// With constraints
<NumberBox label="Age" min={0} max={120} step={1} />

// Controlled
const [qty, setQty] = useState(1);
<NumberBox label="Quantity" value={qty} min={1} max={99} onChange={setQty} />

// Percentage with step
<NumberBox
  label="Discount"
  min={0}
  max={100}
  step={5}
  helperText="Increments of 5%"
/>
```

## Web Component

```html
<cl-numberbox label="Quantity" min="1" max="99" step="1"></cl-numberbox>

<script>
  document.querySelector("cl-numberbox").addEventListener("change", (e) => {
    console.log("value:", e.detail);
  });
</script>
```
