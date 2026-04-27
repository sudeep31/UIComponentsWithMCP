import type { CSSProperties } from 'react'

/**
 * Base props shared by every CL component.
 * All style props accept any valid CSS value string.
 */
export interface CLBaseProps {
    /** HTML id attribute */
    id?: string

    /** Additional CSS class names to merge */
    className?: string

    /** Inline style override — use for one-off adjustments */
    style?: CSSProperties

    /**
     * Foreground / text color.
     * Accepts any CSS color value or a CL token var e.g. `var(--cl-color-primary)`
     */
    color?: string

    /**
     * Background color.
     * Accepts any CSS color value or a CL token var.
     */
    backgroundColor?: string

    /**
     * CSS shorthand padding e.g. `"8px 16px"`.
     * `paddingX` / `paddingY` take precedence over this when both are set.
     */
    padding?: string

    /** Left + right padding — overrides `padding` on the horizontal axis */
    paddingX?: string

    /** Top + bottom padding — overrides `padding` on the vertical axis */
    paddingY?: string

    /** CSS width value e.g. `"200px"`, `"100%"`, `"auto"` */
    width?: string

    /** CSS height value */
    height?: string

    /** `data-testid` attribute for testing selectors */
    'data-testid'?: string
}

/**
 * Resolves CLBaseProps style overrides into a merged CSSProperties object.
 * Used internally by every component.
 */
export function resolveBaseStyle(props: CLBaseProps): CSSProperties {
    const {
        style,
        color,
        backgroundColor,
        padding,
        paddingX,
        paddingY,
        width,
        height,
    } = props

    const resolved: CSSProperties = {}

    if (color) resolved.color = color
    if (backgroundColor) resolved.backgroundColor = backgroundColor
    if (width) resolved.width = width
    if (height) resolved.height = height

    // Padding resolution: paddingX/paddingY override the shorthand
    if (padding) resolved.padding = padding
    if (paddingY) {
        resolved.paddingTop = paddingY
        resolved.paddingBottom = paddingY
    }
    if (paddingX) {
        resolved.paddingLeft = paddingX
        resolved.paddingRight = paddingX
    }

    return { ...resolved, ...style }
}
