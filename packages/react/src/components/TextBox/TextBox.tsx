import type { InputHTMLAttributes } from 'react'
import type { CLBaseProps } from '../../types/base.types'
import { resolveBaseStyle } from '../../types/base.types'

export interface TextBoxProps
  extends CLBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'onChange' | 'value' | 'defaultValue'> {
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  error?: string
  helperText?: string
  onChange?: (value: string) => void
}

export function TextBox({
  label,
  placeholder,
  value,
  defaultValue,
  error,
  helperText,
  disabled,
  readOnly,
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
}: TextBoxProps) {
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
      <input
        {...rest}
        id={id}
        type="text"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        data-testid={testId}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ ...baseStyle, width: undefined }}
        className={[
          'block w-full px-3 py-2',
          'text-[var(--cl-font-size-md)] text-[var(--cl-color-neutral-900)]',
          'bg-[var(--cl-color-surface)]',
          'border rounded-[var(--cl-radius-md)]',
          'transition-colors duration-[var(--cl-transition-fast)]',
          'placeholder:text-[var(--cl-color-neutral-400)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--cl-color-focus-ring)] focus:border-[var(--cl-color-primary)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--cl-color-neutral-100)]',
          error
            ? 'border-[var(--cl-color-error)]'
            : 'border-[var(--cl-color-border)] hover:border-[var(--cl-color-neutral-400)]',
          className,
        ].filter(Boolean).join(' ')}
      />
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
