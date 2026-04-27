# Select

The `Select` component renders a styled dropdown (`<select>`) with an optional label, placeholder, helper text, and error state. Options are supplied as a data array rather than JSX children.

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
import { Select } from "@cl/react";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

<Select label="Favourite fruit" options={fruits} />;
```

### Controlled

```tsx
import { useState } from "react";
import { Select } from "@cl/react";

function CountryPicker() {
  const [country, setCountry] = useState("");

  return (
    <Select
      label="Country"
      options={[
        { value: "us", label: "United States" },
        { value: "gb", label: "United Kingdom" },
        { value: "in", label: "India" },
      ]}
      value={country}
      placeholder="Select a country…"
      onChange={(val) => setCountry(val)}
    />
  );
}
```

### With disabled options

```tsx
const tiers = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise", disabled: true },
];

<Select label="Plan" options={tiers} />;
```

### Error state

```tsx
<Select
  label="Role"
  options={roles}
  value={role}
  onChange={setRole}
  error={!role ? "Please select a role" : undefined}
/>
```

### Required

```tsx
<Select label="Department" options={departments} required />
```

---

## Props

| Prop          | Type                      | Default       | Description                                        |
| ------------- | ------------------------- | ------------- | -------------------------------------------------- |
| `label`       | `string`                  | —             | Label rendered above the select                    |
| `options`     | `SelectOption[]`          | `[]`          | Array of option objects (see below)                |
| `value`       | `string`                  | —             | Controlled selected value                          |
| `placeholder` | `string`                  | `'Select...'` | Placeholder option shown when no value is selected |
| `onChange`    | `(value: string) => void` | —             | Called with the selected value string              |
| `error`       | `string`                  | —             | Error message. Turns border red                    |
| `helperText`  | `string`                  | —             | Hint shown when no error                           |
| `required`    | `boolean`                 | `false`       | Shows `*` next to label                            |
| `disabled`    | `boolean`                 | `false`       | Disables the entire select                         |
| `className`   | `string`                  | `''`          | Extra CSS classes                                  |
| `style`       | `CSSProperties`           | —             | Inline style override                              |
| `width`       | `string`                  | —             | CSS width                                          |
| `data-testid` | `string`                  | —             | Test selector attribute                            |

### `SelectOption`

```ts
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

---

## Web Component

When passing options to the web component, serialize the array as a JSON string:

```html
<script type="module" src="path/to/custom-elements.js"></script>
<link rel="stylesheet" href="path/to/custom-elements.css" />

<cl-select id="mySelect" label="Country" placeholder="Pick one…"></cl-select>

<script>
  const el = document.getElementById("mySelect");
  el.options = JSON.stringify([
    { value: "us", label: "United States" },
    { value: "gb", label: "United Kingdom" },
  ]);
  el.addEventListener("change", (e) => console.log(e.target.value));
</script>
```

---

## Design Tokens used

| Token                   | Purpose                     |
| ----------------------- | --------------------------- |
| `--cl-color-primary`    | Focus border                |
| `--cl-color-focus-ring` | Focus ring                  |
| `--cl-color-error`      | Error border and text       |
| `--cl-color-surface`    | Dropdown background         |
| `--cl-color-neutral-*`  | Label, placeholder, borders |
| `--cl-radius-md`        | Corner radius               |
| `--cl-font-size-sm/md`  | Font sizes                  |
| `--cl-transition-fast`  | Border transition speed     |

---

## Accessibility

- `<label htmlFor>` is explicitly linked to the `<select>` element.
- The placeholder option is `disabled hidden` so it cannot be re-selected, preventing accidental empty submissions.
- `required` visually marks the field and is forwarded as a native attribute.
- The custom chevron icon is `aria-hidden` — it is purely decorative.
