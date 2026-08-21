import { Link } from 'react-router-dom'
import { MOCK_QUEUE_STATUS, DEPARTMENT_CONFIG, CATEGORY_CONFIG } from '../mockData'

// ─────────────────────────────────────────────────────────────────────────────
// DATA PROVENANCE
// Every displayed value is annotated below. No value is fabricated beyond what
// already exists in mockData.js, which is shared with AdminDashboard and
// QueueDisplayPage. Replace each with a real API response when the backend is ready.
//
//  MOCK_QUEUE_STATUS.tokensServedToday  — mock data (mockData.js)
//  MOCK_QUEUE_STATUS.totalInQueue       — mock data (mockData.js)
//  MOCK_QUEUE_STATUS.avgWaitMinutes     — mock data (mockData.js)
//  MOCK_QUEUE_STATUS.activeCounters     — mock data (mockData.js)
//  MOCK_QUEUE_STATUS.doctorsOnDuty      — mock data (mockData.js)
//  MOCK_QUEUE_STATUS.priorityUsersWaiting — mock data (mockData.js)
//  DEPARTMENT_CONFIG                    — static config (mockData.js)
//  CATEGORY_CONFIG                      — static config (mockData.js)
//  Hospital name / tagline / address    — static text
//  OPD hours                            — static text
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Hospital identity header
// Static text: hospital name, tagline, location, phone
// ─────────────────────────────────────────────────────────────────────────────
function HospitalHeader() {
  return (
    <section className="bg-white border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            {/* Medical cross — teal */}
            <div className="w-14 h-14 rounded-xl bg-accent-700 flex items-center justify-center text-white shrink-0 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
            </div>
            <div>
              {/* Static text */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                CityCare Hospital
              </h1>
              <p className="text-sm text-slate-500 mt-0.5 font-normal">
                Care that moves with you
              </p>
            </div>
          </div>

          {/* Info strip — static text */}
          <div className="flex flex-col sm:items-end gap-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Plot 12, Saheed Nagar, Bhubaneswar — 751 007, Odisha
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0674 — 234 5678 &nbsp;|&nbsp; Emergency: 0674 — 234 5679
            </span>
            <span className="flex items-center gap-1.5">
              {/* Static: OPD hours */}
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              OPD Hours: Mon – Sat, 8:00 AM – 5:00 PM &nbsp;|&nbsp; Emergency: 24×7
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Patient welcome / orientation
// Static text — no backend data
// ─────────────────────────────────────────────────────────────────────────────
function WelcomeBanner() {
  return (
    <section className="bg-accent-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {/* Static text */}
          <p className="text-sm font-semibold text-accent-100 uppercase tracking-wider mb-0.5">
            Patient Digital Services
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
            Welcome to CityCare Hospital
          </h2>
          <p className="text-sm text-accent-100 mt-1 font-normal max-w-xl">
            Book your OPD token, track your position in the queue, and check department availability — without waiting in a corridor.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link to="/token">
            <button
              id="welcome-cta-token"
              className="bg-white text-accent-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent-50 transition-colors shadow-sm"
            >
              Book OPD Token
            </button>
          </Link>
          <Link to="/queue">
            <button
              id="welcome-cta-queue"
              className="bg-accent-600 text-white text-sm font-medium px-4 py-2 rounded-lg border border-accent-500 hover:bg-accent-500 transition-colors"
            >
              Live Queue
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — Live hospital activity metrics
// Source: MOCK_QUEUE_STATUS (mockData.js) — replace with API when available
// ─────────────────────────────────────────────────────────────────────────────
const BUSY_THRESHOLD = 20 // patients — above this, queue is considered busy

function ActivityMetrics() {
  // All values from: MOCK_QUEUE_STATUS — mockData.js
  const {
    tokensServedToday,
    totalInQueue,
    avgWaitMinutes,
    doctorsOnDuty,
    priorityUsersWaiting,
  } = MOCK_QUEUE_STATUS

  const queueLoad =
    totalInQueue < 10 ? { label: 'Low', color: 'text-success-600', dot: 'bg-success-500' }
    : totalInQueue < BUSY_THRESHOLD ? { label: 'Moderate', color: 'text-warning-600', dot: 'bg-warning-500' }
    : { label: 'High', color: 'text-danger-600', dot: 'bg-danger-500' }

  const METRICS = [
    {
      id: 'served',
      label: 'Patients Served Today',
      // Source: MOCK_QUEUE_STATUS.tokensServedToday (mockData.js)
      value: `${tokensServedToday}`,
      unit: 'patients',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'text-success-600',
      bg: 'bg-success-50',
      border: 'border-l-success-500',
    },
    {
      id: 'waiting',
      label: 'Currently Waiting',
      // Source: MOCK_QUEUE_STATUS.totalInQueue (mockData.js)
      value: `${totalInQueue}`,
      unit: 'patients',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      accent: queueLoad.color,
      bg: 'bg-slate-50',
      border: 'border-l-primary-500',
    },
    {
      id: 'wait',
      label: 'Average Wait Time',
      // Source: MOCK_QUEUE_STATUS.avgWaitMinutes (mockData.js)
      value: `${avgWaitMinutes}`,
      unit: 'min',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'text-warning-600',
      bg: 'bg-warning-50',
      border: 'border-l-warning-500',
    },
    {
      id: 'doctors',
      label: 'Doctors On Duty',
      // Source: MOCK_QUEUE_STATUS.doctorsOnDuty (mockData.js)
      value: `${doctorsOnDuty}`,
      unit: 'available',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'text-accent-700',
      bg: 'bg-accent-50',
      border: 'border-l-accent-600',
    },
  ]

  return (
    <section className="bg-surface-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Live dot */}
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-success-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
            </span>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Today's Hospital Activity
            </h2>
          </div>
          {/* Queue load indicator — derived from MOCK_QUEUE_STATUS.totalInQueue */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span className={`w-2 h-2 rounded-full ${queueLoad.dot}`} />
            Queue Load:
            <span className={`font-bold ${queueLoad.color}`}>{queueLoad.label}</span>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {METRICS.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-xl border border-surface-border border-l-4 ${m.border} shadow-card px-4 py-4`}
            >
              <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center ${m.accent} mb-3`}>
                {m.icon}
              </div>
              <div className={`text-2xl font-bold text-slate-900 leading-none`}>
                {m.value}
                <span className="text-sm font-normal text-slate-400 ml-1">{m.unit}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Priority note — Source: MOCK_QUEUE_STATUS.priorityUsersWaiting (mockData.js) */}
        {priorityUsersWaiting > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-warning-200 rounded-lg px-4 py-2.5 text-xs text-amber-800 font-medium">
            <svg className="w-4 h-4 text-warning-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {priorityUsersWaiting} priority patient{priorityUsersWaiting > 1 ? 's' : ''} currently waiting — wheelchair &amp; senior assistance available at the Emergency Desk.
          </div>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Patient services (links to existing routes)
// Routes: existing (App.jsx) — /token, /queue, /queue (search)
// No new routes added. Appointment booking omitted — route does not exist.
// ─────────────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'book-token',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Get Walk-in OPD Token',
    desc: 'Register your arrival and receive a digital queue token for any OPD department. Track your position without queuing.',
    cta: 'Book Token',
    href: '/token',  // existing route
    emphasis: true,
  },
  {
    id: 'live-queue',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    title: 'View Live Queue Status',
    desc: 'See which OPD tokens are currently being served, who is next, and the live wait time for each department.',
    cta: 'View Queue',
    href: '/queue',  // existing route
    emphasis: false,
  },
  {
    id: 'track-token',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Track Your Token',
    desc: 'Enter your OPD token number to instantly see your queue position and updated estimated wait time.',
    cta: 'Track Position',
    href: '/queue',  // existing route — search UI on the queue page
    emphasis: false,
  },
  {
    id: 'priority',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Priority Assistance',
    desc: 'Senior citizens, patients with disabilities, and expectant mothers receive priority tokens and are served first.',
    cta: 'Learn More',
    href: '/token',  // existing route — category selection on token page
    emphasis: false,
  },
]

function PatientServices() {
  return (
    <section className="bg-white border-y border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">
          Patient Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border shadow-card p-5 flex flex-col gap-3 transition-shadow duration-150 hover:shadow-card-hover ${
                s.emphasis
                  ? 'border-primary-200 bg-primary-50'
                  : 'border-surface-border bg-white hover:border-slate-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                s.emphasis ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {s.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <Link
                to={s.href}
                className={`text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                  s.emphasis
                    ? 'text-primary-600 hover:text-primary-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.cta}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — Department overview
// Source: DEPARTMENT_CONFIG (mockData.js) — static config
// Status and wait time are derived from MOCK_QUEUE_STATUS (mockData.js)
// ─────────────────────────────────────────────────────────────────────────────

// Per-department status — static config as no per-dept backend data exists
const DEPT_STATUS = {
  opd:       { status: 'Open',    statusColor: 'text-success-700', dotColor: 'bg-success-500', hours: '8:00 AM – 5:00 PM' },
  pharmacy:  { status: 'Open',    statusColor: 'text-success-700', dotColor: 'bg-success-500', hours: '8:00 AM – 8:00 PM' },
  lab:       { status: 'Open',    statusColor: 'text-success-700', dotColor: 'bg-success-500', hours: '7:00 AM – 6:00 PM' },
  emergency: { status: '24 × 7', statusColor: 'text-danger-700',  dotColor: 'bg-danger-500',  hours: 'Always Open' },
}

function DepartmentOverview() {
  // avgWaitMinutes from MOCK_QUEUE_STATUS — used as approximate for all OPD depts
  const avgWait = MOCK_QUEUE_STATUS.avgWaitMinutes

  return (
    <section className="bg-surface-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Departments Open Today
          </h2>
          <Link to="/queue" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View Full Queue
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Source: DEPARTMENT_CONFIG — mockData.js static config */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEPARTMENT_CONFIG.map((dept) => {
            const ds = DEPT_STATUS[dept.id] || DEPT_STATUS.opd
            return (
              <div
                key={dept.id}
                className="bg-white rounded-xl border border-surface-border shadow-card p-4 flex flex-col gap-3 hover:shadow-card-hover hover:border-slate-300 transition-shadow"
              >
                {/* Icon + status */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                    {dept.icon}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${ds.dotColor}`} />
                    <span className={`text-xs font-semibold ${ds.statusColor}`}>{ds.status}</span>
                  </div>
                </div>

                {/* Name and counter */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{dept.counter}</p>
                </div>

                {/* Hours — static text */}
                <p className="text-xs text-slate-400 font-medium border-t border-slate-100 pt-2.5">
                  🕐 {ds.hours}
                </p>

                {/* Estimated wait — approximated from MOCK_QUEUE_STATUS.avgWaitMinutes for OPD;
                    Emergency has no queue wait */}
                {dept.id !== 'emergency' && (
                  <p className="text-xs text-warning-700 font-medium -mt-1">
                    Est. wait: ~{avgWait} min
                  </p>
                )}

                <Link
                  to="/token"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-colors"
                >
                  Get Token
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — Hospital status / practical info
// Static text — no backend. Priority care categories from CATEGORY_CONFIG.
// ─────────────────────────────────────────────────────────────────────────────
function HospitalInfo() {
  return (
    <section className="bg-white border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
          Useful Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Priority care — Source: CATEGORY_CONFIG keys (mockData.js) */}
          <div className="rounded-xl border border-surface-border p-5 bg-surface-soft">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-warning-100 flex items-center justify-center text-warning-700">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              Priority Care
            </h3>
            <ul className="space-y-2">
              {/* Source: CATEGORY_CONFIG — mockData.js */}
              {Object.entries(CATEGORY_CONFIG)
                .filter(([key]) => key !== 'normal')
                .map(([key, cfg]) => (
                  <li key={key} className="flex items-center gap-2 text-xs text-slate-600">
                    <span aria-hidden="true">{cfg.icon}</span>
                    {cfg.label} — served with priority
                  </li>
                ))}
            </ul>
          </div>

          {/* 2. What to bring — static text */}
          <div className="rounded-xl border border-surface-border p-5 bg-surface-soft">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-primary-100 flex items-center justify-center text-primary-700">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              What to Bring
            </h3>
            {/* Static text */}
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2"><span className="text-slate-400 mt-0.5">•</span>Valid government ID (Aadhaar, Voter ID)</li>
              <li className="flex items-start gap-2"><span className="text-slate-400 mt-0.5">•</span>Previous prescriptions or medical reports</li>
              <li className="flex items-start gap-2"><span className="text-slate-400 mt-0.5">•</span>Insurance card or health scheme card</li>
              <li className="flex items-start gap-2"><span className="text-slate-400 mt-0.5">•</span>Referral letter (if applicable)</li>
            </ul>
          </div>

          {/* 3. Quick contact — static text */}
          <div className="rounded-xl border border-surface-border p-5 bg-surface-soft">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-success-100 flex items-center justify-center text-success-700">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              Quick Contact
            </h3>
            {/* Static text */}
            <ul className="space-y-2 text-xs text-slate-600">
              <li><span className="font-medium text-slate-700 block">OPD Reception</span>0674 — 234 5678</li>
              <li><span className="font-medium text-slate-700 block">Emergency (24×7)</span>0674 — 234 5679</li>
              <li><span className="font-medium text-slate-700 block">Lab Reports</span>0674 — 234 5680</li>
              <li className="pt-1 border-t border-slate-100">
                <span className="font-medium text-slate-700 block">Email</span>
                info@citycarehospital.in
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — slim, no marketing
// Static text + "Powered by QueueSmart" attribution
// ─────────────────────────────────────────────────────────────────────────────
function PageFooter() {
  return (
    <footer className="bg-slate-800 text-slate-400 border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-accent-700 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden="true">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
          </div>
          <span className="text-slate-300 font-medium">CityCare Hospital, Bhubaneswar</span>
          <span className="text-slate-600">·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/queue" className="hover:text-slate-200 transition-colors">Live Queue</Link>
          <Link to="/token" className="hover:text-slate-200 transition-colors">Book Token</Link>
          <Link to="/login" className="hover:text-slate-200 transition-colors">Staff</Link>
        </div>

        {/* "Powered by QueueSmart" — subtle attribution, not branding */}
        <span className="text-slate-600 text-2xs">
          Powered by <span className="text-slate-500 font-medium">QueueSmart</span>
        </span>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <HospitalHeader />
      <WelcomeBanner />
      <ActivityMetrics />
      <PatientServices />
      <DepartmentOverview />
      <HospitalInfo />
      <PageFooter />
    </>
  )
}
