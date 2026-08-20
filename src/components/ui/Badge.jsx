/**
 * Badge — used for priority categories and status labels (Light Theme)
 */

const VARIANTS = {
  // Priority categories
  normal:   'bg-slate-100       text-slate-700       border-slate-300',
  senior:   'bg-amber-50        text-amber-800       border-amber-300/80',
  disabled: 'bg-cyan-50         text-cyan-800        border-cyan-300/80',
  pregnant: 'bg-pink-50         text-pink-800        border-pink-300/80',
  // General status
  success:  'bg-emerald-50      text-emerald-800     border-emerald-300/80',
  warning:  'bg-amber-50        text-amber-800       border-amber-300/80',
  danger:   'bg-rose-50         text-rose-800        border-rose-300/80',
  info:     'bg-indigo-50       text-indigo-800      border-indigo-300/80',
}

const ICONS = {
  senior:   '👴',
  disabled: '♿',
  pregnant: '🤰',
  normal:   '👤',
}

const SIZES = {
  sm: 'text-2xs px-2 py-0.5 font-semibold',
  md: 'text-xs px-2.5 py-1 font-semibold',
}

export default function Badge({
  variant = 'normal',
  size = 'md',
  showIcon = false,
  label,
  className = '',
}) {
  const colorClass = VARIANTS[variant] ?? VARIANTS.normal
  const sizeClass  = SIZES[size]   ?? SIZES.md
  const icon       = showIcon ? ICONS[variant] : null

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full border shadow-2xs',
        colorClass,
        sizeClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </span>
  )
}
