import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CATEGORY_CONFIG, MOCK_TOKENS, MOCK_QUEUE_STATUS } from '../mockData'

// Initial Active Serving Counters Data
const INITIAL_COUNTERS = [
  { id: 1, name: 'Counter 1', service: 'General Inquiries', currentToken: 'A-102', status: 'In Progress', staff: 'S. Mohapatra' },
  { id: 2, name: 'Counter 2', service: 'Fee & Billing Desk', currentToken: 'B-108', status: 'Calling', staff: 'A. Jena' },
  { id: 3, name: 'Counter 3', service: 'Doc Verification', currentToken: 'C-094', status: 'In Progress', staff: 'R. Tripathy' },
  { id: 4, name: 'Priority Desk', service: 'Express Assistance', currentToken: 'P-031', status: 'Calling', staff: 'P. Behera' },
]

export default function QueueDisplayPage() {
  // Live Simulation State
  const [counters, setCounters] = useState(INITIAL_COUNTERS)
  const [queueList, setQueueList] = useState(MOCK_TOKENS)
  const [totalWaiting, setTotalWaiting] = useState(MOCK_QUEUE_STATUS.totalInQueue)
  const [tokensServed, setTokensServed] = useState(MOCK_QUEUE_STATUS.tokensServedToday)
  const [isSimulating, setIsSimulating] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Search / Personal Tracker State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  // Advance queue simulation step
  const handleSimulateNext = () => {
    setQueueList((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue

      const [nextToServe, ...remaining] = prevQueue

      // Pick a random counter to update
      setCounters((prevCounters) => {
        const randomCounterIndex = Math.floor(Math.random() * prevCounters.length)
        return prevCounters.map((ctr, idx) => {
          if (idx === randomCounterIndex) {
            return {
              ...ctr,
              currentToken: nextToServe.id,
              status: Math.random() > 0.5 ? 'Calling' : 'In Progress',
            }
          }
          return ctr
        })
      })

      // Add a simulated new entry to the end of the queue occasionally
      const newSimulatedToken = {
        id: `T0${Math.floor(Math.random() * 50) + 51}`,
        name: ['Anita Dash', 'Sunil Roy', 'Prakash Rout', 'Geeta Sahu', 'Manoj Panda'][Math.floor(Math.random() * 5)],
        category: Math.random() < 0.25 ? 'senior' : Math.random() < 0.15 ? 'pregnant' : 'normal',
        position: remaining.length + 1,
        waitMin: (remaining.length + 1) * 3,
      }

      setTokensServed((prev) => prev + 1)
      setTotalWaiting(remaining.length + 1)
      setLastUpdated(new Date())

      return [...remaining, newSimulatedToken]
    })
  }

  // Simulation effect: automatically advance queue when isSimulating is active
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      handleSimulateNext()
    }, 4500)

    return () => clearInterval(interval)
  }, [isSimulating])

  // Handle Token Search
  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchQuery.trim().toUpperCase()
    if (!query) {
      setSearchResult(null)
      return
    }

    // Check currently serving
    const activeServingMatch = counters.find((c) => c.currentToken.toUpperCase() === query)
    if (activeServingMatch) {
      setSearchResult({
        found: true,
        isServingNow: true,
        token: query,
        counter: activeServingMatch.name,
        service: activeServingMatch.service,
        status: activeServingMatch.status,
      })
      return
    }

    // Check waiting queue
    const queueIndex = queueList.findIndex((item) => item.id.toUpperCase() === query)
    if (queueIndex !== -1) {
      const match = queueList[queueIndex]
      setSearchResult({
        found: true,
        isServingNow: false,
        token: match.id,
        name: match.name,
        position: queueIndex + 1,
        waitMin: match.waitMin,
        category: match.category,
      })
      return
    }

    // Not found
    setSearchResult({
      found: false,
      token: query,
    })
  }

  return (
    <main className="flex-1 flex flex-col page-section py-8 max-w-7xl w-full">
      {/* ── 1. Top Screen Banner & Controls ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-3">
            <span className="live-indicator">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-400" />
              </span>
              LIVE PUBLIC QUEUE BOARD
            </span>
            <span className="text-2xs text-gray-500 font-mono">
              Last update: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Now Serving &amp; Queue Status
          </h1>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant={isSimulating ? 'success' : 'secondary'}
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            className="text-xs"
          >
            <span className={['w-2 h-2 rounded-full', isSimulating ? 'bg-white animate-pulse' : 'bg-gray-400'].join(' ')} />
            {isSimulating ? 'Simulation: Active' : 'Start Auto-Simulation'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSimulateNext}
            className="text-xs border border-surface-border"
            title="Advance next person in line"
          >
            Next Token →
          </Button>

          <Link to="/token">
            <Button variant="primary" size="sm" className="text-xs">
              + Get Token
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Live Overview Stats Strip ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 flex items-center gap-3 border-l-4 border-primary-500">
          <span className="text-2xl p-2 rounded-xl bg-dark-700">👥</span>
          <div>
            <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wider block">
              Waiting in Queue
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {totalWaiting} People
            </span>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 border-l-4 border-accent-400">
          <span className="text-2xl p-2 rounded-xl bg-dark-700">⏱️</span>
          <div>
            <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wider block">
              Average Wait Time
            </span>
            <span className="text-xl sm:text-2xl font-black text-accent-400">
              ~{MOCK_QUEUE_STATUS.avgWaitMinutes} Mins
            </span>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 border-l-4 border-success-500">
          <span className="text-2xl p-2 rounded-xl bg-dark-700">🏢</span>
          <div>
            <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wider block">
              Active Counters
            </span>
            <span className="text-xl sm:text-2xl font-black text-success-400">
              {counters.length} Operational
            </span>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 border-l-4 border-warning-500">
          <span className="text-2xl p-2 rounded-xl bg-dark-700">✓</span>
          <div>
            <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wider block">
              Served Today
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {tokensServed}+
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. "Now Serving" Counter Cards (Hero Grid) ─────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-400 animate-ping" />
            Active Serving Counters
          </h2>
          <span className="text-xs text-gray-400">Please proceed when your token is shown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {counters.map((ctr) => {
            const isCalling = ctr.status === 'Calling'
            return (
              <Card
                key={ctr.id}
                className={[
                  'relative overflow-hidden transition-all duration-300',
                  isCalling
                    ? 'border-2 border-accent-400 shadow-glow-accent bg-dark-800'
                    : 'border border-surface-border bg-dark-800/90',
                ].join(' ')}
                padding="md"
              >
                {/* Status Indicator Pill */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
                    {ctr.name}
                  </span>
                  <span
                    className={[
                      'text-2xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider',
                      isCalling
                        ? 'bg-accent-500/20 text-accent-300 border border-accent-500/40 animate-pulse'
                        : 'bg-success-500/15 text-success-400 border border-success-500/30',
                    ].join(' ')}
                  >
                    {ctr.status}
                  </span>
                </div>

                {/* Big Token Number */}
                <div className="text-center py-2">
                  <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">
                    Serving Token
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight animate-number-pop">
                    {ctr.currentToken}
                  </div>
                </div>

                {/* Service Details Footer */}
                <div className="mt-3 pt-3 border-t border-surface-border/80 flex items-center justify-between text-xs text-gray-400">
                  <span className="truncate">{ctr.service}</span>
                  <span className="text-gray-500 text-2xs">{ctr.staff}</span>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ── 4. Main Two-Column Layout: Search Tracker + Upcoming List ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Token Search & Tracker */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span>🔍</span> Track Your Token
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter the token number from your ticket to check your exact position and estimated wait.
            </p>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. T045, A-102"
                  className="input-field uppercase font-mono tracking-wider text-sm pr-20"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="absolute right-1.5 top-1.5 text-xs py-1.5"
                >
                  Check
                </Button>
              </div>
            </form>

            {/* Search Result Feedback */}
            {searchResult && (
              <div className="mt-5 animate-scale-in">
                {searchResult.found ? (
                  searchResult.isServingNow ? (
                    <div className="p-4 rounded-xl bg-success-500/15 border border-success-500/40 text-center">
                      <span className="text-2xl block mb-1">🎉</span>
                      <h4 className="font-bold text-success-400 text-sm">
                        It's Your Turn Now!
                      </h4>
                      <p className="text-xs text-gray-300 mt-1">
                        Token <strong className="text-white font-mono">{searchResult.token}</strong> is currently being served at{' '}
                        <strong className="text-white">{searchResult.counter}</strong> ({searchResult.service}).
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-primary-600/15 border border-primary-500/40 space-y-2">
                      <div className="flex items-center justify-between border-b border-primary-500/30 pb-2">
                        <span className="text-xs font-bold text-primary-300 font-mono text-base">
                          {searchResult.token}
                        </span>
                        <Badge
                          variant={searchResult.category || 'normal'}
                          label={CATEGORY_CONFIG[searchResult.category]?.label || 'Standard'}
                          size="sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center pt-1">
                        <div className="bg-dark-900/60 rounded-lg p-2">
                          <span className="text-2xs text-gray-400 block">Queue Position</span>
                          <span className="text-sm font-bold text-white">#{searchResult.position} in line</span>
                        </div>
                        <div className="bg-dark-900/60 rounded-lg p-2">
                          <span className="text-2xs text-gray-400 block">Est. Remaining</span>
                          <span className="text-sm font-bold text-accent-400">~{searchResult.waitMin} mins</span>
                        </div>
                      </div>
                      <p className="text-2xs text-gray-400 text-center pt-1">
                        Please stay nearby. We will notify you when you are up next.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-4 rounded-xl bg-dark-700/60 border border-surface-border text-center text-xs text-gray-400">
                    Token <strong className="text-white font-mono">{searchResult.token}</strong> was not found in the active queue. Please verify the number or request a new token.
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Service Instructions / Fast Tips */}
          <div className="glass-card p-5 space-y-3 text-xs text-gray-400">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Service Desk Guidelines
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary-400 font-bold">•</span>
                <span>Keep original identification and supporting documents ready before approaching the desk.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 font-bold">•</span>
                <span>Special assistance is available at the Priority Desk for seniors &amp; expectant mothers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 font-bold">•</span>
                <span>Missed calls can be restored by presenting your ticket to any active counter clerk.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Upcoming Queue Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>📋</span> Next in Line (Upcoming Tokens)
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              Showing top {queueList.length} waiting
            </span>
          </div>

          <div className="glass-card overflow-hidden border border-surface-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-dark-800/80 text-2xs uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-4">Pos</th>
                    <th className="py-3 px-4">Token ID</th>
                    <th className="py-3 px-4">Visitor</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Est. Wait</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {queueList.map((token, index) => {
                    const isSearched = searchResult?.found && searchResult.token === token.id
                    return (
                      <tr
                        key={token.id}
                        className={[
                          'transition-colors duration-150',
                          isSearched
                            ? 'bg-primary-600/25 font-semibold text-white'
                            : index % 2 === 0
                            ? 'bg-transparent hover:bg-white/5'
                            : 'bg-dark-800/30 hover:bg-white/5',
                        ].join(' ')}
                      >
                        <td className="py-3 px-4 text-xs font-mono text-gray-400">
                          #{index + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {token.id}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-300">
                          {token.name}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={token.category}
                            label={CATEGORY_CONFIG[token.category]?.label || 'Standard'}
                            showIcon
                            size="sm"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-accent-400 font-medium">
                          ~{token.waitMin}m
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
    </main>
  )
}
