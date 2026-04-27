# List

The `List` component renders an ordered, unordered, or descriptive list of items. It supports item selection, dividers, compact density, and optional description text per item.

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

### Basic unordered list

```tsx
import { List } from "@cl/react";

const items = [
  { id: "1", label: "Apple" },
  { id: "2", label: "Banana" },
  { id: "3", label: "Cherry" },
];

<List items={items} />;
```

### Ordered list

```tsx
<List items={items} variant="ordered" />
```

### Descriptive list (items with sub-text)

```tsx
const features = [
  {
    id: "f1",
    label: "Dark mode",
    description: "Switch between light and dark themes",
  },
  { id: "f2", label: "Accessibility", description: "WCAG 2.1 AA compliant" },
  { id: "f3", label: "Responsive", description: "Works on all screen sizes" },
];

<List items={features} variant="descriptive" />;
```

### Selectable list

```tsx
import { useState } from "react";

function PickOne() {
  const [selected, setSelected] = useState("");

  return (
    <List
      items={items}
      selectable
      selectedId={selected}
      onSelect={(id) => setSelected(id)}
    />
  );
}
```

The selected item is highlighted with the primary-light background and primary-dark text.

### With dividers

```tsx
<List items={items} dividers />
```

### Compact density

```tsx
<List items={items} compact />
```

---

## Props

| Prop          | Type                                        | Default       | Description                                    |
| ------------- | ------------------------------------------- | ------------- | ---------------------------------------------- |
| `items`       | `ListItem[]`                                | `[]`          | Array of list item objects (see below)         |
| `variant`     | `'unordered' \| 'ordered' \| 'descriptive'` | `'unordered'` | List rendering mode                            |
| `selectable`  | `boolean`                                   | `false`       | Enables click-to-select behaviour              |
| `selectedId`  | `string`                                    | —             | ID of the currently selected item (controlled) |
| `dividers`    | `boolean`                                   | `false`       | Renders a bottom border between items          |
| `compact`     | `boolean`                                   | `false`       | Reduces item padding for denser layouts        |
| `onSelect`    | `(id: string) => void`                      | —             | Called with the item's `id` when clicked       |
| `className`   | `string`                                    | `''`          | Extra CSS classes                              |
| `style`       | `CSSProperties`                             | —             | Inline style override                          |
| `width`       | `string`                                    | —             | CSS width                                      |
| `data-testid` | `string`                                    | —             | Test selector attribute                        |

### `ListItem`

```ts
interface ListItem {
  id: string; // unique identifier — used as React key and for selection
  label: string; // primary display text
  description?: string; // optional sub-text shown below the label
}
```

---

## Web Component

When passing items via the web component, set the `items` property as a JSON string:

```html
<script type="module" src="path/to/custom-elements.js"></script>
<link rel="stylesheet" href="path/to/custom-elements.css" />

<cl-list id="myList" selectable="true"></cl-list>

<script>
  const el = document.getElementById("myList");
  el.items = JSON.stringify([
    { id: "1", label: "Option A", description: "First choice" },
    { id: "2", label: "Option B", description: "Second choice" },
  ]);
</script>
```

---

## Design Tokens used

| Token                        | Purpose                         |
| ---------------------------- | ------------------------------- |
| `--cl-color-primary-light`   | Selected item background        |
| `--cl-color-primary-dark`    | Selected item text              |
| `--cl-color-neutral-100`     | Hover background                |
| `--cl-color-neutral-500/900` | Description and label text      |
| `--cl-color-border`          | Divider line color              |
| `--cl-radius-sm`             | Item corner radius              |
| `--cl-font-size-sm/md`       | Description and label font size |
| `--cl-font-weight-medium`    | Selected item font weight       |
| `--cl-transition-fast`       | Hover transition speed          |

---

## Accessibility

- `selectable` items are given `role="option"` and `aria-selected` attributes.
- Items are rendered in a native `<ul>` / `<ol>` element, which is understood by all screen readers.
- Keyboard navigation follows standard browser list-selection patterns.
