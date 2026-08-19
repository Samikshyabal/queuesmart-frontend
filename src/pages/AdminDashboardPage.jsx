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
    <main className="flex-1 flex flex-col page-section py-8 max-w-7xl w-full">
      {/* ── Top Header & Fast Action Bar ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs px-2.5 py-0.5 rounded-full font-bold bg-primary-600/20 text-primary-300 border border-primary-500/30">
              OPERATIONS CONTROL
            </span>
            <span className="text-2xs text-gray-500 font-mono">Real-time Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
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
            <Button variant="ghost" size="sm" className="text-xs border border-surface-border">
              <span>📺</span> Public TV Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionNotice && (
        <div className="mb-6 p-3 rounded-xl bg-primary-600/20 border border-primary-500/40 text-primary-200 text-xs flex items-center justify-between animate-fade-in shadow-glow-primary">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice('')}
            className="text-primary-300 hover:text-white font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 1. Analytics KPI Metric Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 border-l-4 border-primary-500 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Visitors Today
            </span>
            <span className="text-xl p-1.5 rounded-lg bg-dark-700">👥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalServed + tokensList.length}
          </div>
          <span className="text-2xs text-success-400 font-medium mt-1 block">
            ↑ 14.8% vs last week average
          </span>
        </div>

        <div className="glass-card p-5 border-l-4 border-accent-400 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Average Wait Time
            </span>
            <span className="text-xl p-1.5 rounded-lg bg-dark-700">⏱️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-accent-400">
            ~{MOCK_QUEUE_STATUS.avgWaitMinutes} mins
          </div>
          <span className="text-2xs text-accent-300 font-medium mt-1 block">
            Target SLA: &lt; 15 mins (Optimal)
          </span>
        </div>

        <div className="glass-card p-5 border-l-4 border-warning-500 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Currently Waiting
            </span>
            <span className="text-xl p-1.5 rounded-lg bg-dark-700">⏳</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-warning-400">
            {tokensList.length}
          </div>
          <span className="text-2xs text-warning-300 font-medium mt-1 block">
            {tokensList.filter((t) => t.category !== 'normal').length} Priority category users
          </span>
        </div>

        <div className="glass-card p-5 border-l-4 border-success-500 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Completed / Served
            </span>
            <span className="text-xl p-1.5 rounded-lg bg-dark-700">✓</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-success-400">
            {totalServed}
          </div>
          <span className="text-2xs text-success-300 font-medium mt-1 block">
            98.2% on-time resolution
          </span>
        </div>
      </div>

      {/* ── 2. Predictive Footfall & Wait Time Analytics Chart ──────────────── */}
      <section className="mb-10">
        <Card className="p-6 bg-dark-800/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent-400 uppercase tracking-wider">
                  AI Demand Forecasting
                </span>
                <span className="text-2xs bg-accent-500/20 text-accent-300 px-2 py-0.5 rounded-full font-mono">
                  Prophet Model
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {chartMode === 'footfall' ? 'Hourly Crowd Footfall vs Capacity' : 'Average Service Wait Duration'}
              </h2>
            </div>

            {/* Chart Mode Toggle */}
            <div className="flex bg-dark-700 p-1 rounded-xl border border-surface-border text-xs">
              <button
                type="button"
                onClick={() => setChartMode('footfall')}
                className={[
                  'px-3 py-1.5 rounded-lg font-semibold transition-all',
                  chartMode === 'footfall' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white',
                ].join(' ')}
              >
                Predicted Footfall
              </button>
              <button
                type="button"
                onClick={() => setChartMode('waittime')}
                className={[
                  'px-3 py-1.5 rounded-lg font-semibold transition-all',
                  chartMode === 'waittime' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white',
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3358" vertical={false} />
                  <XAxis dataKey="hour" stroke="#818cf8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#818cf8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#13162b', borderColor: '#2d3358', borderRadius: '12px', color: '#fff' }}
                    labelStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Expected Visitors" />
                </BarChart>
              ) : (
                <AreaChart data={MOCK_WAIT_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3358" vertical={false} />
                  <XAxis dataKey="hour" stroke="#818cf8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#818cf8" fontSize={12} tickLine={false} unit="m" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#13162b', borderColor: '#2d3358', borderRadius: '12px', color: '#fff' }}
                    labelStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="wait" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#waitGradient)" name="Wait (mins)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="text-2xs text-gray-500 mt-2 text-right">
            * Peak hours predicted between 11:00 AM - 01:00 PM based on past historical traffic.
          </p>
        </Card>
      </section>

      {/* ── 3. Counter Status Mini Overview Grid ───────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏢</span> Service Counter Desk Operational Status
          </h2>
          <span className="text-xs text-gray-400">
            {counters.filter((c) => c.status === 'Active').length} of {counters.length} Desks Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {counters.map((ctr) => {
            const isActive = ctr.status === 'Active'
            return (
              <Card
                key={ctr.id}
                className={[
                  'border transition-all duration-200',
                  isActive ? 'border-surface-border bg-dark-800' : 'border-dashed border-gray-700 bg-dark-900/60 opacity-80',
                ].join(' ')}
                padding="sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{ctr.name}</span>
                  <span
                    className={[
                      'text-2xs font-semibold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-success-500/15 text-success-400' : 'bg-warning-500/15 text-warning-400',
                    ].join(' ')}
                  >
                    {ctr.status}
                  </span>
                </div>

                <p className="text-xs text-gray-400 truncate mb-1">{ctr.service}</p>
                <div className="flex items-center justify-between text-2xs text-gray-400 mb-3">
                  <span>Clerk: <strong className="text-gray-300">{ctr.clerk}</strong></span>
                  <span className="font-mono text-primary-300">{ctr.speed}</span>
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                  <span className="text-2xs text-gray-400">
                    Serving: <strong className="text-white font-mono text-xs">{ctr.currentToken}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleCounter(ctr.id)}
                    className="text-2xs font-semibold text-primary-400 hover:text-primary-300 underline"
                  >
                    {isActive ? 'Set Break' : 'Resume'}
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ── 4. Live Queue Management Table with Search & Filters ────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>📋</span> Active Queue Management Table
            </h2>
            <p className="text-xs text-gray-400">
              Manage waiting visitors, manually adjust queue order, or trigger priority fairness boost
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
            <div className="flex bg-dark-800 p-1 rounded-xl border border-surface-border text-2xs">
              {['all', 'normal', 'senior', 'disabled', 'pregnant'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={[
                    'px-2 py-1 rounded-lg font-medium capitalize transition-all',
                    categoryFilter === cat ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white',
                  ].join(' ')}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="glass-card overflow-hidden border border-surface-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-dark-800/90 text-2xs uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Visitor</th>
                  <th className="py-3 px-4">Priority Status</th>
                  <th className="py-3 px-4">Est. Wait</th>
                  <th className="py-3 px-4 text-right">Queue Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                      No matching tokens found in the active queue.
                    </td>
                  </tr>
                ) : (
                  filteredTokens.map((tok, idx) => (
                    <tr key={tok.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-gray-400">
                        #{tok.position || idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {tok.id}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-300 font-medium">
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
                      <td className="py-3 px-4 font-mono text-xs text-accent-400 font-semibold">
                        ~{tok.waitMin}m
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleBoostPriority(tok.id)}
                            title="Boost to Front of Queue"
                            className="px-2 py-1 rounded-lg bg-warning-500/15 hover:bg-warning-500/25 border border-warning-500/30 text-warning-300 text-2xs font-semibold transition"
                          >
                            ⚡ Priority Boost
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkServed(tok.id)}
                            title="Mark as Served"
                            className="px-2 py-1 rounded-lg bg-success-500/15 hover:bg-success-500/25 border border-success-500/30 text-success-300 text-2xs font-semibold transition"
                          >
                            ✓ Serve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelToken(tok.id)}
                            title="Cancel Token"
                            className="px-2 py-1 rounded-lg bg-danger-500/15 hover:bg-danger-500/25 border border-danger-500/30 text-danger-300 text-2xs font-semibold transition"
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
