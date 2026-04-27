---
id: textbox
title: TextBox
sidebar_position: 2
---

# TextBox

Single-line text input with optional label, helper text, and validation error display.

## Props

| Prop           | Type                      | Default | Description                                           |
| -------------- | ------------------------- | ------- | ----------------------------------------------------- |
| `label`        | `string`                  | —       | Field label rendered above the input                  |
| `placeholder`  | `string`                  | —       | Input placeholder text                                |
| `value`        | `string`                  | —       | Controlled value                                      |
| `defaultValue` | `string`                  | —       | Uncontrolled default value                            |
| `error`        | `string`                  | —       | Validation error message (renders below input in red) |
| `helperText`   | `string`                  | —       | Helper text rendered below input                      |
| `disabled`     | `boolean`                 | `false` | Disables the input                                    |
| `readOnly`     | `boolean`                 | `false` | Makes the input read-only                             |
| `required`     | `boolean`                 | `false` | Marks the field as required                           |
| `onChange`     | `(value: string) => void` | —       | Called with the string value on every change          |

_Also accepts all standard `<input>` HTML attributes and [base style props](../design-tokens)._

## React

```tsx
import { TextBox } from '@cl/react';
import { useState } from 'react';

// Uncontrolled
<TextBox label="Name" placeholder="Enter your name" />

// Controlled
const [name, setName] = useState('');
<TextBox label="Name" value={name} onChange={setName} />

// With validation
<TextBox
  label="Email"
  value={email}
  error={!email.includes('@') ? 'Invalid email address' : undefined}
  onChange={setEmail}
/>

// With helper text
<TextBox label="Username" helperText="Must be 3–20 characters." />

// Disabled
<TextBox label="Account ID" value="ACC-4829" disabled />
```

## Web Component

```html
<cl-textbox label="Name" placeholder="Enter your name"></cl-textbox>

<script>
  const tb = document.querySelector("cl-textbox");
  tb.addEventListener("change", (e) => console.log(e.detail));
</script>
```
