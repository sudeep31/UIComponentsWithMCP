# TextArea

The `TextArea` component renders a multi-line text input (`<textarea>`) with an optional label, character count indicator, resize control, helper text, and error state.

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
import { TextArea } from "@cl/react";

<TextArea label="Description" placeholder="Enter a description…" />;
```

### Controlled

```tsx
import { useState } from "react";
import { TextArea } from "@cl/react";

function CommentBox() {
  const [comment, setComment] = useState("");

  return (
    <TextArea
      label="Comment"
      value={comment}
      onChange={(val) => setComment(val)}
      rows={5}
    />
  );
}
```

### Character count

```tsx
<TextArea
  label="Bio"
  maxLength={200}
  showCount
  placeholder="Tell us about yourself…"
/>
```

The character counter is shown as `{current}/{maxLength}` in the top-right corner of the label row.

### Resize control

```tsx
<TextArea label="Notes" resize="none"       />   {/* no resize handle */}
<TextArea label="Notes" resize="vertical"   />   {/* default — vertical only */}
<TextArea label="Notes" resize="horizontal" />
<TextArea label="Notes" resize="both"       />
```

### Error state

```tsx
<TextArea
  label="Reason"
  value={reason}
  onChange={setReason}
  error={reason.length < 20 ? "Minimum 20 characters required" : undefined}
/>
```

### Required and disabled

```tsx
<TextArea label="Terms acceptance" required disabled />
```

---

## Props

| Prop           | Type                                             | Default      | Description                                                 |
| -------------- | ------------------------------------------------ | ------------ | ----------------------------------------------------------- |
| `label`        | `string`                                         | —            | Label rendered above the textarea                           |
| `placeholder`  | `string`                                         | —            | Placeholder text                                            |
| `value`        | `string`                                         | —            | Controlled value                                            |
| `defaultValue` | `string`                                         | —            | Uncontrolled initial value                                  |
| `rows`         | `number`                                         | `4`          | Visible row count                                           |
| `resize`       | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Resize handle behaviour                                     |
| `showCount`    | `boolean`                                        | `false`      | Shows `{current}/{maxLength}` counter. Requires `maxLength` |
| `maxLength`    | `number`                                         | —            | Native max character limit; used by `showCount`             |
| `onChange`     | `(value: string) => void`                        | —            | Called with the new string value on every keystroke         |
| `error`        | `string`                                         | —            | Error message. Turns border red                             |
| `helperText`   | `string`                                         | —            | Hint shown when no error is present                         |
| `required`     | `boolean`                                        | `false`      | Shows `*` next to label                                     |
| `disabled`     | `boolean`                                        | `false`      | Greys out and disables the textarea                         |
| `readOnly`     | `boolean`                                        | `false`      | Non-editable but focusable                                  |
| `className`    | `string`                                         | `''`         | Extra CSS classes                                           |
| `style`        | `CSSProperties`                                  | —            | Inline style override                                       |
| `width`        | `string`                                         | —            | CSS width                                                   |
| `data-testid`  | `string`                                         | —            | Test selector attribute                                     |

---

## Web Component

```html
<script type="module" src="path/to/custom-elements.js"></script>
<link rel="stylesheet" href="path/to/custom-elements.css" />

<cl-textarea
  label="Feedback"
  rows="5"
  placeholder="Your feedback…"
></cl-textarea>

<script>
  document.querySelector("cl-textarea").addEventListener("change", (e) => {
    console.log("Value:", e.target.value);
  });
</script>
```

---

## Design Tokens used

| Token                     | Purpose                    |
| ------------------------- | -------------------------- |
| `--cl-color-primary`      | Focus border               |
| `--cl-color-focus-ring`   | Focus ring                 |
| `--cl-color-error`        | Error border and text      |
| `--cl-color-surface`      | Background                 |
| `--cl-color-neutral-*`    | Label, placeholder, border |
| `--cl-radius-md`          | Corner radius              |
| `--cl-font-size-sm/md/xs` | Font sizes                 |
| `--cl-transition-fast`    | Border transition speed    |

---

## Accessibility

- Explicit `<label htmlFor>` association with the textarea.
- `required` renders a visible `*` and is forwarded as a native attribute.
- The character counter is a read-only visual indicator for sighted users.
- Error messages appear in a `<p>` element directly below the textarea.
