import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import {
  CATEGORY_CONFIG,
  estimateWait,
  MOCK_QUEUE_STATUS,
  DEPARTMENT_CONFIG,
  DEPT_WAIT_ESTIMATES,
  MOCK_TIME_SLOTS,
} from '../mockData'

// ── QR Code ─────────────────────────────────────────────────────────────────
function TicketQRCode({ tokenNumber }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-surface-border flex flex-col items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-24 h-24 text-slate-900" fill="currentColor" shapeRendering="crispEdges">
        <rect x="10" y="10" width="30" height="30" rx="3" fill="currentColor" />
        <rect x="15" y="15" width="20" height="20" rx="2" fill="#fff" />
        <rect x="20" y="20" width="10" height="10" rx="1" fill="currentColor" />
        <rect x="80" y="10" width="30" height="30" rx="3" fill="currentColor" />
        <rect x="85" y="15" width="20" height="20" rx="2" fill="#fff" />
        <rect x="90" y="20" width="10" height="10" rx="1" fill="currentColor" />
        <rect x="10" y="80" width="30" height="30" rx="3" fill="currentColor" />
        <rect x="15" y="85" width="20" height="20" rx="2" fill="#fff" />
        <rect x="20" y="90" width="10" height="10" rx="1" fill="currentColor" />
        <rect x="46" y="12" width="6" height="6" fill="currentColor" />
        <rect x="58" y="12" width="12" height="6" fill="currentColor" />
        <rect x="46" y="24" width="18" height="6" fill="currentColor" />
        <rect x="52" y="36" width="6" height="12" fill="currentColor" />
        <rect x="64" y="36" width="10" height="6" fill="currentColor" />
        <rect x="12" y="48" width="8" height="6" fill="currentColor" />
        <rect x="26" y="48" width="14" height="6" fill="currentColor" />
        <rect x="46" y="52" width="28" height="8" fill="currentColor" />
        <rect x="80" y="48" width="12" height="6" fill="currentColor" />
        <rect x="98" y="48" width="10" height="6" fill="currentColor" />
        <rect x="12" y="60" width="16" height="6" fill="currentColor" />
        <rect x="34" y="60" width="6" height="12" fill="currentColor" />
        <rect x="52" y="68" width="16" height="6" fill="currentColor" />
        <rect x="74" y="60" width="20" height="6" fill="currentColor" />
        <rect x="46" y="82" width="10" height="12" fill="currentColor" />
        <rect x="62" y="82" width="18" height="6" fill="currentColor" />
        <rect x="86" y="82" width="8" height="18" fill="currentColor" />
        <rect x="52" y="100" width="22" height="8" fill="currentColor" />
      </svg>
      <span className="text-2xs font-mono font-semibold text-slate-400 mt-1.5 tracking-wider uppercase">
        {tokenNumber} · CityCare
      </span>
    </div>
  )
}

// ── Token Receipt ────────────────────────────────────────────────────────────
function TokenReceipt({ ticket, onReset }) {
  const [printed, setPrinted] = useState(false)

  const handlePrint = () => {
    setPrinted(true)
    setTimeout(() => setPrinted(false), 3000)
    window.print()
  }

  const categoryLabel = CATEGORY_CONFIG[ticket.category]?.label || 'General Patient'

  return (
    <div className="max-w-lg mx-auto w-full animate-scale-in">
      {/* Success header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-50 border border-success-200 text-success-600 mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Token Confirmed</h2>
        <p className="text-sm text-slate-500 mt-1">
          {ticket.isScheduled
            ? `Appointment scheduled for today at ${ticket.scheduledTime}`
            : 'Your OPD token is active. Please watch the display boards.'}
        </p>
      </div>

      {/* Receipt card */}
      <div className="bg-white border border-surface-border rounded-2xl shadow-card-elevated overflow-hidden">
        {/* Ticket header band */}
        <div className="bg-accent-700 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              <span className="text-xs font-semibold text-accent-100 uppercase tracking-wider">CityCare Hospital</span>
            </div>
            <p className="text-sm font-bold text-white">{ticket.dept.name}</p>
            <p className="text-xs text-accent-200">{ticket.dept.counter}</p>
          </div>
          <div className="text-right text-xs text-accent-200">
            <p className="font-medium">{ticket.date}</p>
            <p className="font-mono">{ticket.generatedAt}</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Token number + QR */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="text-center sm:text-left flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Your Token</p>
              <div className="text-5xl font-black text-primary-700 font-mono tracking-tight animate-number-pop">
                {ticket.tokenNumber}
              </div>
              <div className="mt-2.5">
                <Badge variant={ticket.category} label={categoryLabel} showIcon size="md" />
              </div>
            </div>
            <TicketQRCode tokenNumber={ticket.tokenNumber} />
          </div>

          {/* Wait estimate grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Est. Wait', value: `~${ticket.waitTime} min`, accent: 'text-warning-700' },
              { label: 'Position', value: `#${ticket.queuePosition}`, accent: 'text-primary-700' },
              { label: 'Now Serving', value: `#${MOCK_QUEUE_STATUS.nowServing}`, accent: 'text-success-700' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="bg-surface-soft rounded-xl p-3 text-center border border-surface-border">
                <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                <p className={`text-base font-bold ${accent}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Smart recommendation — represents backend smart recs feature */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 flex gap-3 items-start">
            <svg className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-primary-800 leading-relaxed">
              <span className="font-semibold">Suggested:</span> Proceed to{' '}
              <span className="font-bold">{ticket.dept.counter}</span>. Sit in the waiting lounge — an
              SMS alert will be sent to <span className="font-mono font-bold">{ticket.phone}</span> 5 minutes before your turn.
            </p>
          </div>

          {/* Patient info summary */}
          <div className="text-xs space-y-1.5 text-slate-600 border-t border-surface-border pt-4">
            {[
              ['Patient', ticket.name],
              ['Mobile', ticket.phone],
              ['SMS Notification', ticket.receiveSms ? '✓ Enabled' : 'Disabled'],
              ...(ticket.isScheduled ? [['Appointment Time', ticket.scheduledTime]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-400">{k}</span>
                <span className="font-medium text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action row */}
        <div className="px-6 pb-5 flex flex-col sm:flex-row gap-2.5">
          <Link to="/queue" className="flex-1">
            <Button variant="primary" size="md" fullWidth>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              Track Live Queue
            </Button>
          </Link>
          <Button variant="secondary" size="md" onClick={handlePrint}>
            {printed ? 'Printing…' : 'Print Receipt'}
          </Button>
          <Button variant="ghost" size="md" onClick={onReset}>
            New Token
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Walk-in Token Form ────────────────────────────────────────────────────────
function WalkInForm({ onGenerate }) {
  const [selectedDept, setSelectedDept] = useState('opd')
  const [fullName, setFullName]         = useState('')
  const [phone, setPhone]               = useState('')
  const [category, setCategory]         = useState('normal')
  const [receiveSms, setReceiveSms]     = useState(true)
  const [errors, setErrors]             = useState({})
  const [submitting, setSubmitting]     = useState(false)

  // Find recommended dept (shortest wait) — represents smart recommendations feature
  const recommendedDeptId = Object.entries(DEPT_WAIT_ESTIMATES)
    .sort(([, a], [, b]) => a.waitMin - b.waitMin)[0][0]

  const validate = () => {
    const e = {}
    if (!fullName.trim() || fullName.trim().length < 3) e.fullName = 'Please enter your full name (at least 3 characters).'
    if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, '')))  e.phone   = 'Please enter a valid 10-digit mobile number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    setTimeout(() => {
      const dept    = DEPARTMENT_CONFIG.find((d) => d.id === selectedDept) || DEPARTMENT_CONFIG[0]
      const num     = Math.floor(Math.random() * 80) + 101
      const token   = `${dept.code}-${num}`
      const waitTime = estimateWait(category, MOCK_QUEUE_STATUS.totalInQueue)

      onGenerate({
        tokenNumber: token,
        dept,
        name: fullName.trim(),
        phone: phone.trim(),
        category,
        waitTime,
        queuePosition: MOCK_QUEUE_STATUS.totalInQueue + 1,
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        receiveSms,
        isScheduled: false,
      })
      setSubmitting(false)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Department selection with wait + doctor badges ── */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-3">
          Select Department <span className="text-danger-600">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEPARTMENT_CONFIG.map((dept) => {
            const est       = DEPT_WAIT_ESTIMATES[dept.id]
            const isSelected   = selectedDept === dept.id
            const isRecommended = dept.id === recommendedDeptId

            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDept(dept.id)}
                className={[
                  'text-left rounded-xl border-2 p-4 transition-all duration-150 relative',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-glow-primary'
                    : 'border-surface-border bg-white hover:border-slate-300',
                ].join(' ')}
              >
                {/* Recommended badge — smart recommendation feature */}
                {isRecommended && (
                  <span className="absolute top-3 right-3 text-2xs font-bold bg-accent-100 text-accent-800 border border-accent-300 px-1.5 py-0.5 rounded-md">
                    Shortest Wait
                  </span>
                )}

                <div className="flex items-start gap-3 pr-16">
                  <span className="text-2xl mt-0.5 shrink-0">{dept.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-semibold text-slate-900 truncate">{dept.name}</p>
                      <span className="text-2xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono shrink-0">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">{dept.description}</p>

                    {/* Wait + doctor status — DEPT_WAIT_ESTIMATES */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-warning-700 font-semibold">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ~{est.waitMin} min
                      </span>
                      <span className={`flex items-center gap-1 font-semibold ${est.doctorsAvailable > 0 ? 'text-success-700' : 'text-danger-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${est.doctorsAvailable > 0 ? 'bg-success-500' : 'bg-danger-500'}`} />
                        {est.doctorsAvailable}/{est.totalDoctors} available
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Patient info ── */}
      <div className="bg-white border border-surface-border rounded-xl p-5 space-y-4 shadow-card">
        <h3 className="text-sm font-semibold text-slate-800 border-b border-surface-border pb-3">
          Patient Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="wi-name" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Full Name <span className="text-danger-600">*</span>
            </label>
            <input
              id="wi-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className={`input-field ${errors.fullName ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/15' : ''}`}
            />
            {errors.fullName && <p className="text-xs text-danger-600 mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="wi-phone" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Mobile Number <span className="text-danger-600">*</span>
            </label>
            <input
              id="wi-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`input-field font-mono ${errors.phone ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/15' : ''}`}
            />
            {errors.phone && <p className="text-xs text-danger-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Patient category */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Patient Category
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={[
                  'flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all text-left',
                  category === key
                    ? 'border-primary-400 bg-primary-50 text-primary-900'
                    : 'border-surface-border bg-white text-slate-700 hover:border-slate-300',
                ].join(' ')}
              >
                <span className="text-base" aria-hidden="true">{cfg.icon}</span>
                <span className="truncate">{cfg.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SMS opt-in */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={receiveSms}
            onChange={(e) => setReceiveSms(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-xs text-slate-600">
            Receive an SMS alert 5 minutes before my turn
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          ← Back to Home
        </Link>
        <Button type="submit" variant="primary" size="lg" loading={submitting} className="min-w-[200px]">
          Generate OPD Token →
        </Button>
      </div>
    </form>
  )
}

// ── Schedule Visit Form ───────────────────────────────────────────────────────
// Represents backend feature: pre-appointment / scheduled booking
function ScheduleVisitForm({ onGenerate }) {
  const [selectedDept, setSelectedDept] = useState('opd')
  const [fullName, setFullName]         = useState('')
  const [phone, setPhone]               = useState('')
  const [category, setCategory]         = useState('normal')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [errors, setErrors]             = useState({})
  const [submitting, setSubmitting]     = useState(false)

  const validate = () => {
    const e = {}
    if (!fullName.trim() || fullName.trim().length < 3) e.fullName = 'Please enter your full name.'
    if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, '')))  e.phone   = 'Please enter a valid 10-digit mobile number.'
    if (!selectedSlot) e.slot = 'Please select a time slot.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    setTimeout(() => {
      const dept  = DEPARTMENT_CONFIG.find((d) => d.id === selectedDept) || DEPARTMENT_CONFIG[0]
      const num   = Math.floor(Math.random() * 80) + 200
      const token = `${dept.code}-${num}`

      onGenerate({
        tokenNumber: token,
        dept,
        name: fullName.trim(),
        phone: phone.trim(),
        category,
        waitTime: 0,
        queuePosition: '-',
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        receiveSms: true,
        isScheduled: true,
        scheduledTime: selectedSlot,
      })
      setSubmitting(false)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Department selector — compact for schedule mode */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-3">
          Department <span className="text-danger-600">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEPARTMENT_CONFIG.map((dept) => (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDept(dept.id)}
              className={[
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all',
                selectedDept === dept.id
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-surface-border bg-white text-slate-600 hover:border-slate-300',
              ].join(' ')}
            >
              <span className="text-2xl">{dept.icon}</span>
              <span className="text-center leading-tight">{dept.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time slot picker */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-3">
          Preferred Time Slot <span className="text-danger-600">*</span>
          <span className="text-xs font-normal text-slate-400 ml-2">— Today, {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {MOCK_TIME_SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              disabled={!slot.available}
              onClick={() => setSelectedSlot(slot.time)}
              className={[
                'py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all',
                !slot.available
                  ? 'bg-slate-50 border-surface-border text-slate-300 cursor-not-allowed line-through'
                  : selectedSlot === slot.time
                    ? 'border-primary-500 bg-primary-600 text-white'
                    : 'border-surface-border bg-white text-slate-700 hover:border-primary-400',
              ].join(' ')}
            >
              {slot.time}
            </button>
          ))}
        </div>
        {errors.slot && <p className="text-xs text-danger-600 mt-1">{errors.slot}</p>}
      </div>

      {/* Patient info */}
      <div className="bg-white border border-surface-border rounded-xl p-5 space-y-4 shadow-card">
        <h3 className="text-sm font-semibold text-slate-800 border-b border-surface-border pb-3">
          Patient Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sv-name" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Full Name <span className="text-danger-600">*</span>
            </label>
            <input
              id="sv-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className={`input-field ${errors.fullName ? 'border-danger-400' : ''}`}
            />
            {errors.fullName && <p className="text-xs text-danger-600 mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="sv-phone" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Mobile Number <span className="text-danger-600">*</span>
            </label>
            <input
              id="sv-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`input-field font-mono ${errors.phone ? 'border-danger-400' : ''}`}
            />
            {errors.phone && <p className="text-xs text-danger-600 mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Patient Category</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={[
                  'flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all text-left',
                  category === key
                    ? 'border-primary-400 bg-primary-50 text-primary-900'
                    : 'border-surface-border bg-white text-slate-700 hover:border-slate-300',
                ].join(' ')}
              >
                <span className="text-base">{cfg.icon}</span>
                <span className="truncate">{cfg.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">← Back to Home</Link>
        <Button type="submit" variant="primary" size="lg" loading={submitting} className="min-w-[220px]">
          Confirm Appointment →
        </Button>
      </div>
    </form>
  )
}

// ── Page root ─────────────────────────────────────────────────────────────────
export default function TokenPage() {
  const [mode, setMode]               = useState('walkin') // 'walkin' | 'schedule'
  const [generatedTicket, setTicket]  = useState(null)

  if (generatedTicket) {
    return (
      <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <TokenReceipt ticket={generatedTicket} onReset={() => setTicket(null)} />
      </main>
    )
  }

  return (
    <main className="flex-1 bg-surface-soft">
      {/* Page header */}
      <div className="bg-white border-b border-surface-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            CityCare Hospital · OPD Digital Services
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Patient Token Services</h1>
          <p className="text-sm text-slate-500 mt-1">
            Walk in immediately or schedule a visit for later today — choose your preferred option below.
          </p>

          {/* Mode tab bar */}
          <div className="flex gap-1 mt-5 bg-slate-100 p-1 rounded-lg w-fit border border-surface-border">
            <button
              id="tab-walkin"
              type="button"
              onClick={() => setMode('walkin')}
              className={[
                'px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150',
                mode === 'walkin'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800',
              ].join(' ')}
            >
              <span className="mr-1.5">🚶</span> Walk-in Token
            </button>
            <button
              id="tab-schedule"
              type="button"
              onClick={() => setMode('schedule')}
              className={[
                'px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150',
                mode === 'schedule'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800',
              ].join(' ')}
            >
              <span className="mr-1.5">📅</span> Schedule Visit
            </button>
          </div>
        </div>
      </div>

      {/* Form area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === 'walkin'
          ? <WalkInForm onGenerate={setTicket} />
          : <ScheduleVisitForm onGenerate={setTicket} />
        }
      </div>
    </main>
  )
}
