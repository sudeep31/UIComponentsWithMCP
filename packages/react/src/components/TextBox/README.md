# TextBox

The `TextBox` component renders a single-line text input with an optional label, placeholder, helper text, and error state. It wraps the native `<input type="text">` element with CL design-token styling.

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

### Uncontrolled (default value)

```tsx
import { TextBox } from "@cl/react";

<TextBox
  label="First name"
  defaultValue="Jane"
  placeholder="Enter your name"
/>;
```

### Controlled

```tsx
import { useState } from "react";
import { TextBox } from "@cl/react";

function Form() {
  const [name, setName] = useState("");

  return (
    <TextBox
      label="Full name"
      value={name}
      onChange={(val) => setName(val)}
      placeholder="Enter your full name"
    />
  );
}
```

### With helper text

```tsx
<TextBox
  label="Username"
  helperText="Must be 3–20 characters"
  placeholder="johndoe"
/>
```

### Error state

```tsx
<TextBox
  label="Email"
  value={email}
  onChange={setEmail}
  error={!isValid ? "Please enter a valid email" : undefined}
/>
```

### Required field

```tsx
<TextBox label="Password" required />
```

### Read-only

```tsx
<TextBox label="Account ID" value="ACC-00123" readOnly />
```

### Disabled

```tsx
<TextBox label="Locked field" value="N/A" disabled />
```

---

## Props

| Prop              | Type                      | Default | Description                                         |
| ----------------- | ------------------------- | ------- | --------------------------------------------------- |
| `label`           | `string`                  | —       | Label rendered above the input                      |
| `placeholder`     | `string`                  | —       | Placeholder text                                    |
| `value`           | `string`                  | —       | Controlled value                                    |
| `defaultValue`    | `string`                  | —       | Uncontrolled initial value                          |
| `onChange`        | `(value: string) => void` | —       | Called with the new string value on every keystroke |
| `error`           | `string`                  | —       | Error message. Turns border red and shows message   |
| `helperText`      | `string`                  | —       | Hint shown below input when no error is present     |
| `required`        | `boolean`                 | `false` | Shows `*` next to label                             |
| `disabled`        | `boolean`                 | `false` | Greys out and disables the input                    |
| `readOnly`        | `boolean`                 | `false` | Non-editable but focusable                          |
| `className`       | `string`                  | `''`    | Extra CSS classes                                   |
| `style`           | `CSSProperties`           | —       | Inline style override                               |
| `color`           | `string`                  | —       | Text color (CSS value or CL token)                  |
| `backgroundColor` | `string`                  | —       | Background color                                    |
| `width`           | `string`                  | —       | CSS width, e.g. `'320px'` or `'100%'`               |
| `data-testid`     | `string`                  | —       | Test selector attribute                             |

All standard `<input>` HTML attributes are supported via spread (except `color`, `onChange`, `value`, `defaultValue` which are redefined above).

---

## Web Component

```html
<script type="module" src="path/to/custom-elements.js"></script>
<link rel="stylesheet" href="path/to/custom-elements.css" />

<cl-textbox label="Email" placeholder="user@example.com"></cl-textbox>

<script>
  const el = document.querySelector("cl-textbox");
  el.addEventListener("change", (e) => {
    console.log("Value:", e.target.value);
  });
</script>
```

---

## Design Tokens used

| Token                     | Purpose                    |
| ------------------------- | -------------------------- |
| `--cl-color-primary`      | Focus border               |
| `--cl-color-focus-ring`   | Focus ring color           |
| `--cl-color-error`        | Error border and text      |
| `--cl-color-surface`      | Input background           |
| `--cl-color-neutral-*`    | Label, placeholder, border |
| `--cl-radius-md`          | Corner radius              |
| `--cl-font-size-sm/md`    | Label and input font size  |
| `--cl-font-weight-medium` | Label font weight          |
| `--cl-transition-fast`    | Border transition speed    |

---

## Accessibility

- Explicit `<label htmlFor>` association so screen readers announce the label when the input is focused.
- `required` renders a visible `*` indicator on the label.
- Error messages are rendered in a `<p>` element immediately following the input, making them easily discoverable by assistive technology.
