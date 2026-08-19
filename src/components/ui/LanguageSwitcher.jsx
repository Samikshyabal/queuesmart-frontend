import { useTranslation } from 'react-i18next'

// The three languages required by the problem statement
const LANGUAGES = [
  { code: 'en', label: 'EN', title: 'English' },
  { code: 'hi', label: 'HI', title: 'हिंदी'   },
  { code: 'od', label: 'OD', title: 'ଓଡ଼ିଆ'   },
]

/**
 * LanguageSwitcher — pill-style EN / HI / OD toggle
 *
 * Props:
 *   className: extra classes for the wrapper
 */
export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const current = i18n.language

  return (
    <div
      role="group"
      aria-label="Select language"
      className={[
        'flex items-center gap-1 bg-dark-700 border border-surface-border rounded-xl p-1',
        className,
      ].join(' ')}
    >
      {LANGUAGES.map(({ code, label, title }) => (
        <button
          key={code}
          id={`lang-${code}`}
          title={title}
          aria-pressed={current === code}
          onClick={() => i18n.changeLanguage(code)}
          className={[
            'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200',
            current === code
              ? 'bg-primary-600 text-white shadow'
              : 'text-gray-400 hover:text-white hover:bg-white/5',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
