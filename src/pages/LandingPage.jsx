import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { MOCK_STATS, CATEGORY_CONFIG } from '../mockData'

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-slate-50">
      {/* Background soft ambient radial glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-100/60 rounded-full blur-[100px]" />
        <div className="absolute top-20 right-10 w-[400px] h-[250px] bg-accent-100/50 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200/80 rounded-full px-4 py-1.5 mb-6 animate-fade-in shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75 animate-pulse-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-600" />
          </span>
          <span className="text-xs font-bold text-primary-700 tracking-wide uppercase">
            {t('landing.badge')}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          {t('landing.heroTitle').split(' ').map((word, i) => {
            const highlight = ['Dark', 'अंधेरे', 'ଅନ୍ଧକାରରେ']
            return highlight.includes(word) ? (
              <span
                key={i}
                className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent"
              >
                {' '}{word}
              </span>
            ) : (
              <span key={i}>{i === 0 ? word : ' ' + word}</span>
            )
          })}
        </h1>

        {/* Description */}
        <p
          className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up font-normal"
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
            <Button id="hero-cta-token" variant="primary" size="lg" className="min-w-[180px] shadow-md">
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

        {/* Priority badges row */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <span className="text-xs font-medium text-slate-500 mr-1">Equitable priority for:</span>
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

// ── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <section className="border-y border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {MOCK_STATS.map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-3xl sm:text-4xl font-black text-primary-700 tracking-tight">
              {value}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Problem Statement Section ────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: '⏳',
    title: 'Hours Lost Waiting',
    desc: 'People spend hours standing in chaotic physical queues at public offices, banks, and hospitals — without knowing when their turn will come.',
    accentBorder: 'border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    icon: '🚫',
    title: 'Lack of Equitable Priority',
    desc: 'Senior citizens, pregnant women, and persons with disabilities wait equally in exhausting queues without automated fairness accommodation.',
    accentBorder: 'border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  {
    icon: '📊',
    title: 'Zero Operator Visibility',
    desc: 'Service centre staff cannot anticipate crowd surges or balance counter throughput, creating severe bottlenecks during peak hours.',
    accentBorder: 'border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600',
  },
]

function ProblemSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            The Queue Challenge
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why public service queues need{' '}
            <span className="text-primary-600">an upgrade</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-base">
            Physical standing queues waste productive hours and create frustration for both citizens and desk operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMS.map(({ icon, title, desc, iconBg }) => (
            <Card
              key={title}
              hover
              className="flex flex-col gap-4 p-6 sm:p-7 border border-slate-200"
            >
              <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center text-2xl shadow-2xs`}>
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    number: '01',
    titleKey: 'landing.step1Title',
    descKey:  'landing.step1Desc',
    color: 'from-primary-600 to-indigo-700',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H3a2 2 0 00-2 2v3a2 2 0 002 2h2V8z" />
      </svg>
    ),
  },
  {
    number: '02',
    titleKey: 'landing.step2Title',
    descKey:  'landing.step2Desc',
    color: 'from-accent-600 to-teal-700',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    number: '03',
    titleKey: 'landing.step3Title',
    descKey:  'landing.step3Desc',
    color: 'from-emerald-600 to-teal-700',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
]

function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-accent-700 uppercase tracking-widest bg-accent-50 border border-accent-200 px-3 py-1 rounded-full">
            Streamlined 3-Step Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('landing.howTitle')}
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-emerald-200"
            aria-hidden="true"
          />

          {STEPS.map(({ number, titleKey, descKey, color, icon }, i) => (
            <div
              key={number}
              className="relative flex flex-col items-center text-center gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}>
                {icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-slate-200 text-xs font-extrabold text-slate-700 flex items-center justify-center shadow-xs">
                  {i + 1}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{t(titleKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Key Features ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-Time Live Updates',
    desc: 'Live queue position updates on screen with no refresh needed. Visitors and staff stay in sync constantly.',
    badge: { label: 'Live Push', variant: 'success' },
  },
  {
    icon: '🛡️',
    title: 'Fairness Priority Engine',
    desc: 'Senior citizens, people with disabilities, and expectant mothers are served equitably and transparently.',
    badge: { label: 'Fairness SLA', variant: 'warning' },
  },
  {
    icon: '🌐',
    title: 'Three-Language Support',
    desc: 'Instant toggle between English, Hindi, and Odia to make public service accessible to all citizens.',
    badge: { label: 'EN / HI / OD', variant: 'info' },
  },
  {
    icon: '🤖',
    title: 'AI Wait Time Forecasting',
    desc: 'Time-series forecasting predicts footfall surges hour-by-hour so departments can scale counter capacity.',
    badge: { label: 'AI Powered', variant: 'info' },
  },
  {
    icon: '📱',
    title: 'SMS Alerts & QR Access',
    desc: 'Visitors scan a QR code to grab a token and receive SMS alerts when their turn is coming up.',
    badge: { label: 'Notifications', variant: 'normal' },
  },
  {
    icon: '📊',
    title: 'Operations Dashboard',
    desc: 'Full visibility over desk throughput, clerk workload, and active wait times with actionable metrics.',
    badge: { label: 'Operations', variant: 'normal' },
  },
]

function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-primary-700 uppercase tracking-widest bg-primary-50 border border-primary-200 px-3 py-1 rounded-full">
            Key Capabilities
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for high-traffic service centres
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc, badge }) => (
            <Card
              key={title}
              hover
              className="flex flex-col gap-3 p-6 border border-slate-200"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                  {icon}
                </div>
                <Badge variant={badge.variant} label={badge.label} size="sm" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Final CTA Section (Fixed Padding & Text Cutoff) ──────────────────────────
function FinalCTA() {
  const { t } = useTranslation()

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-indigo-900 p-8 sm:p-14 lg:p-16 text-center shadow-xl">
          {/* Subtle background circles */}
          <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-4 border-white" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full border-4 border-white" />
          </div>

          <div className="relative z-10 space-y-4">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-primary-200 bg-white/10 border border-white/20 px-3.5 py-1 rounded-full">
              Get Started in Seconds
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Ready to skip the line?
            </h2>

            <p className="text-primary-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed pb-4">
              Get your digital queue token in under 30 seconds and receive live notifications as your turn approaches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <Link to="/token" className="w-full sm:w-auto">
                <Button
                  id="final-cta-token"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] bg-white text-primary-800 hover:bg-slate-100 font-bold shadow-lg hover:shadow-xl border border-white"
                >
                  <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  {t('landing.ctaToken')}
                </Button>
              </Link>

              <Link to="/queue" className="w-full sm:w-auto">
                <Button
                  id="final-cta-live"
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/30 font-semibold"
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

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            QS
          </div>
          <span className="font-bold text-slate-900 text-sm">
            Queue<span className="text-primary-600">Smart</span>
          </span>
        </div>

        <p className="text-xs text-slate-500 text-center">
          SOAIDEATHON-S39 · Queue, Crowd &amp; Service Experience Optimization · Team Rocket
        </p>

        <div className="flex items-center gap-5 text-xs font-medium text-slate-600">
          <Link to="/queue" className="hover:text-primary-600 transition">Live Queue</Link>
          <Link to="/token" className="hover:text-primary-600 transition">Get Token</Link>
          <Link to="/login" className="hover:text-primary-600 transition">Staff Login</Link>
        </div>
      </div>
    </footer>
  )
}

// ── Default Export ───────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col bg-slate-50">
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
