import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import {
  CATEGORY_CONFIG,
  MOCK_FOOTFALL,
  MOCK_WAIT_TIME,
  MOCK_QUEUE_STATUS,
  MOCK_TOKENS,
  MOCK_YESTERDAY_STATS,
  DEPT_WAIT_ESTIMATES,
} from '../mockData'

// ── Initial Active Department Desks ──────────────────────────────────────────
const INITIAL_COUNTERS = [
  { id: 1, name: 'Registration Desk', service: 'UHID & Check-in', clerk: DEPT_WAIT_ESTIMATES.registration.doctorName, status: 'Active', currentToken: 'REG-042', speed: '3.5m/patient', deptCode: 'REG', served: 38, estWait: '4m' },
  { id: 2, name: 'General OPD Desk', service: 'General Consultation', clerk: DEPT_WAIT_ESTIMATES.opd.doctorName, status: 'Active', currentToken: 'OPD-102', speed: '7.8m/patient', deptCode: 'OPD', served: 45, estWait: '15m' },
  { id: 3, name: 'Cardiology Desk', service: 'Heart & ECG Clinic', clerk: DEPT_WAIT_ESTIMATES.cardiology.doctorName, status: 'Active', currentToken: 'CARD-014', speed: '11.5m/patient', deptCode: 'CARD', served: 18, estWait: '22m' },
  { id: 4, name: 'Orthopedics Desk', service: 'Bone & Joint Consult', clerk: DEPT_WAIT_ESTIMATES.orthopedics.doctorName, status: 'Active', currentToken: 'ORTHO-027', speed: '9.2m/patient', deptCode: 'ORTHO', served: 24, estWait: '18m' },
  { id: 5, name: 'Pediatrics Desk', service: 'Child Health & Immunization', clerk: DEPT_WAIT_ESTIMATES.pediatrics.doctorName, status: 'On Break', currentToken: '-', speed: '8.0m/patient', deptCode: 'PED', served: 22, estWait: '12m' },
  { id: 6, name: 'Pharmacy Dispensing', service: 'Prescription Dispensing', clerk: DEPT_WAIT_ESTIMATES.pharmacy.doctorName, status: 'Active', currentToken: 'PH-108', speed: '4.1m/patient', deptCode: 'PH', served: 52, estWait: '6m' },
]

// ── Department System Health Overview ────────────────────────────────────────
const SYSTEM_HEALTH_DEPARTMENTS = [
  { id: 'opd', name: 'General OPD', status: 'Moderate Load', dotColor: 'bg-warning-500', loadText: '15m avg wait' },
  { id: 'pharmacy', name: 'Pharmacy', status: 'Normal Flow', dotColor: 'bg-success-500', loadText: '6m avg wait' },
  { id: 'cardio', name: 'Cardiology', status: 'High Load', dotColor: 'bg-rose-500', loadText: '22m avg wait' },
  { id: 'ortho', name: 'Orthopedics', status: 'Normal Flow', dotColor: 'bg-success-500', loadText: '18m avg wait' },
  { id: 'peds', name: 'Pediatrics', status: 'Staff on Break', dotColor: 'bg-amber-500', loadText: 'Resume 2:15 PM' },
  { id: 'reg', name: 'Registration', status: 'Active', dotColor: 'bg-success-500', loadText: '4m avg wait' },
]

export default function AdminDashboardPage() {
  // State Management
  const [tokensList, setTokensList]       = useState(MOCK_TOKENS)
  const [counters, setCounters]           = useState(INITIAL_COUNTERS)
  const [searchFilter, setSearchFilter]   = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [chartMode, setChartMode]         = useState('footfall') // 'footfall' | 'waittime'
  const [actionNotice, setActionNotice]   = useState('')

  // KPI Metrics State
  const [totalServed, setTotalServed]     = useState(MOCK_QUEUE_STATUS.tokensServedToday)

  const showNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3500)
  }

  // Action: Boost Token Priority
  const handleBoostPriority = (tokenId) => {
    setTokensList((prev) => {
      const targetIndex = prev.findIndex((t) => t.id === tokenId)
      if (targetIndex <= 0) return prev
      const item = prev[targetIndex]
      const updated = [item, ...prev.slice(0, targetIndex), ...prev.slice(targetIndex + 1)]
      return updated.map((tok, idx) => ({ ...tok, position: idx + 1, waitMin: (idx + 1) * 3 }))
    })
    showNotice(`Priority Boost applied to Token #${tokenId}! Moved to front of queue.`)
  }

  // Action: Mark Token as Served
  const handleMarkServed = (tokenId) => {
    setTokensList((prev) => prev.filter((t) => t.id !== tokenId).map((tok, idx) => ({ ...tok, position: idx + 1 })))
    setTotalServed((prev) => prev + 1)
    showNotice(`Token #${tokenId} marked as Completed / Served.`)
  }

  // Action: Cancel Token
  const handleCancelToken = (tokenId) => {
    setTokensList((prev) => prev.filter((t) => t.id !== tokenId).map((tok, idx) => ({ ...tok, position: idx + 1 })))
    showNotice(`Token #${tokenId} has been cancelled.`)
  }

  // Action: Toggle Counter Break Status
  const handleToggleCounter = (counterId) => {
    setCounters((prev) =>
      prev.map((ctr) => {
        if (ctr.id === counterId) {
          const newStatus = ctr.status === 'Active' ? 'On Break' : 'Active'
          showNotice(`${ctr.name} status changed to "${newStatus}".`)
          return { ...ctr, status: newStatus }
        }
        return ctr
      })
    )
  }

  // Filtered Tokens List
  const filteredTokens = tokensList.filter((tok) => {
    const matchesSearch =
      tok.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tok.name.toLowerCase().includes(searchFilter.toLowerCase())

    const matchesCategory =
      categoryFilter === 'all' ? true : tok.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // KPI Calculations & Trend Baselines vs Yesterday
  const totalPatientsToday = totalServed + tokensList.length
  const patientsDiffPct = Math.round(((totalPatientsToday - MOCK_YESTERDAY_STATS.tokensServedYesterday) / MOCK_YESTERDAY_STATS.tokensServedYesterday) * 100)
  const waitDiffPct = Math.round(((MOCK_QUEUE_STATUS.avgWaitMinutes - MOCK_YESTERDAY_STATS.avgWaitYesterday) / MOCK_YESTERDAY_STATS.avgWaitYesterday) * 100)
  const activeDesksCount = counters.filter((c) => c.status === 'Active').length

  return (
    <main className="flex-1 page-section py-6 space-y-6 bg-surface-soft max-w-7xl mx-auto w-full">
      {/* ── Toast Notification Banner ───────────────────────────────────────── */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between shadow-card-elevated animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice('')}
            className="text-slate-400 hover:text-white px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Header: Hospital Operations Console ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs px-2 py-0.5 rounded-full font-bold bg-accent-100 text-accent-800 border border-accent-200 uppercase tracking-wide">
              Hospital Operations
            </span>
            <span className="text-2xs text-slate-500 font-mono">CityCare Hospital · Central Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            OPD &amp; Department Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/counter">
            <Button variant="secondary" size="sm">
              <span className="mr-1">🖥️</span> Staff Workstation
            </Button>
          </Link>
          <Link to="/queue">
            <Button variant="secondary" size="sm">
              <span className="mr-1">📺</span> Live Display
            </Button>
          </Link>
          <Link to="/token">
            <Button variant="primary" size="sm">
              + Generate Token
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 1. Compact System Health Overview Strip ─────────────────────────── */}
      <div className="bg-white rounded-xl border border-surface-border p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
            System Operational Health · Live Status
          </span>
          <span className="text-2xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Department Nodes Synchronized
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SYSTEM_HEALTH_DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              className="bg-surface-soft rounded-lg p-2 border border-surface-border flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">{dept.name}</p>
                <span className="text-2xs text-slate-400 block">{dept.loadText}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className={`w-2 h-2 rounded-full ${dept.dotColor}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. KPI Metric Cards with Trend Indicators ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white rounded-xl p-5 border border-surface-border border-l-4 border-l-primary-600 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Patients Today
            </span>
            <span className="text-lg p-1 rounded-md bg-slate-100">👥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            {totalPatientsToday}
          </div>
          <div className="flex items-center gap-1 text-2xs mt-1.5 font-semibold text-emerald-700">
            <span>↑ {patientsDiffPct}%</span>
            <span className="text-slate-400 font-normal">vs yesterday ({MOCK_YESTERDAY_STATS.tokensServedYesterday})</span>
          </div>
        </div>

        {/* Avg Wait Time */}
        <div className="bg-white rounded-xl p-5 border border-surface-border border-l-4 border-l-warning-500 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg. Consultation Wait
            </span>
            <span className="text-lg p-1 rounded-md bg-slate-100">⏱️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            {MOCK_QUEUE_STATUS.avgWaitMinutes} <span className="text-base font-normal text-slate-400">min</span>
          </div>
          <div className="flex items-center gap-1 text-2xs mt-1.5 font-semibold text-emerald-700">
            <span>↓ {Math.abs(waitDiffPct)}%</span>
            <span className="text-slate-400 font-normal">faster than yesterday ({MOCK_YESTERDAY_STATS.avgWaitYesterday}m)</span>
          </div>
        </div>

        {/* Currently Waiting */}
        <div className="bg-white rounded-xl p-5 border border-surface-border border-l-4 border-l-accent-600 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Currently In Queue
            </span>
            <span className="text-lg p-1 rounded-md bg-slate-100">⏳</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            {tokensList.length}
          </div>
          <span className="text-2xs text-amber-800 font-bold mt-1.5 block">
            {tokensList.filter((t) => t.category !== 'normal').length} priority patients waiting
          </span>
        </div>

        {/* Completed Consultations */}
        <div className="bg-white rounded-xl p-5 border border-surface-border border-l-4 border-l-success-600 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Consultations Completed
            </span>
            <span className="text-lg p-1 rounded-md bg-slate-100">✓</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-success-700 font-mono">
            {totalServed}
          </div>
          <span className="text-2xs text-emerald-700 font-bold mt-1.5 block">
            98.4% on-time resolution rate
          </span>
        </div>
      </div>

      {/* ── 3. Visual Analytics Charts (Recharts) ────────────────────────────── */}
      <Card className="p-5 sm:p-6 bg-white border border-surface-border shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-accent-700 uppercase tracking-wider">
                Patient Traffic &amp; Wait Analytics
              </span>
              <span className="text-2xs bg-accent-50 text-accent-800 border border-accent-200 px-2 py-0.5 rounded-md font-mono font-bold">
                Hospital Forecast Model
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {chartMode === 'footfall' ? 'Patient Footfall — Today' : 'Average Consultation Wait — Today'}
            </h2>
          </div>

          {/* Toggle Button */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-surface-border text-xs">
            <button
              type="button"
              onClick={() => setChartMode('footfall')}
              className={[
                'px-3 py-1.5 rounded-md font-bold transition-all',
                chartMode === 'footfall' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-600 hover:text-slate-900',
              ].join(' ')}
            >
              Patient Footfall — Today
            </button>
            <button
              type="button"
              onClick={() => setChartMode('waittime')}
              className={[
                'px-3 py-1.5 rounded-md font-bold transition-all',
                chartMode === 'waittime' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-600 hover:text-slate-900',
              ].join(' ')}
            >
              Average Consultation Wait — Today
            </button>
          </div>
        </div>

        {/* Chart Rendering */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'footfall' ? (
              <BarChart data={MOCK_FOOTFALL} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  labelStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Expected Patients" />
              </BarChart>
            ) : (
              <AreaChart data={MOCK_WAIT_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="waitGradientTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  labelStyle={{ color: '#0f766e', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="wait" stroke="#0f766e" strokeWidth={2.5} fillOpacity={1} fill="url(#waitGradientTeal)" name="Wait (mins)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        <p className="text-2xs text-slate-500 mt-2 text-right font-medium">
          * Peak arrival trends forecasted around 10:30 AM – 12:30 PM based on past weekly flow.
        </p>
      </Card>

      {/* ── 4. Department Operational Desks Grid ────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span>🏥</span> Department Health &amp; Operations Grid
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {activeDesksCount} of {counters.length} Desks Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {counters.map((ctr) => {
            const isActive = ctr.status === 'Active'
            return (
              <div
                key={ctr.id}
                className={[
                  'rounded-xl p-4.5 border transition-all duration-150 bg-white shadow-card',
                  isActive ? 'border-surface-border' : 'border-dashed border-amber-300 bg-amber-50/20',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xs font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {ctr.deptCode}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{ctr.name}</span>
                  </div>
                  <span
                    className={[
                      'text-2xs font-bold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-amber-100 text-amber-800 border border-amber-300',
                    ].join(' ')}
                  >
                    {ctr.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 truncate mb-2 font-medium">{ctr.service}</p>
                <div className="flex items-center justify-between text-2xs text-slate-500 mb-2">
                  <span>Practitioner: <strong className="text-slate-800">{ctr.clerk}</strong></span>
                  <span className="font-mono font-bold text-primary-700">Est. Wait: {ctr.estWait}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs">
                  <span className="text-slate-500">
                    Active: <strong className="text-slate-900 font-mono text-xs">{ctr.currentToken}</strong>
                    <span className="text-slate-400 ml-2">({ctr.served} served)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleCounter(ctr.id)}
                    className="text-2xs font-bold text-primary-600 hover:text-primary-800 underline"
                  >
                    {isActive ? 'Set Break' : 'Resume'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 5. Live Queue Management Table with Smart Recommendations ───────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span>📋</span> OPD Patient Queue Management Table
            </h2>
            <p className="text-xs text-slate-500">
              Manage waiting patients, review staff recommendations, adjust priority, or mark consultations done
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search token or patient..."
              className="input-field text-xs py-1.5 px-3 w-48 sm:w-56"
            />

            <div className="flex bg-slate-100 p-1 rounded-lg border border-surface-border text-2xs">
              {['all', 'normal', 'senior', 'disabled', 'pregnant'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={[
                    'px-2.5 py-1 rounded-md font-bold capitalize transition-all',
                    categoryFilter === cat ? 'bg-white text-primary-800 shadow-sm' : 'text-slate-600 hover:text-slate-900',
                  ].join(' ')}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl overflow-hidden border border-surface-border shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-soft text-2xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Est. Wait</th>
                  <th className="py-3 px-4">Staff Action Recommendation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                      No matching patients found in the active queue.
                    </td>
                  </tr>
                ) : (
                  filteredTokens.map((tok, idx) => {
                    const isLongWait = tok.waitMin > 15
                    const isPriority = tok.category !== 'normal'

                    // Derived staff recommendations
                    let recommendationBadge
                    if (isPriority) {
                      recommendationBadge = (
                        <span className="inline-flex items-center gap-1 text-2xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                          ⚡ Priority → Boost
                        </span>
                      )
                    } else if (isLongWait) {
                      recommendationBadge = (
                        <span className="inline-flex items-center gap-1 text-2xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          ⏱️ Long Wait → Follow Up
                        </span>
                      )
                    } else {
                      recommendationBadge = (
                        <span className="inline-flex items-center gap-1 text-2xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          ✓ Normal Queue
                        </span>
                      )
                    }

                    return (
                      <tr key={tok.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-400">
                          #{tok.position || idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {tok.id}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-800 font-medium">
                          {tok.name}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={tok.category}
                            label={CATEGORY_CONFIG[tok.category]?.label || 'General'}
                            showIcon
                            size="sm"
                          />
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-warning-700 font-bold">
                          ~{tok.waitMin}m
                        </td>
                        {/* Recommendation Column */}
                        <td className="py-3 px-4">
                          {recommendationBadge}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleBoostPriority(tok.id)}
                              title="Boost to Front of Queue"
                              className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-2xs font-bold transition shadow-sm"
                            >
                              ⚡ Boost
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkServed(tok.id)}
                              title="Mark as Served"
                              className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-2xs font-bold transition shadow-sm"
                            >
                              ✓ Done
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancelToken(tok.id)}
                              title="Cancel Token"
                              className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-2xs font-bold transition shadow-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
