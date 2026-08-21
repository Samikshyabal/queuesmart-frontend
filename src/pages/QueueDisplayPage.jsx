import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CATEGORY_CONFIG, MOCK_TOKENS, MOCK_QUEUE_STATUS, DEPT_WAIT_ESTIMATES } from '../mockData'

// ── Counters configured with hospital departments & practitioners ────────────
const INITIAL_COUNTERS = [
  {
    id: 1,
    name:         'Registration Desk',
    service:      'UHID & Check-in',
    currentToken: 'REG-042',
    status:       'In Progress',
    staff:        DEPT_WAIT_ESTIMATES.registration.doctorName,
    specialty:    DEPT_WAIT_ESTIMATES.registration.specialty,
    avgConsultMin: 4,
    deptId:       'registration',
    room:         'Counter 01',
  },
  {
    id: 2,
    name:         'General OPD',
    service:      'General Consultation',
    currentToken: 'OPD-102',
    status:       'In Progress',
    staff:        DEPT_WAIT_ESTIMATES.opd.doctorName,
    specialty:    DEPT_WAIT_ESTIMATES.opd.specialty,
    avgConsultMin: 8,
    deptId:       'opd',
    room:         'Counter 02',
  },
  {
    id: 3,
    name:         'Cardiology OPD',
    service:      'Heart & ECG Review',
    currentToken: 'CARD-014',
    status:       'Calling',
    staff:        DEPT_WAIT_ESTIMATES.cardiology.doctorName,
    specialty:    DEPT_WAIT_ESTIMATES.cardiology.specialty,
    avgConsultMin: 12,
    deptId:       'cardiology',
    room:         'Room 104',
  },
  {
    id: 4,
    name:         'Orthopedics OPD',
    service:      'Bone & Joint Care',
    currentToken: 'ORTHO-027',
    status:       'In Progress',
    staff:        DEPT_WAIT_ESTIMATES.orthopedics.doctorName,
    specialty:    DEPT_WAIT_ESTIMATES.orthopedics.specialty,
    avgConsultMin: 10,
    deptId:       'orthopedics',
    room:         'Room 106',
  },
  {
    id: 5,
    name:         'Pediatrics OPD',
    service:      'Child Healthcare',
    currentToken: 'PED-019',
    status:       'Calling',
    staff:        DEPT_WAIT_ESTIMATES.pediatrics.doctorName,
    specialty:    DEPT_WAIT_ESTIMATES.pediatrics.specialty,
    avgConsultMin: 8,
    deptId:       'pediatrics',
    room:         'Room 108',
  },
  {
    id: 6,
    name:         'Pharmacy Dispensing',
    service:      'Prescription Dispensing',
    currentToken: 'PH-108',
    status:       'In Progress',
    staff:        DEPT_WAIT_ESTIMATES.pharmacy.doctorName,
    specialty:    DEPT_WAIT_ESTIMATES.pharmacy.specialty,
    avgConsultMin: 5,
    deptId:       'pharmacy',
    room:         'Counter 06',
  },
]

// ── Visual Token Progress Stepper ────────────────────────────────────────────
// Checked In → In Queue → Being Called → Consulting
const JOURNEY_STEPS = ['Checked In', 'In Queue', 'Being Called', 'Consulting']

function TokenJourneyStepper({ currentStep }) {
  const stepIndex =
    currentStep === 'Consulting'   ? 3 :
    currentStep === 'Being Called' ? 2 :
    currentStep === 'In Queue'     ? 1 : 0

  return (
    <div className="mt-4 pt-3 border-t border-primary-100">
      <p className="text-2xs font-bold uppercase tracking-wider text-primary-800 mb-2">
        Patient Queue Stage
      </p>
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute left-3 right-3 top-3 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute left-3 top-3 -translate-y-1/2 h-0.5 bg-primary-500 transition-all duration-500 z-0"
          style={{ width: `${(stepIndex / (JOURNEY_STEPS.length - 1)) * 88}%` }}
        />

        {JOURNEY_STEPS.map((step, idx) => {
          const isDone    = idx < stepIndex
          const isCurrent = idx === stepIndex
          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={[
                  'w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold transition-all',
                  isDone
                    ? 'bg-primary-600 text-white shadow-xs'
                    : isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100 shadow-sm animate-pulse'
                      : 'bg-white border-2 border-slate-300 text-slate-400',
                ].join(' ')}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span
                className={[
                  'text-2xs font-semibold mt-1 whitespace-nowrap',
                  isCurrent ? 'text-primary-800 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400',
                ].join(' ')}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function QueueDisplayPage() {
  const [counters, setCounters]         = useState(INITIAL_COUNTERS)
  const [queueList, setQueueList]       = useState(MOCK_TOKENS)
  const [totalWaiting, setTotalWaiting] = useState(MOCK_QUEUE_STATUS.totalInQueue)
  const [tokensServed, setTokensServed] = useState(MOCK_QUEUE_STATUS.tokensServedToday)
  const [isSimulating, setIsSimulating] = useState(false)
  const [lastUpdated, setLastUpdated]   = useState(new Date())
  const [searchQuery, setSearchQuery]   = useState('')
  const [searchResult, setSearchResult] = useState(null)

  // Simulation handler
  const handleSimulateNext = () => {
    setQueueList((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue
      const [nextToServe, ...remaining] = prevQueue
      setCounters((prevCounters) => {
        const idx = Math.floor(Math.random() * prevCounters.length)
        return prevCounters.map((ctr, i) =>
          i === idx
            ? { ...ctr, currentToken: nextToServe.id, status: Math.random() > 0.5 ? 'Calling' : 'In Progress' }
            : ctr
        )
      })
      const sim = {
        id: `OPD-${Math.floor(Math.random() * 900) + 100}`,
        name: ['Anita Dash', 'Sunil Roy', 'Prakash Rout', 'Geeta Sahu', 'Manoj Panda'][Math.floor(Math.random() * 5)],
        category: Math.random() < 0.25 ? 'senior' : Math.random() < 0.15 ? 'pregnant' : 'normal',
        position: remaining.length + 1,
        waitMin: (remaining.length + 1) * 3,
      }
      setTokensServed((p) => p + 1)
      setTotalWaiting(remaining.length + 1)
      setLastUpdated(new Date())
      return [...remaining, sim]
    })
  }

  useEffect(() => {
    if (!isSimulating) return
    const id = setInterval(handleSimulateNext, 4500)
    return () => clearInterval(id)
  }, [isSimulating])

  // Token Tracker Handler
  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchQuery.trim().toUpperCase()
    if (!q) { setSearchResult(null); return }

    const serving = counters.find((c) => c.currentToken.toUpperCase() === q)
    if (serving) {
      setSearchResult({
        found: true,
        isServingNow: true,
        token: q,
        counter: serving.name,
        room: serving.room,
        service: serving.service,
        journeyStep: 'Consulting',
      })
      return
    }

    const qi = queueList.findIndex((t) => t.id.toUpperCase() === q)
    if (qi !== -1) {
      const m = queueList[qi]
      const step = qi === 0 ? 'Being Called' : qi <= 2 ? 'In Queue' : 'Checked In'
      setSearchResult({
        found: true,
        isServingNow: false,
        token: m.id,
        name: m.name,
        position: qi + 1,
        waitMin: m.waitMin,
        category: m.category,
        journeyStep: step,
      })
      return
    }

    setSearchResult({ found: false, token: q })
  }

  // Calculate estimated call time from current time and waitMin
  const now = new Date()
  const getCallTime = (waitMin) => {
    const t = new Date(now.getTime() + waitMin * 60000)
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <main className="flex-1 bg-surface-soft">
      {/* ── Header: Operational Status ─────────────────────────────────────── */}
      <div className="bg-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
              </span>
              <span className="text-xs font-semibold text-success-700 uppercase tracking-wider">Live Queue Display</span>
              <span className="text-2xs text-slate-400 font-mono">CityCare Hospital · {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Outpatient Department (OPD) Live Queue</h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant={isSimulating ? 'success' : 'secondary'}
              size="sm"
              onClick={() => setIsSimulating(!isSimulating)}
            >
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
              {isSimulating ? 'Simulation Active' : 'Simulate Queue'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSimulateNext}
              className="border border-surface-border bg-white"
            >
              Advance →
            </Button>
            <Link to="/token">
              <Button variant="primary" size="sm">+ Book Token</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── 1. Live Status Metrics with Occupancy Load Bars ───────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Patients in Queue',
              value: totalWaiting,
              unit: 'waiting',
              max: 40,
              barColor: 'bg-primary-500',
              textColor: 'text-primary-700',
              borderColor: 'border-l-primary-500',
            },
            {
              label: 'Avg. Consultation Wait',
              value: MOCK_QUEUE_STATUS.avgWaitMinutes,
              unit: 'min',
              max: 60,
              barColor: 'bg-warning-500',
              textColor: 'text-warning-700',
              borderColor: 'border-l-warning-500',
            },
            {
              label: 'Active Counters / Desks',
              value: counters.length,
              unit: 'open',
              max: 6,
              barColor: 'bg-success-500',
              textColor: 'text-success-700',
              borderColor: 'border-l-success-500',
            },
            {
              label: 'Patients Consulted Today',
              value: tokensServed,
              unit: 'served',
              max: 200,
              barColor: 'bg-accent-600',
              textColor: 'text-accent-700',
              borderColor: 'border-l-accent-500',
            },
          ].map(({ label, value, unit, max, barColor, textColor, borderColor }) => (
            <div
              key={label}
              className={`bg-white rounded-xl border border-surface-border border-l-4 ${borderColor} shadow-card px-4 py-3.5`}
            >
              <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-2xl font-bold font-mono ${textColor}`}>
                {value} <span className="text-xs font-normal text-slate-400 font-sans">{unit}</span>
              </p>
              {/* Thin visual occupancy/load bar */}
              <div className="mt-2.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-1 rounded-full ${barColor} transition-all duration-700`}
                  style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── 2. Now Consulting / Counter Status Grid ────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-ping inline-flex" />
              Now Consulting at Workstations
            </h2>
            <p className="text-xs text-slate-400">Proceed to the assigned room/counter when your token appears</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {counters.map((ctr) => {
              const isCalling = ctr.status === 'Calling'
              const est       = DEPT_WAIT_ESTIMATES[ctr.deptId] || {}
              return (
                <div
                  key={ctr.id}
                  className={[
                    'bg-white rounded-xl border shadow-card p-4 transition-all duration-300',
                    isCalling
                      ? 'border-warning-400 ring-1 ring-warning-300/50 shadow-card-elevated'
                      : 'border-surface-border',
                  ].join(' ')}
                >
                  {/* Department & Status */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{ctr.name}</span>
                      <span className="text-2xs text-slate-400 block">{ctr.room}</span>
                    </div>
                    <span
                      className={[
                        'text-2xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0',
                        isCalling
                          ? 'bg-warning-100 text-warning-800 border border-warning-300 animate-pulse'
                          : 'bg-success-50 text-success-700 border border-success-200',
                      ].join(' ')}
                    >
                      {ctr.status}
                    </span>
                  </div>

                  {/* Token Number Display */}
                  <div className="text-center bg-surface-soft rounded-lg py-3 border border-surface-border mb-3">
                    <p className="text-2xs text-slate-400 font-medium mb-0.5">Active Token</p>
                    <p className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                      {ctr.currentToken}
                    </p>
                  </div>

                  {/* Practitioner & Specialty Info */}
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 truncate">{ctr.staff}</span>
                      <span className="text-2xs font-mono font-bold text-primary-700">~{ctr.avgConsultMin}m avg</span>
                    </div>
                    <p className="text-slate-400 truncate text-2xs">{ctr.specialty}</p>
                    <div className="flex items-center gap-1.5 pt-1 text-2xs text-slate-500 border-t border-slate-100 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${est.doctorsAvailable > 0 ? 'bg-success-500' : 'bg-danger-500'}`} />
                      <span>{est.doctorsAvailable || 1} doctor on duty</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 3. Token Tracker & Upcoming Queue Section ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Token Tracker (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-5 border border-surface-border">
              <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Personal Token Tracker
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter your OPD token to check your real-time stage in the consultation journey.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. OPD-043"
                  className="input-field uppercase font-mono text-sm flex-1"
                />
                <Button type="submit" variant="primary" size="sm" className="shrink-0">
                  Track
                </Button>
              </form>

              {/* Search Result Card */}
              {searchResult && (
                <div className="mt-4 animate-scale-in">
                  {searchResult.found ? (
                    searchResult.isServingNow ? (
                      <div className="p-4 rounded-xl bg-success-50 border border-success-200 text-center">
                        <p className="text-2xl mb-1">🔔</p>
                        <p className="text-sm font-bold text-success-800">Your Token is Being Called!</p>
                        <p className="text-xs text-slate-700 mt-1">
                          Token <strong className="font-mono">{searchResult.token}</strong> please proceed to{' '}
                          <strong>{searchResult.counter} ({searchResult.room})</strong>.
                        </p>
                        <TokenJourneyStepper currentStep={searchResult.journeyStep} />
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-primary-50 border border-primary-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-primary-800 font-mono">
                            {searchResult.token}
                          </span>
                          <Badge
                            variant={searchResult.category || 'normal'}
                            label={CATEGORY_CONFIG[searchResult.category]?.label || 'General'}
                            size="sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white rounded-lg p-2 border border-primary-100">
                            <p className="text-2xs text-slate-400 font-medium">Position</p>
                            <p className="text-sm font-bold text-slate-900">#{searchResult.position}</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 border border-primary-100">
                            <p className="text-2xs text-slate-400 font-medium">Est. Wait</p>
                            <p className="text-sm font-bold text-warning-700">~{searchResult.waitMin} min</p>
                          </div>
                        </div>

                        {/* Visual Progress Stepper: Checked In → In Queue → Being Called → Consulting */}
                        <TokenJourneyStepper currentStep={searchResult.journeyStep} />

                        <p className="text-2xs text-slate-500 text-center pt-1">
                          Estimated call time: <strong>{getCallTime(searchResult.waitMin)}</strong>
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="p-4 rounded-xl bg-surface-muted border border-surface-border text-center text-xs text-slate-500">
                      Token <strong className="font-mono text-slate-800">{searchResult.token}</strong> not found in the active queue.
                      <Link to="/token" className="block mt-2 font-semibold text-primary-600 hover:underline">
                        Book an OPD token →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Patient Information Guidelines */}
            <div className="bg-white rounded-xl border border-surface-border p-4 text-xs text-slate-500 space-y-2 shadow-card">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Hospital Queue Guidelines</h4>
              {[
                'Please present your token ticket or SMS confirmation at the designated consultation desk.',
                'Wheelchair and priority assistance available at Counter 01 (Registration Desk).',
                'Keep your contact phone reachable to receive your 5-minute pre-consultation SMS.',
              ].map((tip) => (
                <p key={tip} className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  {tip}
                </p>
              ))}
            </div>
          </div>

          {/* Right: Upcoming Queue Table (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Upcoming Queue ({queueList.length} Patients)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Live Patient Order</span>
            </div>

            <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-surface-soft text-2xs uppercase tracking-wider text-slate-400 font-semibold border-b border-surface-border">
                      <th className="py-3 px-4">Pos</th>
                      <th className="py-3 px-4">Token</th>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Est. Wait</th>
                      <th className="py-3 px-4">Call Time</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {queueList.map((token, index) => {
                      const isSearched = searchResult?.found && searchResult.token === token.id
                      const isPriority = token.category !== 'normal'
                      const statusLabel = index === 0 ? 'Next in Line' : index <= 2 ? 'In Queue' : 'Checked In'
                      const statusBadge =
                        index === 0
                          ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                          : 'bg-slate-100 text-slate-600 border-slate-200'

                      return (
                        <tr
                          key={token.id}
                          className={[
                            'transition-colors duration-150',
                            isSearched
                              ? 'bg-primary-50 font-semibold'
                              : isPriority
                                ? 'border-l-3 border-l-amber-400 bg-amber-50/25 hover:bg-amber-50/50'
                                : 'hover:bg-surface-soft',
                          ].join(' ')}
                        >
                          <td className="py-3 px-4 text-xs font-mono text-slate-400">
                            #{index + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                            {token.id}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-700 font-medium">
                            {token.name}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={token.category}
                              label={CATEGORY_CONFIG[token.category]?.label || 'General'}
                              showIcon
                              size="sm"
                            />
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-warning-700 font-semibold">
                            ~{token.waitMin}m
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-500">
                            {getCallTime(token.waitMin)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`inline-block text-2xs px-2 py-0.5 rounded-full border ${statusBadge}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
