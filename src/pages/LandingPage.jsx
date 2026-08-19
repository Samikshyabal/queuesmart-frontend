import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { MOCK_STATS, CATEGORY_CONFIG } from '../mockData'

// ─────────────────────────────────────────────────────────────────────────────
// Section: Hero
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-accent-500/15 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75 animate-pulse-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
          </span>
          <span className="text-xs font-semibold text-primary-300 tracking-wide uppercase">
            {t('landing.badge')}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          {t('landing.heroTitle').split(' ').map((word, i) => {
            // Highlight "Dark" / key word with gradient
            const highlight = ['Dark', 'अंधेरे', 'ଅନ୍ଧକାରରେ']
            return highlight.includes(word)
              ? (
                <span
                  key={i}
                  className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"
                >
                  {' '}{word}
                </span>
              )
              : <span key={i}>{i === 0 ? word : ' ' + word}</span>
          })}
        </h1>

        {/* Description */}
        <p
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {t('landing.heroDesc')}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link to="/token">
            <Button id="hero-cta-token" variant="primary" size="lg" className="min-w-[180px]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              {t('landing.ctaToken')}
            </Button>
          </Link>

          <Link to="/login">
            <Button id="hero-cta-staff" variant="secondary" size="lg" className="min-w-[180px]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('landing.ctaStaff')}
            </Button>
          </Link>
        </div>

        {/* Priority badges row — visual hint */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2 animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          <span className="text-xs text-gray-500 mr-1">Priority support for:</span>
          {Object.entries(CATEGORY_CONFIG)
            .filter(([key]) => key !== 'normal')
            .map(([key, cfg]) => (
              <Badge key={key} variant={key} label={cfg.label} showIcon size="sm" />
            ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Stats bar
// ─────────────────────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <section className="border-y border-surface-border bg-dark-800/60 backdrop-blur-sm py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_STATS.map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Problem statement
// ─────────────────────────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: '⏳',
    title: 'Hours Lost Waiting',
    desc: 'People spend hours standing in chaotic queues at hospitals, banks, and government offices — with no idea when their turn will come.',
  },
  {
    icon: '🚫',
    title: 'No Priority System',
    desc: 'Senior citizens, pregnant women, and people with disabilities are forced to wait equally in long lines, with no system to protect their needs.',
  },
  {
    icon: '📊',
    title: 'No Staff Visibility',
    desc: 'Service centre staff cannot predict crowd surges or manage counter load, leading to bottlenecks, delays, and poor service quality.',
  },
]

function ProblemSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-danger-400 uppercase tracking-widest">The Problem</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Why do queues still feel like{' '}
            <span className="bg-gradient-to-r from-danger-400 to-warning-400 bg-clip-text text-transparent">
              1970?
            </span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Public service queues remain one of the most frustrating daily experiences — broken, unfair, and invisible.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMS.map(({ icon, title, desc }, i) => (
            <Card
              key={title}
              hover
              className="flex flex-col gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-dark-700 border border-surface-border flex items-center justify-center text-2xl">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: How it works
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    number: '01',
    titleKey: 'landing.step1Title',
    descKey:  'landing.step1Desc',
    color: 'from-primary-500 to-primary-700',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H3a2 2 0 00-2 2v3a2 2 0 002 2h2V8z" />
      </svg>
    ),
  },
  {
    number: '02',
    titleKey: 'landing.step2Title',
    descKey:  'landing.step2Desc',
    color: 'from-accent-500 to-accent-700',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    number: '03',
    titleKey: 'landing.step3Title',
    descKey:  'landing.step3Desc',
    color: 'from-success-600 to-accent-600',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
]

function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-dark-800/40">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-accent-400 uppercase tracking-widest">Simple Process</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            {t('landing.howTitle')}
          </h2>
        </div>

        {/* Steps — horizontal connector on desktop */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-primary-500/40 via-accent-500/40 to-success-500/40"
            aria-hidden="true"
          />

          {STEPS.map(({ number, titleKey, descKey, color, icon }, i) => (
            <div
              key={number}
              className="relative flex flex-col items-center text-center gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Step icon circle */}
              <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-card`}>
                {icon}
                {/* Step number badge */}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-dark-800 border border-surface-border text-xs font-bold text-gray-300 flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg mb-1">{t(titleKey)}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Key Features
// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-Time Live Updates',
    desc: 'Your queue position updates live on screen — no refresh needed. Know exactly where you stand at every moment.',
    badge: { label: 'Live', variant: 'success' },
  },
  {
    icon: '🛡️',
    title: 'Priority Fairness Engine',
    desc: 'Senior citizens, people with disabilities, and pregnant women are served faster — automatically, fairly, and transparently.',
    badge: { label: 'Fair', variant: 'warning' },
  },
  {
    icon: '🌐',
    title: 'Three-Language Support',
    desc: 'Full interface in English, Hindi, and Odia — switch languages instantly with one tap, no app restart needed.',
    badge: { label: 'EN / HI / OD', variant: 'info' },
  },
  {
    icon: '🤖',
    title: 'AI-Powered Wait Prediction',
    desc: 'Predicts how busy the centre will be hour by hour using past footfall data — so staff can prepare before the rush hits.',
    badge: { label: 'AI', variant: 'info' },
  },
  {
    icon: '📱',
    title: 'SMS & App Alerts',
    desc: "Get a notification when you're next — so you don't have to sit and stare at the screen. Works even without internet.",
    badge: { label: 'Alerts', variant: 'normal' },
  },
  {
    icon: '📊',
    title: 'Staff Dashboard',
    desc: 'Admins see live queue analytics, counter load, and crowd predictions — giving them the tools to act before problems escalate.',
    badge: { label: 'Admin', variant: 'normal' },
  },
]

function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">Why QueueSmart</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Everything a smart queue needs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc, badge }, i) => (
            <Card
              key={title}
              hover
              className="flex flex-col gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-dark-700 border border-surface-border flex items-center justify-center text-xl">
                  {icon}
                </div>
                <Badge variant={badge.variant} label={badge.label} size="sm" />
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Final CTA
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTA() {
  const { t } = useTranslation()

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 to-accent-700 p-10 sm:p-14 text-center shadow-glow-primary">
          {/* Background texture */}
          <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-2 border-white" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full border-2 border-white" />
          </div>

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to skip the line?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of people who no longer waste hours waiting. Get your token in under 30 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/token">
                <Button
                  id="final-cta-token"
                  variant="success"
                  size="lg"
                  className="min-w-[180px] bg-white text-primary-700 hover:bg-gray-100 shadow-none"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  {t('landing.ctaToken')}
                </Button>
              </Link>
              <Link to="/queue">
                <Button
                  id="final-cta-live"
                  variant="ghost"
                  size="lg"
                  className="min-w-[180px] text-white border-white/30 hover:bg-white/10"
                >
                  View Live Queue →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Footer
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-surface-border py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs">
            QS
          </div>
          <span className="font-bold text-white text-sm">
            Queue<span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Smart</span>
          </span>
        </div>

        <p className="text-xs text-gray-600 text-center">
          SOAIDEATHON-S39 · Queue, Crowd &amp; Service Experience Optimization · Team Rocket
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-600">
          <Link to="/queue"  className="hover:text-gray-400 transition">Live Queue</Link>
          <Link to="/token"  className="hover:text-gray-400 transition">Get Token</Link>
          <Link to="/login"  className="hover:text-gray-400 transition">Staff Login</Link>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LandingPage — assembles all sections
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <StatsBar />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
