/**
 * Badge — priority category and status labels
 * Colors mapped to CityCare Hospital clinical conventions:
 *   green = available / normal / done
 *   amber = moderate / warning
 *   red   = critical / busy / danger
 *   teal  = info / active
 */

const VARIANTS = {
  // ── Patient priority categories ────────────────────────────────────────────
  normal:   'bg-slate-100       text-slate-700       border-slate-300',
  senior:   'bg-amber-50        text-amber-800       border-amber-300',
  disabled: 'bg-teal-50         text-teal-800        border-teal-300',
  pregnant: 'bg-pink-50         text-pink-800        border-pink-300',

  // ── General status labels ──────────────────────────────────────────────────
  success:  'bg-success-50      text-success-700     border-success-200',
  warning:  'bg-warning-100     text-warning-700     border-warning-300',
  danger:   'bg-danger-50       text-danger-700      border-danger-200',
  info:     'bg-primary-50      text-primary-700     border-primary-200',
}

const ICONS = {
  senior:   '👴',
  disabled: '♿',
  pregnant: '🤰',
  normal:   '👤',
}

const SIZES = {
  sm: 'text-2xs px-2 py-0.5 font-semibold',
  md: 'text-xs  px-2.5 py-1 font-semibold',
}

export default function Badge({
  variant = 'normal',
  size = 'md',
  showIcon = false,
  label,
  className = '',
}) {
  const colorClass = VARIANTS[variant] ?? VARIANTS.normal
  const sizeClass  = SIZES[size]       ?? SIZES.md
  const icon       = showIcon ? ICONS[variant] : null

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full border',
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
