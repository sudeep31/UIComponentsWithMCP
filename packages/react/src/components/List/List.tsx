import type { HTMLAttributes } from 'react'
import type { CLBaseProps } from '../../types/base.types'
import { resolveBaseStyle } from '../../types/base.types'

export type ListVariant = 'unordered' | 'ordered' | 'descriptive'

export interface ListItem {
  id: string
  label: string
  description?: string
}

export interface ListProps
  extends CLBaseProps,
    Omit<HTMLAttributes<HTMLElement>, 'color' | 'onSelect'> {
  items?: ListItem[]
  variant?: ListVariant
  selectable?: boolean
  selectedId?: string
  dividers?: boolean
  compact?: boolean
  onSelect?: (id: string) => void
}

export function List({
  items = [],
  variant = 'unordered',
  selectable = false,
  selectedId,
  dividers = false,
  compact = false,
  onSelect,
  className = '',
  style,
  color,
  backgroundColor,
  padding,
  paddingX,
  paddingY,
  width,
  height,
  'data-testid': testId,
  ...rest
}: ListProps) {
  const baseStyle = resolveBaseStyle({ color, backgroundColor, padding, paddingX, paddingY, width, height, style })

  const itemPadding = compact ? 'py-1 px-2' : 'py-2 px-3'

  const renderItem = (item: ListItem, index: number) => {
    const isSelected = selectable && selectedId === item.id
    const isLast = index === items.length - 1

    return (
      <li
        key={item.id}
        role={selectable ? 'option' : undefined}
        aria-selected={selectable ? isSelected : undefined}
        onClick={selectable ? () => onSelect?.(item.id) : undefined}
        className={[
          'cl-component',
          itemPadding,
          'text-[var(--cl-font-size-md)] text-[var(--cl-color-neutral-900)]',
          selectable ? 'cursor-pointer select-none transition-colors duration-[var(--cl-transition-fast)]' : '',
          selectable && !isSelected ? 'hover:bg-[var(--cl-color-neutral-100)]' : '',
          isSelected
            ? 'bg-[var(--cl-color-primary-light)] text-[var(--cl-color-primary-dark)] font-[var(--cl-font-weight-medium)]'
            : '',
          dividers && !isLast ? 'border-b border-[var(--cl-color-border)]' : '',
          'rounded-[var(--cl-radius-sm)]',
        ].filter(Boolean).join(' ')}
      >
        <span>{item.label}</span>
        {item.description && (
          <p className="text-[var(--cl-font-size-sm)] text-[var(--cl-color-neutral-500)] mt-0.5">
            {item.description}
          </p>
        )}
      </li>
    )
  }

  const listClasses = [
    'list-none m-0 p-0',
    className,
  ].filter(Boolean).join(' ')

  if (variant === 'ordered') {
    return (
      <ol
        {...(rest as HTMLAttributes<HTMLOListElement>)}
        data-testid={testId}
        style={baseStyle}
        className={listClasses}
        role={selectable ? 'listbox' : undefined}
      >
        {items.map(renderItem)}
      </ol>
    )
  }

  if (variant === 'descriptive') {
    return (
      <dl
        {...(rest as HTMLAttributes<HTMLDListElement>)}
        data-testid={testId}
        style={baseStyle}
        className={listClasses}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={[
              itemPadding,
              dividers && index !== items.length - 1 ? 'border-b border-[var(--cl-color-border)]' : '',
            ].filter(Boolean).join(' ')}
          >
            <dt className="font-[var(--cl-font-weight-medium)] text-[var(--cl-font-size-md)] text-[var(--cl-color-neutral-900)]">
              {item.label}
            </dt>
            {item.description && (
              <dd className="text-[var(--cl-font-size-sm)] text-[var(--cl-color-neutral-500)] ml-0 mt-0.5">
                {item.description}
              </dd>
            )}
          </div>
        ))}
      </dl>
    )
  }

  return (
    <ul
      {...(rest as HTMLAttributes<HTMLUListElement>)}
      data-testid={testId}
      style={baseStyle}
      className={listClasses}
      role={selectable ? 'listbox' : undefined}
    >
      {items.map(renderItem)}
    </ul>
  )
}
