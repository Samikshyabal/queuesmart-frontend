import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', label: 'EN', title: 'English' },
  { code: 'hi', label: 'HI', title: 'हिंदी'   },
  { code: 'od', label: 'OD', title: 'ଓଡ଼ିଆ'   },
]

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const current = i18n.language

  return (
    <div
      role="group"
      aria-label="Select language"
      className={[
        'flex items-center gap-0.5 bg-slate-100 border border-slate-200 rounded-xl p-1',
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
            'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150',
            current === code
              ? 'bg-white text-primary-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
