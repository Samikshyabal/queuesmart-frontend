/**
 * Badge — used for priority categories and status labels
 *
 * Props:
 *   variant : 'normal' | 'senior' | 'disabled' | 'pregnant'
 *             | 'success' | 'warning' | 'danger' | 'info'
 *   size    : 'sm' | 'md'  (default: 'md')
 *   showIcon: boolean — shows an emoji icon before the label
 *   label   : string — the text to display
 */

// Color styles per variant
const VARIANTS = {
  // Priority categories
  normal:   'bg-primary-500/15  text-primary-300  border-primary-500/30',
  senior:   'bg-warning-500/15  text-warning-400  border-warning-500/30',
  disabled: 'bg-accent-500/15   text-accent-300   border-accent-500/30',
  pregnant: 'bg-pink-500/15     text-pink-300     border-pink-500/30',
  // General status
  success:  'bg-success-500/15  text-success-400  border-success-500/30',
  warning:  'bg-warning-500/15  text-warning-400  border-warning-500/30',
  danger:   'bg-danger-500/15   text-danger-400   border-danger-500/30',
  info:     'bg-primary-500/15  text-primary-300  border-primary-500/30',
}

// Optional icons for priority categories
const ICONS = {
  senior:   '👴',
  disabled: '♿',
  pregnant: '🤰',
  normal:   '👤',
}

const SIZES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
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
        'inline-flex items-center gap-1 font-medium rounded-full border',
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
