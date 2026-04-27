---
id: list
title: List
sidebar_position: 6
---

# List

Renders an ordered, unordered, or descriptive list with optional selection, dividers, and compact spacing.

## Props

| Prop         | Type                                        | Default       | Description                                            |
| ------------ | ------------------------------------------- | ------------- | ------------------------------------------------------ |
| `items`      | `ListItem[]`                                | `[]`          | Array of items to render                               |
| `variant`    | `'unordered' \| 'ordered' \| 'descriptive'` | `'unordered'` | List rendering mode                                    |
| `selectable` | `boolean`                                   | `false`       | Makes items clickable, highlights selected             |
| `selectedId` | `string`                                    | —             | ID of the currently selected item                      |
| `dividers`   | `boolean`                                   | `false`       | Show dividers between items                            |
| `compact`    | `boolean`                                   | `false`       | Reduces item padding                                   |
| `onSelect`   | `(id: string) => void`                      | —             | Called with the item `id` on click (when `selectable`) |

### `ListItem`

```ts
interface ListItem {
  id: string;
  label: string;
  description?: string; // shown in descriptive variant
}
```

## React

```tsx
import { List } from '@cl/react';
import type { ListItem } from '@cl/react';
import { useState } from 'react';

const items: ListItem[] = [
  { id: '1', label: 'Design tokens' },
  { id: '2', label: 'React components' },
  { id: '3', label: 'Web Components' },
];

// Unordered (default)
<List items={items} />

// Ordered
<List items={items} variant="ordered" />

// Descriptive (with description field)
const descItems: ListItem[] = [
  { id: 'a', label: 'Button', description: 'Trigger actions and events' },
  { id: 'b', label: 'Select', description: 'Dropdown option picker' },
];
<List items={descItems} variant="descriptive" />

// Selectable
const [selected, setSelected] = useState('');
<List
  items={items}
  selectable
  selectedId={selected}
  dividers
  onSelect={setSelected}
/>
```

## Web Component

Arrays must be set via JavaScript property:

```html
<cl-list selectable dividers></cl-list>

<script>
  const list = document.querySelector("cl-list");
  list.items = [
    { id: "1", label: "Item one" },
    { id: "2", label: "Item two" },
  ];
  list.addEventListener("select", (e) => console.log("selected:", e.detail));
</script>
```

## Variants

| Variant       | HTML element | Use case                       |
| ------------- | ------------ | ------------------------------ |
| `unordered`   | `<ul>`       | Bullet list of items           |
| `ordered`     | `<ol>`       | Numbered steps or ranked items |
| `descriptive` | `<dl>`       | Term + description pairs       |
