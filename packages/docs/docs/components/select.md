---
id: select
title: Select
sidebar_position: 4
---

# Select

Dropdown picker that renders a native `<select>` with a styled chevron icon, label, helper text, and error state.

## Props

| Prop          | Type                      | Default       | Description                                           |
| ------------- | ------------------------- | ------------- | ----------------------------------------------------- |
| `label`       | `string`                  | —             | Field label                                           |
| `options`     | `SelectOption[]`          | `[]`          | Array of options to render                            |
| `value`       | `string`                  | —             | Controlled selected value                             |
| `placeholder` | `string`                  | `'Select...'` | Placeholder option (disabled, hidden after selection) |
| `error`       | `string`                  | —             | Validation error message                              |
| `helperText`  | `string`                  | —             | Helper text below select                              |
| `disabled`    | `boolean`                 | `false`       | Disables the select                                   |
| `required`    | `boolean`                 | `false`       | Required field marker                                 |
| `onChange`    | `(value: string) => void` | —             | Called with selected value string                     |

### `SelectOption`

```ts
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

## React

```tsx
import { Select } from "@cl/react";
import type { SelectOption } from "@cl/react";
import { useState } from "react";

const options: SelectOption[] = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
];

// Uncontrolled
<Select label="Country" options={options} />;

// Controlled
const [country, setCountry] = useState("");
<Select
  label="Country"
  options={options}
  value={country}
  onChange={setCountry}
  placeholder="Pick a country…"
/>;

// With disabled option
const optionsWithDisabled: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "archived", label: "Archived", disabled: true },
];
<Select label="Status" options={optionsWithDisabled} />;
```

## Web Component

Arrays must be set via JavaScript property (not HTML attribute):

```html
<cl-select label="Country" placeholder="Pick a country…"></cl-select>

<script>
  const sel = document.querySelector("cl-select");
  sel.options = [
    { value: "us", label: "United States" },
    { value: "gb", label: "United Kingdom" },
  ];
  sel.addEventListener("change", (e) => console.log("selected:", e.detail));
</script>
```
