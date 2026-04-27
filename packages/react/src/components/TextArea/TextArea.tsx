import type { TextareaHTMLAttributes } from 'react'
import type { CLBaseProps } from '../../types/base.types'
import { resolveBaseStyle } from '../../types/base.types'

export type ResizeMode = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextAreaProps
  extends CLBaseProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'color' | 'onChange' | 'value' | 'defaultValue'> {
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  rows?: number
  resize?: ResizeMode
  showCount?: boolean
  error?: string
  helperText?: string
  onChange?: (value: string) => void
}

const resizeClass: Record<ResizeMode, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
}

export function TextArea({
  label,
  placeholder,
  value,
  defaultValue,
  rows = 4,
  resize = 'vertical',
  showCount = false,
  error,
  helperText,
  disabled,
  readOnly,
  required,
  maxLength,
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
}: TextAreaProps) {
  const baseStyle = resolveBaseStyle({ color, backgroundColor, padding, paddingX, paddingY, width, height, style })

  return (
    <div className="cl-component flex flex-col gap-1" style={{ width }}>
      {label && (
        <div className="flex justify-between items-baseline">
          <label
            htmlFor={id}
            className="text-[var(--cl-font-size-sm)] font-[var(--cl-font-weight-medium)] text-[var(--cl-color-neutral-700)]"
          >
            {label}
            {required && <span className="text-[var(--cl-color-error)] ml-0.5">*</span>}
          </label>
          {showCount && maxLength && (
            <span className="text-[var(--cl-font-size-xs)] text-[var(--cl-color-neutral-500)]">
              {(value ?? '').length}/{maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        {...rest}
        id={id}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
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
          resizeClass[resize],
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
