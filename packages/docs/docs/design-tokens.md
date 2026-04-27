---
id: design-tokens
title: Design Tokens
sidebar_position: 2
---

# Design Tokens

All visual values — colors, spacing, typography, shadows, and more — are defined as **CSS custom properties** under `:root {}`. The source of truth is `packages/tokens/src/tokens.json`, compiled by Style Dictionary into `tokens.css` and `tokens.json`.

## Usage

```css
/* In any CSS file */
.my-button {
  background: var(--cl-color-primary);
  padding: var(--cl-spacing-md) var(--cl-spacing-lg);
  border-radius: var(--cl-radius-md);
  box-shadow: var(--cl-shadow-sm);
}
```

---

## Colors

| Token           | CSS Variable                 | Value     |
| --------------- | ---------------------------- | --------- |
| Primary         | `--cl-color-primary`         | `#4f81f5` |
| Primary Light   | `--cl-color-primary-light`   | `#ebf0fe` |
| Primary Dark    | `--cl-color-primary-dark`    | `#2d5dd4` |
| Secondary       | `--cl-color-secondary`       | `#7c6af5` |
| Secondary Light | `--cl-color-secondary-light` | `#edebfe` |
| Neutral 50      | `--cl-color-neutral-50`      | `#f9fafb` |
| Neutral 100     | `--cl-color-neutral-100`     | `#f3f4f6` |
| Neutral 200     | `--cl-color-neutral-200`     | `#e5e7eb` |
| Neutral 300     | `--cl-color-neutral-300`     | `#d1d5db` |
| Neutral 400     | `--cl-color-neutral-400`     | `#9ca3af` |
| Neutral 500     | `--cl-color-neutral-500`     | `#6b7280` |
| Neutral 700     | `--cl-color-neutral-700`     | `#374151` |
| Neutral 900     | `--cl-color-neutral-900`     | `#111827` |
| Success         | `--cl-color-success`         | `#34d399` |
| Success Light   | `--cl-color-success-light`   | `#d1fae5` |
| Error           | `--cl-color-error`           | `#f87171` |
| Error Light     | `--cl-color-error-light`     | `#fee2e2` |
| Warning         | `--cl-color-warning`         | `#fbbf24` |
| Warning Light   | `--cl-color-warning-light`   | `#fef3c7` |
| Surface         | `--cl-color-surface`         | `#ffffff` |
| Border          | `--cl-color-border`          | `#e5e7eb` |
| Focus Ring      | `--cl-color-focus-ring`      | `#93c5fd` |

---

## Spacing

| Token | CSS Variable       | Value  |
| ----- | ------------------ | ------ |
| xs    | `--cl-spacing-xs`  | `4px`  |
| sm    | `--cl-spacing-sm`  | `8px`  |
| md    | `--cl-spacing-md`  | `12px` |
| lg    | `--cl-spacing-lg`  | `16px` |
| xl    | `--cl-spacing-xl`  | `24px` |
| 2xl   | `--cl-spacing-2xl` | `32px` |
| 3xl   | `--cl-spacing-3xl` | `48px` |
| 4xl   | `--cl-spacing-4xl` | `64px` |

---

## Typography

| Token               | CSS Variable                    | Value                                           |
| ------------------- | ------------------------------- | ----------------------------------------------- |
| Font Family Base    | `--cl-font-family-base`         | `'Inter', system-ui, -apple-system, sans-serif` |
| Font Family Mono    | `--cl-font-family-mono`         | `'JetBrains Mono', 'Fira Code', monospace`      |
| Size xs             | `--cl-font-size-xs`             | `12px`                                          |
| Size sm             | `--cl-font-size-sm`             | `14px`                                          |
| Size md             | `--cl-font-size-md`             | `16px`                                          |
| Size lg             | `--cl-font-size-lg`             | `18px`                                          |
| Size xl             | `--cl-font-size-xl`             | `24px`                                          |
| Size 2xl            | `--cl-font-size-2xl`            | `32px`                                          |
| Weight Normal       | `--cl-font-weight-normal`       | `400`                                           |
| Weight Medium       | `--cl-font-weight-medium`       | `500`                                           |
| Weight Semibold     | `--cl-font-weight-semibold`     | `600`                                           |
| Weight Bold         | `--cl-font-weight-bold`         | `700`                                           |
| Line Height Tight   | `--cl-font-line-height-tight`   | `1.25`                                          |
| Line Height Normal  | `--cl-font-line-height-normal`  | `1.5`                                           |
| Line Height Relaxed | `--cl-font-line-height-relaxed` | `1.75`                                          |

---

## Border Radius

| Token | CSS Variable       | Value    |
| ----- | ------------------ | -------- |
| none  | `--cl-radius-none` | `0`      |
| sm    | `--cl-radius-sm`   | `4px`    |
| md    | `--cl-radius-md`   | `6px`    |
| lg    | `--cl-radius-lg`   | `8px`    |
| xl    | `--cl-radius-xl`   | `12px`   |
| full  | `--cl-radius-full` | `9999px` |

---

## Shadows

| Token | CSS Variable        | Value                             |
| ----- | ------------------- | --------------------------------- |
| sm    | `--cl-shadow-sm`    | `0 1px 2px rgba(0,0,0,0.05)`      |
| md    | `--cl-shadow-md`    | `0 4px 6px rgba(0,0,0,0.07)`      |
| lg    | `--cl-shadow-lg`    | `0 10px 15px rgba(0,0,0,0.10)`    |
| xl    | `--cl-shadow-xl`    | `0 20px 25px rgba(0,0,0,0.12)`    |
| focus | `--cl-shadow-focus` | `0 0 0 3px rgba(79,129,245,0.35)` |

---

## Transitions

| Token  | CSS Variable             | Value               |
| ------ | ------------------------ | ------------------- |
| fast   | `--cl-transition-fast`   | `100ms ease-in-out` |
| normal | `--cl-transition-normal` | `200ms ease-in-out` |
| slow   | `--cl-transition-slow`   | `300ms ease-in-out` |

---

## Z-Index

| Token    | CSS Variable            | Value |
| -------- | ----------------------- | ----- |
| base     | `--cl-z-index-base`     | `0`   |
| dropdown | `--cl-z-index-dropdown` | `100` |
| sticky   | `--cl-z-index-sticky`   | `200` |
| modal    | `--cl-z-index-modal`    | `300` |
| toast    | `--cl-z-index-toast`    | `400` |
| tooltip  | `--cl-z-index-tooltip`  | `500` |
