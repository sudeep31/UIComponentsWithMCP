# Phase 5 — Storybook Dev Sandbox

## Goal

Create an interactive component development environment using **Storybook 8** where developers can browse all components, explore every prop combination, run accessibility checks, and write interaction tests — all without touching the host application.

---

## What was built

| Artifact       | Path                                    |
| -------------- | --------------------------------------- |
| Storybook app  | `apps/storybook/`                       |
| Main config    | `apps/storybook/.storybook/main.ts`     |
| Global preview | `apps/storybook/.storybook/preview.ts`  |
| Stories        | `apps/storybook/src/stories/` (6 files) |

---

## 5.1 Why Storybook?

Storybook is the industry-standard tool for developing UI components in isolation:

- Render components without a running application.
- Document every prop with interactive controls (the Controls addon).
- Auto-generate API docs from TypeScript types and JSDoc comments (`autodocs`).
- Run accessibility audits on every story.
- Write and run interaction tests with `@storybook/addon-interactions`.

---

## 5.2 Package location: `apps/` not `packages/`

Storybook is placed under `apps/storybook/` rather than `packages/storybook/` because it is a **developer tool**, not a distributable package. It is never published to npm; it only consumes `@cl/react` from the workspace.

---

## 5.3 Vite 6 isolation

Storybook 8 (`@storybook/react-vite`) only supports **Vite ≤ 6**. The main React library uses Vite 8. These cannot coexist in the same package.

The solution: `apps/storybook/package.json` declares its own `vite@6` and `@vitejs/plugin-react@4` as `devDependencies`. pnpm's workspace hoisting means Storybook's Vite 6 and the monorepo's Vite 8 are installed side-by-side without conflict — each package uses the version in its own `node_modules`.

```json
{
  "name": "@cl/storybook",
  "devDependencies": {
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@storybook/react-vite": "^8.6.18",
    "@storybook/addon-essentials": "^8.6.18",
    "@storybook/addon-a11y": "^8.6.18",
    "@storybook/addon-interactions": "^8.6.18"
  }
}
```

> **Important:** All Storybook addon versions must match the Storybook core version exactly. A mismatch (e.g. addons at 8.6.14 while core is 8.6.18) causes peer dependency errors and broken UI.

---

## 5.4 `.storybook/main.ts`

```ts
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
```

- **`stories` glob** — Storybook discovers all `*.stories.ts/tsx/mdx` files anywhere under `src/`.
- **`@storybook/addon-essentials`** — bundles Controls, Actions, Docs, Viewport, Backgrounds, and Toolbars.
- **`@storybook/addon-a11y`** — renders an Accessibility panel that runs `axe-core` against every story.
- **`@storybook/addon-interactions`** — plays back `userEvent` interaction scripts and lets developers step through them.
- **`autodocs: 'tag'`** — auto-generates a Docs page for any story with `tags: ['autodocs']`.

---

## 5.5 `.storybook/preview.ts`

The preview file sets up **global configuration** applied to every story:

```ts
import "@cl/react/styles.css"; // load design tokens + Tailwind once

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i, // show color pickers for color props
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "surface", value: "#f8fafc" },
        { name: "dark", value: "#0f172a" },
      ],
    },
    layout: "padded",
  },
};
```

- **`import '@cl/react/styles.css'`** — loads all design tokens and Tailwind utilities into Storybook's iframe. Without this, components appear completely unstyled.
- **`controls.matchers`** — tells the Controls addon to render a color-picker widget for any prop whose name ends in `background` or `color`.
- **`backgrounds`** — adds a toolbar button to switch the canvas background, useful for testing light/dark contrast.

---

## 5.6 Story structure (CSF3)

All stories use **Component Story Format 3 (CSF3)** — the current Storybook standard:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@cl/react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"], // generate a Docs page from TypeScript types + JSDoc
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    onClick: { action: "clicked" }, // log click events to Actions panel
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", label: "Button", size: "md" },
};

export const Loading: Story = {
  args: { label: "Loading…", loading: true },
};
```

Key CSF3 concepts:

- `meta.tags: ['autodocs']` — enables the auto-generated API documentation page.
- `argTypes` — controls the appearance of each prop in the Controls panel.
- `action: 'clicked'` — captures the event and displays it in the Actions tab.
- Each named export (`Primary`, `Loading`, etc.) is a story — a specific usage example.

---

## 5.7 Stories per component

| Component | Stories                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| Button    | Primary, Secondary, Ghost, Danger, Small, Large, Loading, FullWidth, Disabled |
| TextBox   | Default, WithLabel, WithError, WithHelper, Required, Disabled                 |
| NumberBox | Default, WithConstraints, WithStep, WithError, Disabled                       |
| Select    | Default, WithValue, WithDisabledOption, WithError, Required, Disabled         |
| TextArea  | Default, WithRows, WithCount, Resize modes, WithError, Disabled               |
| List      | Unordered, Ordered, Descriptive, Selectable, WithDividers, Compact, Empty     |

---

## 5.8 Running Storybook

```powershell
pnpm dev:storybook
# Opens http://localhost:6006
```

The development server uses Vite HMR — story changes, component source changes, and token changes all hot-reload instantly.

To build a static Storybook site for deployment:

```powershell
pnpm --filter @cl/storybook build
# Output: apps/storybook/storybook-static/
```
