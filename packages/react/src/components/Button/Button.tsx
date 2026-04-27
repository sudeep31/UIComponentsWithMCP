import type { ButtonHTMLAttributes } from 'react'
import type { CLBaseProps } from '../../types/base.types'
import { resolveBaseStyle } from '../../types/base.types'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends CLBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Visual style variant */
  variant?: ButtonVariant
  /** Size preset */
  size?: ButtonSize
  /** Button label text */
  label?: string
  /** Show loading spinner and disable interaction */
  loading?: boolean
  /** Stretch to full container width */
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--cl-color-primary)] text-white hover:bg-[var(--cl-color-primary-dark)] focus-visible:ring-[var(--cl-color-focus-ring)]',
  secondary:
    'bg-[var(--cl-color-primary-light)] text-[var(--cl-color-primary-dark)] hover:bg-[var(--cl-color-neutral-200)] focus-visible:ring-[var(--cl-color-focus-ring)]',
  ghost:
    'bg-transparent text-[var(--cl-color-neutral-700)] hover:bg-[var(--cl-color-neutral-100)] focus-visible:ring-[var(--cl-color-focus-ring)]',
  danger:
    'bg-[var(--cl-color-error)] text-white hover:opacity-90 focus-visible:ring-[var(--cl-color-error)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[var(--cl-font-size-sm)] rounded-[var(--cl-radius-sm)]',
  md: 'px-4 py-2 text-[var(--cl-font-size-md)] rounded-[var(--cl-radius-md)]',
  lg: 'px-6 py-3 text-[var(--cl-font-size-lg)] rounded-[var(--cl-radius-lg)]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  loading = false,
  fullWidth = false,
  disabled,
  children,
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
}: ButtonProps) {
  const baseStyle = resolveBaseStyle({
    color,
    backgroundColor,
    padding,
    paddingX,
    paddingY,
    width,
    height,
    style,
  })

  const isDisabled = disabled || loading

  return (
    <button
      {...rest}
      disabled={isDisabled}
      data-testid={testId}
      style={baseStyle}
      className={[
        'cl-component',
        'inline-flex items-center justify-center gap-2',
        'font-[var(--cl-font-weight-semibold)]',
        'border border-transparent',
        'transition-all duration-[var(--cl-transition-normal)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      {label ?? children}
    </button>
  )
}
