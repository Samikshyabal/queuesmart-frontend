/**
 * Card — glass-style container card used across all pages
 *
 * Props:
 *   padding  : 'none' | 'sm' | 'md' | 'lg'  (default: 'md')
 *   hover    : boolean — adds a lift + shadow effect on hover
 *   className: extra Tailwind classes
 *   children : card content
 */

const PADDING = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

export default function Card({
  children,
  padding = 'md',
  hover = false,
  className = '',
  ...rest
}) {
  return (
    <div
      className={[
        // Base glass card style (defined in index.css)
        'glass-card shadow-card',
        PADDING[padding] ?? PADDING.md,
        // Optional hover lift
        hover
          ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-500/30'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
