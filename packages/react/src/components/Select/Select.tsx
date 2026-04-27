import type { SelectHTMLAttributes } from 'react'
import type { CLBaseProps } from '../../types/base.types'
import { resolveBaseStyle } from '../../types/base.types'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends CLBaseProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'color' | 'onChange' | 'value'> {
  label?: string
  options?: SelectOption[]
  value?: string
  placeholder?: string
  error?: string
  helperText?: string
  onChange?: (value: string) => void
}

export function Select({
  label,
  options = [],
  value,
  placeholder = 'Select...',
  error,
  helperText,
  disabled,
  required,
  onChange,
  className = '',
  style,
  color,
  backgroundColor,
  padding,
  paddingX,
  paddingY,
  width,
  height,
  id,
  'data-testid': testId,
  ...rest
}: SelectProps) {
  const baseStyle = resolveBaseStyle({ color, backgroundColor, padding, paddingX, paddingY, width, height, style })

  return (
    <div className="cl-component flex flex-col gap-1" style={{ width }}>
      {label && (
        <label
          htmlFor={id}
          className="text-[var(--cl-font-size-sm)] font-[var(--cl-font-weight-medium)] text-[var(--cl-color-neutral-700)]"
        >
          {label}
          {required && <span className="text-[var(--cl-color-error)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          {...rest}
          id={id}
          value={value}
          disabled={disabled}
          required={required}
          data-testid={testId}
          onChange={(e) => onChange?.(e.target.value)}
          style={{ ...baseStyle, width: undefined }}
          className={[
            'block w-full px-3 py-2 pr-8 appearance-none',
            'text-[var(--cl-font-size-md)]',
            'bg-[var(--cl-color-surface)]',
            'border rounded-[var(--cl-radius-md)]',
            'transition-colors duration-[var(--cl-transition-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--cl-color-focus-ring)] focus:border-[var(--cl-color-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--cl-color-neutral-100)]',
            value ? 'text-[var(--cl-color-neutral-900)]' : 'text-[var(--cl-color-neutral-400)]',
            error
              ? 'border-[var(--cl-color-error)]'
              : 'border-[var(--cl-color-border)] hover:border-[var(--cl-color-neutral-400)]',
            className,
          ].filter(Boolean).join(' ')}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[var(--cl-color-neutral-500)]">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      {(error || helperText) && (
        <p className={[
          'text-[var(--cl-font-size-xs)]',
          error ? 'text-[var(--cl-color-error)]' : 'text-[var(--cl-color-neutral-500)]',
        ].join(' ')}>
          {error ?? helperText}
        </p>
      )}
    </div>
  )
}
