/**
 * Button — reusable button component
 *
 * Props:
 *   variant  : 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'  (default: 'primary')
 *   size     : 'sm' | 'md' | 'lg'  (default: 'md')
 *   fullWidth: boolean  (default: false)
 *   loading  : boolean — shows a spinner and disables the button
 *   disabled : boolean
 *   onClick  : function
 *   type     : 'button' | 'submit' | 'reset'  (default: 'button')
 *   children : content inside the button
 */

const VARIANTS = {
  primary:
    'bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white shadow-glow-primary',
  secondary:
    'bg-surface hover:bg-surface-light border border-surface-border text-white',
  ghost:
    'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border border-transparent',
  danger:
    'bg-danger-500 hover:bg-danger-600 text-white',
  success:
    'bg-success-600 hover:bg-success-500 text-white',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed select-none'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        base,
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}
