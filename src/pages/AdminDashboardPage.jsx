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
} from '../mockData'

// Initial Active Counter Desks
const INITIAL_COUNTERS = [
  { id: 1, name: 'Counter 1', service: 'General Inquiries', clerk: 'S. Mohapatra', status: 'Active', currentToken: 'A-102', speed: '4.2m/person' },
  { id: 2, name: 'Counter 2', service: 'Billing & Payments', clerk: 'A. Jena', status: 'Active', currentToken: 'B-108', speed: '3.8m/person' },
  { id: 3, name: 'Counter 3', service: 'Document Verification', clerk: 'R. Tripathy', status: 'On Break', currentToken: '-', speed: '5.1m/person' },
  { id: 4, name: 'Priority Desk', service: 'Express Assistance', clerk: 'P. Behera', status: 'Active', currentToken: 'P-031', speed: '3.1m/person' },
]

export default function AdminDashboardPage() {
  // State Management
  const [tokensList, setTokensList] = useState(MOCK_TOKENS)
  const [counters, setCounters] = useState(INITIAL_COUNTERS)
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [chartMode, setChartMode] = useState('footfall') // 'footfall' | 'waittime'
  const [actionNotice, setActionNotice] = useState('')

  // KPI Metrics State
  const [totalServed, setTotalServed] = useState(MOCK_QUEUE_STATUS.tokensServedToday)

  // Show temporary action notification
  const showNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3500)
  }

  // Action: Boost Token Priority (Move to top of queue)
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

  return (
    <main className="flex-1 flex flex-col page-section py-8 max-w-7xl w-full bg-slate-50">
      {/* ── Top Header & Fast Action Bar ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs px-2.5 py-0.5 rounded-full font-bold bg-primary-100 text-primary-800 border border-primary-200">
              OPERATIONS CONTROL
            </span>
            <span className="text-2xs text-slate-500 font-mono font-medium">Real-time Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Crowd &amp; Service Management Console
          </h1>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <Link to="/counter">
            <Button variant="secondary" size="sm" className="text-xs">
              <span>🖥️</span> Open Staff Desk View
            </Button>
          </Link>
          <Link to="/queue">
            <Button variant="ghost" size="sm" className="text-xs border border-slate-200 bg-white">
              <span>📺</span> Public TV Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionNotice && (
        <div className="mb-6 p-3.5 rounded-xl bg-primary-50 border border-primary-200 text-primary-900 text-xs flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2 font-medium">
            <span>⚡</span>
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice('')}
            className="text-primary-600 hover:text-primary-900 font-bold text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 1. Analytics KPI Metric Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-primary-600 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Visitors Today
            </span>
            <span className="text-xl p-1.5 rounded-lg bg-slate-100">👥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalServed + tokensList.length}
          </div>
          <span className="text-2xs text-emerald-700 font-bold mt-1 block">
            ↑ 14.8% vs last week average
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-accent-600 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Wait Time
            </span>
            <span className="text-xl p-1.5 rounded-lg bg-slate-100">⏱️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-accent-700">
            ~{MOCK_QUEUE_STATUS.avgWaitMinutes} mins
          </div>
          <span className="text-2xs text-accent-700 font-bold mt-1 block">
            Target SLA: &lt; 15 mins (Optimal)
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-amber-600 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Currently Waiting
            </span>
            <span className="text-xl p-1.5 rounded-lg bg-slate-100">⏳</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {tokensList.length}
          </div>
          <span className="text-2xs text-amber-800 font-bold mt-1 block">
            {tokensList.filter((t) => t.category !== 'normal').length} Priority category visitors
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-emerald-600 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completed / Served
            </span>
            <span className="text-xl p-1.5 rounded-lg bg-slate-100">✓</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {totalServed}
          </div>
          <span className="text-2xs text-emerald-700 font-bold mt-1 block">
            98.2% on-time resolution
          </span>
        </div>
      </div>

      {/* ── 2. Predictive Footfall & Wait Time Analytics Chart ──────────────── */}
      <section className="mb-10">
        <Card className="p-6 bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent-700 uppercase tracking-wider">
                  AI Demand Forecasting
                </span>
                <span className="text-2xs bg-accent-50 text-accent-800 border border-accent-200 px-2 py-0.5 rounded-full font-mono font-bold">
                  Prophet Model
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {chartMode === 'footfall' ? 'Hourly Crowd Footfall vs Counter Capacity' : 'Average Service Wait Duration Trend'}
              </h2>
            </div>

            {/* Chart Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setChartMode('footfall')}
                className={[
                  'px-3 py-1.5 rounded-lg font-bold transition-all',
                  chartMode === 'footfall' ? 'bg-white text-primary-700 shadow-xs' : 'text-slate-600 hover:text-slate-900',
                ].join(' ')}
              >
                Predicted Footfall
              </button>
              <button
                type="button"
                onClick={() => setChartMode('waittime')}
                className={[
                  'px-3 py-1.5 rounded-lg font-bold transition-all',
                  chartMode === 'waittime' ? 'bg-white text-primary-700 shadow-xs' : 'text-slate-600 hover:text-slate-900',
                ].join(' ')}
              >
                Wait Time Trend
              </button>
            </div>
          </div>

          {/* Chart Rendering Container */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'footfall' ? (
                <BarChart data={MOCK_FOOTFALL} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    labelStyle={{ color: '#4338ca', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Expected Visitors" />
                </BarChart>
              ) : (
                <AreaChart data={MOCK_WAIT_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waitGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit="m" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    labelStyle={{ color: '#0891b2', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="wait" stroke="#0891b2" strokeWidth={3} fillOpacity={1} fill="url(#waitGradientLight)" name="Wait (mins)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="text-2xs text-slate-500 mt-2 text-right font-medium">
            * Peak hours forecast between 11:00 AM - 01:00 PM based on past historical arrival patterns.
          </p>
        </Card>
      </section>

      {/* ── 3. Counter Status Mini Overview Grid ───────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🏢</span> Service Counter Desk Operational Status
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {counters.filter((c) => c.status === 'Active').length} of {counters.length} Desks Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {counters.map((ctr) => {
            const isActive = ctr.status === 'Active'
            return (
              <div
                key={ctr.id}
                className={[
                  'rounded-2xl p-4.5 border transition-all duration-150 bg-white shadow-2xs',
                  isActive ? 'border-slate-200' : 'border-dashed border-amber-300 bg-amber-50/30',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">{ctr.name}</span>
                  <span
                    className={[
                      'text-2xs font-bold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300',
                    ].join(' ')}
                  >
                    {ctr.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 truncate mb-2 font-medium">{ctr.service}</p>
                <div className="flex items-center justify-between text-2xs text-slate-500 mb-3">
                  <span>Clerk: <strong className="text-slate-800">{ctr.clerk}</strong></span>
                  <span className="font-mono font-bold text-primary-700">{ctr.speed}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-2xs text-slate-500">
                    Serving: <strong className="text-slate-900 font-mono text-xs">{ctr.currentToken}</strong>
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

      {/* ── 4. Live Queue Management Table with Search & Filters ────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>📋</span> Active Queue Management Table
            </h2>
            <p className="text-xs text-slate-600">
              Manage waiting visitors, adjust queue priority, or mark completed service
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search token or name..."
              className="input-field text-xs py-1.5 px-3 w-48 sm:w-56"
            />

            {/* Category Filter Pills */}
            <div className="flex bg-slate-200/70 p-1 rounded-xl border border-slate-200 text-2xs">
              {['all', 'normal', 'senior', 'disabled', 'pregnant'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={[
                    'px-2.5 py-1 rounded-lg font-bold capitalize transition-all',
                    categoryFilter === cat ? 'bg-white text-primary-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900',
                  ].join(' ')}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-2xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Visitor</th>
                  <th className="py-3 px-4">Priority Status</th>
                  <th className="py-3 px-4">Est. Wait</th>
                  <th className="py-3 px-4 text-right">Queue Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                      No matching tokens found in the active queue.
                    </td>
                  </tr>
                ) : (
                  filteredTokens.map((tok, idx) => (
                    <tr key={tok.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-500">
                        #{tok.position || idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {tok.id}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-700 font-semibold">
                        {tok.name}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={tok.category}
                          label={CATEGORY_CONFIG[tok.category]?.label || 'Standard'}
                          showIcon
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-accent-700 font-bold">
                        ~{tok.waitMin}m
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleBoostPriority(tok.id)}
                            title="Boost to Front of Queue"
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-2xs font-bold transition shadow-2xs"
                          >
                            ⚡ Priority Boost
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkServed(tok.id)}
                            title="Mark as Served"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-2xs font-bold transition shadow-2xs"
                          >
                            ✓ Serve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelToken(tok.id)}
                            title="Cancel Token"
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-2xs font-bold transition shadow-2xs"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
