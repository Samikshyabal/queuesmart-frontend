import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import Button from '../ui/Button'

export default function Navbar({ isLoggedIn = false, onLogout }) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    'text-sm font-medium transition-colors duration-150 ' +
    (isActive
      ? 'text-primary-600 font-semibold'
      : 'text-slate-500 hover:text-slate-900')

  const publicLinks = [
    { to: '/',      label: t('nav.home'),      end: true },
    { to: '/token', label: t('nav.getToken')             },
    { to: '/queue', label: t('nav.liveQueue')            },
  ]

  const staffLinks = [
    { to: '/admin',   label: t('nav.dashboard') },
    { to: '/counter', label: t('nav.counter')   },
  ]

  const allLinks = isLoggedIn ? [...publicLinks, ...staffLinks] : publicLinks

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-surface-border shadow-sm">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Link
          to="/"
          id="nav-logo"
          className="flex items-center gap-2.5 select-none shrink-0 group"
        >
          {/* Medical cross icon — teal */}
          <div className="w-8 h-8 rounded-lg bg-accent-700 flex items-center justify-center text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-semibold text-slate-900 text-sm tracking-tight">
              CityCare <span className="text-accent-700">Hospital</span>
            </span>
            <span className="text-2xs text-slate-400 font-normal">
              Care that moves with you
            </span>
          </div>
        </Link>

        {/* ── Desktop nav links ──────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-6">
          {allLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* ── Right side: language + auth ────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />

          {isLoggedIn ? (
            <Button
              id="nav-logout"
              variant="ghost"
              size="sm"
              onClick={onLogout}
            >
              {t('nav.logout')}
            </Button>
          ) : (
            <Link to="/login" id="nav-login">
              <Button variant="secondary" size="sm">
                {t('nav.staffLogin')}
              </Button>
            </Link>
          )}

          {/* ── Mobile hamburger ────────────────────────────────────────── */}
          <button
            id="nav-mobile-toggle"
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="nav-mobile-menu"
          className="md:hidden border-t border-surface-border bg-white px-4 py-3 flex flex-col gap-0.5 animate-fade-in shadow-md"
        >
          {allLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ' +
                (isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="mt-1.5 pt-2 border-t border-slate-100">
            {isLoggedIn ? (
              <button
                onClick={() => { onLogout(); setMobileOpen(false) }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t('nav.staffLogin')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
