/**
 * Card — clean container card used across all pages (Light Theme)
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
        'bg-white border border-slate-200/90 rounded-2xl shadow-card',
        PADDING[padding] ?? PADDING.md,
        hover
          ? 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-slate-300'
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
