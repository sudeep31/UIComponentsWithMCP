---
id: textarea
title: TextArea
sidebar_position: 5
---

# TextArea

Multi-line text input with configurable rows, resize behaviour, character count, and validation.

## Props

| Prop           | Type                                             | Default      | Description                                                     |
| -------------- | ------------------------------------------------ | ------------ | --------------------------------------------------------------- |
| `label`        | `string`                                         | —            | Field label                                                     |
| `placeholder`  | `string`                                         | —            | Placeholder text                                                |
| `value`        | `string`                                         | —            | Controlled value                                                |
| `defaultValue` | `string`                                         | —            | Uncontrolled default value                                      |
| `rows`         | `number`                                         | `4`          | Initial visible row count                                       |
| `resize`       | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Resize handle direction                                         |
| `showCount`    | `boolean`                                        | `false`      | Show character count (requires `maxLength`)                     |
| `maxLength`    | `number`                                         | —            | Max character count; activates counter when `showCount` is true |
| `error`        | `string`                                         | —            | Validation error message                                        |
| `helperText`   | `string`                                         | —            | Helper text below textarea                                      |
| `disabled`     | `boolean`                                        | `false`      | Disables the textarea                                           |
| `readOnly`     | `boolean`                                        | `false`      | Read-only mode                                                  |
| `required`     | `boolean`                                        | `false`      | Required field marker                                           |
| `onChange`     | `(value: string) => void`                        | —            | Called with the string value on change                          |

## React

```tsx
import { TextArea } from '@cl/react';
import { useState } from 'react';

// Basic
<TextArea label="Notes" placeholder="Add notes here…" />

// With character counter
<TextArea
  label="Bio"
  showCount
  maxLength={280}
  placeholder="Tell us about yourself…"
  rows={5}
/>

// Controlled
const [notes, setNotes] = useState('');
<TextArea label="Notes" value={notes} onChange={setNotes} />

// No resize
<TextArea label="Fixed" resize="none" rows={3} />
```

## Web Component

```html
<cl-textarea label="Notes" rows="4" placeholder="Add notes…"></cl-textarea>

<script>
  document.querySelector("cl-textarea").addEventListener("change", (e) => {
    console.log(e.detail);
  });
</script>
```
