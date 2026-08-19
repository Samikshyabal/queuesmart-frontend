import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import Button from '../ui/Button'

/**
 * Navbar — sticky top navigation bar
 *
 * Props:
 *   isLoggedIn : boolean — controls which links and button to show
 *   onLogout   : function — called when the Logout button is clicked
 */
export default function Navbar({ isLoggedIn = false, onLogout }) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Active link style
  const linkClass = ({ isActive }) =>
    'text-sm font-medium transition-colors duration-200 ' +
    (isActive ? 'text-primary-400' : 'text-gray-400 hover:text-white')

  // Public nav links — always visible
  const publicLinks = [
    { to: '/',      label: t('nav.home'),     end: true },
    { to: '/token', label: t('nav.getToken')           },
    { to: '/queue', label: t('nav.liveQueue')          },
  ]

  // Staff links — only shown when logged in
  const staffLinks = [
    { to: '/admin',   label: t('nav.dashboard') },
    { to: '/counter', label: t('nav.counter')   },
  ]

  const allLinks = isLoggedIn ? [...publicLinks, ...staffLinks] : publicLinks

  return (
    <header className="sticky top-0 z-40 w-full bg-dark-900/80 backdrop-blur-md border-b border-surface-border">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Link
          to="/"
          id="nav-logo"
          className="flex items-center gap-2.5 select-none shrink-0"
        >
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-glow-primary">
            QS
          </div>
          <span className="font-bold text-white text-base hidden sm:block">
            Queue<span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Smart</span>
          </span>
        </Link>

        {/* ── Desktop nav links ──────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-6">
          {allLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* ── Right side: language + auth button ────────────────────────── */}
        <div className="flex items-center gap-3">
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
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              // X icon
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="nav-mobile-menu"
          className="md:hidden border-t border-surface-border bg-dark-800 px-4 py-4 flex flex-col gap-1 animate-fade-in"
        >
          {allLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                'px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ' +
                (isActive
                  ? 'bg-primary-600/15 text-primary-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5')
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Auth in mobile menu */}
          <div className="mt-2 pt-2 border-t border-surface-border">
            {isLoggedIn ? (
              <button
                onClick={() => { onLogout(); setMobileOpen(false) }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
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
