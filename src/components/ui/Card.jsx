/**
 * Card — clean white surface container
 * Used across all CityCare Hospital views
 */

const PADDING = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
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
        'bg-white border border-surface-border rounded-xl shadow-card',
        PADDING[padding] ?? PADDING.md,
        hover
          ? 'transition-shadow duration-200 hover:shadow-card-hover hover:border-slate-300'
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
