import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CATEGORY_CONFIG, MOCK_TOKENS } from '../mockData'

// Counter Desks Definitions
const COUNTER_OPTIONS = [
  { id: 'c1', code: 'A', name: 'Counter 01 — General Services', clerk: 'S. Mohapatra', prefix: 'A' },
  { id: 'c2', code: 'B', name: 'Counter 02 — Billing & Payments', clerk: 'A. Jena', prefix: 'B' },
  { id: 'c3', code: 'C', name: 'Counter 03 — Document Verification', clerk: 'R. Tripathy', prefix: 'C' },
  { id: 'cp', code: 'P', name: 'Counter 04 — Priority Desk', clerk: 'P. Behera', prefix: 'P' },
]

export default function CounterPage() {

  // Desk State
  const [selectedCounterId, setSelectedCounterId] = useState('c1')
  const [counterStatus, setCounterStatus] = useState('Serving') // 'Available' | 'Serving' | 'On Break'
  const [serviceNotes, setServiceNotes] = useState('')
  const [deskServedCount, setDeskServedCount] = useState(24)
  const [actionAlert, setActionAlert] = useState('')
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [transferTarget, setTransferTarget] = useState('c2')

  // Currently Serving Token
  const [activeToken, setActiveToken] = useState({
    id: 'A-102',
    name: 'Ramesh Kumar',
    phone: '98765-43210',
    category: 'senior',
    service: 'General Service & Inquiries',
    checkedInAt: '10:14 AM',
    waitedMinutes: 8,
  })

  // Upcoming Queue for this desk
  const [deskQueue, setDeskQueue] = useState(MOCK_TOKENS)

  // Serving Timer Simulation
  const [elapsedSeconds, setElapsedSeconds] = useState(145)

  useEffect(() => {
    if (counterStatus !== 'Serving' || !activeToken) return
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [counterStatus, activeToken])

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Toast feedback helper
  const showActionFeedback = (msg) => {
    setActionAlert(msg)
    setTimeout(() => setActionAlert(''), 3500)
  }

  // Action: Call Next Token
  const handleCallNext = () => {
    if (deskQueue.length === 0) {
      showActionFeedback('No more visitors waiting in the queue.')
      setActiveToken(null)
      setCounterStatus('Available')
      return
    }

    const [nextPerson, ...rest] = deskQueue
    setActiveToken({
      id: nextPerson.id,
      name: nextPerson.name,
      phone: '98765-XXXXX',
      category: nextPerson.category,
      service: 'General Service & Inquiries',
      checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waitedMinutes: nextPerson.waitMin,
    })
    setDeskQueue(rest)
    setElapsedSeconds(0)
    setServiceNotes('')
    setCounterStatus('Serving')
    showActionFeedback(`📢 Calling Token #${nextPerson.id} (${nextPerson.name}) to this desk!`)
  }

  // Action: Recall (Chime / Audio Notification)
  const handleRecall = () => {
    if (!activeToken) return
    showActionFeedback(`🔔 Chime broadcast: "Now calling Token ${activeToken.id} at ${currentCounter.name}"`)
  }

  // Action: Mark as Completed
  const handleComplete = () => {
    if (!activeToken) return
    setDeskServedCount((prev) => prev + 1)
    showActionFeedback(`✓ Token #${activeToken.id} marked as completed. Ready for next visitor.`)
    setActiveToken(null)
    setCounterStatus('Available')
    setServiceNotes('')
    setElapsedSeconds(0)
  }

  // Action: Mark as No-Show
  const handleNoShow = () => {
    if (!activeToken) return
    showActionFeedback(`⚠️ Token #${activeToken.id} marked as No-Show and removed from active list.`)
    setActiveToken(null)
    setCounterStatus('Available')
    setElapsedSeconds(0)
  }

  // Action: Transfer Token
  const handleTransfer = () => {
    const targetDesk = COUNTER_OPTIONS.find((c) => c.id === transferTarget)
    showActionFeedback(`↗️ Token #${activeToken.id} transferred to ${targetDesk.name}.`)
    setTransferModalOpen(false)
    setActiveToken(null)
    setCounterStatus('Available')
    setElapsedSeconds(0)
  }

  // Action: Quick Call specific token from queue list
  const handleCallSpecific = (tokenItem) => {
    setActiveToken({
      id: tokenItem.id,
      name: tokenItem.name,
      phone: '98765-XXXXX',
      category: tokenItem.category,
      service: 'General Service & Inquiries',
      checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waitedMinutes: tokenItem.waitMin,
    })
    setDeskQueue((prev) => prev.filter((t) => t.id !== tokenItem.id))
    setElapsedSeconds(0)
    setServiceNotes('')
    setCounterStatus('Serving')
    showActionFeedback(`📢 Direct Call: Token #${tokenItem.id} is now active at this desk.`)
  }

  const currentCounter = COUNTER_OPTIONS.find((c) => c.id === selectedCounterId) || COUNTER_OPTIONS[0]

  return (
    <main className="flex-1 flex flex-col page-section py-8 max-w-7xl w-full">
      {/* ── 1. Counter Header & Desk Status Bar ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-surface-border">
        {/* Desk Info & Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-xl">
            🖥️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold text-primary-400 uppercase tracking-widest">
                STAFF WORKSTATION
              </span>
              <span className="text-2xs text-gray-500 font-mono">• Clerk: {currentCounter.clerk}</span>
            </div>
            {/* Counter Selector Dropdown */}
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={selectedCounterId}
                onChange={(e) => {
                  setSelectedCounterId(e.target.value)
                  showActionFeedback(`Switched to ${COUNTER_OPTIONS.find((c) => c.id === e.target.value)?.name}`)
                }}
                className="bg-dark-800 border border-surface-border rounded-lg text-sm font-bold text-white py-1 px-2.5 focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                {COUNTER_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-dark-900 text-white">
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Control Buttons & Session Summary */}
        <div className="flex items-center gap-3">
          {/* Status Selector Pill */}
          <div className="flex bg-dark-800 p-1 rounded-xl border border-surface-border text-xs">
            <button
              type="button"
              onClick={() => { setCounterStatus('Serving'); showActionFeedback('Desk marked as Serving / Busy') }}
              className={[
                'px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5',
                counterStatus === 'Serving' ? 'bg-primary-600 text-white shadow' : 'text-gray-400 hover:text-white',
              ].join(' ')}
            >
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-ping" />
              Serving
            </button>

            <button
              type="button"
              onClick={() => { setCounterStatus('Available'); showActionFeedback('Desk marked as Available / Ready') }}
              className={[
                'px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5',
                counterStatus === 'Available' ? 'bg-success-600 text-white shadow' : 'text-gray-400 hover:text-white',
              ].join(' ')}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              Available
            </button>

            <button
              type="button"
              onClick={() => { setCounterStatus('On Break'); showActionFeedback('Desk marked as On Break') }}
              className={[
                'px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5',
                counterStatus === 'On Break' ? 'bg-warning-600 text-white shadow' : 'text-gray-400 hover:text-white',
              ].join(' ')}
            >
              <span>☕</span> Break
            </button>
          </div>

          <Link to="/admin">
            <Button variant="ghost" size="sm" className="text-xs border border-surface-border">
              Admin View →
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Toast Notification */}
      {actionAlert && (
        <div className="mb-6 p-3 rounded-xl bg-primary-600/20 border border-primary-500/40 text-primary-200 text-xs flex items-center justify-between animate-fade-in shadow-glow-primary">
          <div className="flex items-center gap-2">
            <span>📢</span>
            <span>{actionAlert}</span>
          </div>
          <button onClick={() => setActionAlert('')} className="text-primary-300 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* ── 2. Desk Session Metrics Bar ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-2xs text-gray-400 uppercase tracking-wider block">Served at this Desk</span>
            <span className="text-xl font-bold text-white">{deskServedCount} Visitors</span>
          </div>
          <span className="text-xl">🏆</span>
        </div>

        <div className="glass-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-2xs text-gray-400 uppercase tracking-wider block">Avg Handling Duration</span>
            <span className="text-xl font-bold text-accent-400">3.8 mins</span>
          </div>
          <span className="text-xl">⏱️</span>
        </div>

        <div className="glass-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-2xs text-gray-400 uppercase tracking-wider block">Waiting for this Desk</span>
            <span className="text-xl font-bold text-warning-400">{deskQueue.length} In Line</span>
          </div>
          <span className="text-xl">👥</span>
        </div>

        <div className="glass-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-2xs text-gray-400 uppercase tracking-wider block">Current Status</span>
            <span className="text-sm font-bold text-success-400 uppercase tracking-wider">{counterStatus}</span>
          </div>
          <span className="text-xl">🟢</span>
        </div>
      </div>

      {/* ── 3. Main Action Layout (Hero Token Card + Upcoming Queue) ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Currently Serving Hero Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 bg-dark-800/90 border-2 border-primary-500/40 relative overflow-hidden shadow-2xl">
            {/* Header / Active Indicator */}
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success-400" />
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Currently at Desk
                </span>
              </div>

              {/* Service Handling Duration Timer */}
              <div className="flex items-center gap-2 bg-dark-900 border border-surface-border px-3 py-1 rounded-xl">
                <span className="text-2xs text-gray-400 font-medium">Handling Duration:</span>
                <span className="font-mono text-sm font-bold text-accent-400">
                  {formatTimer(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* Currently Serving Hero Area */}
            {activeToken ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-900/80 border border-surface-border">
                  {/* Big Token Display */}
                  <div>
                    <span className="text-2xs font-semibold text-gray-400 uppercase tracking-widest block mb-0.5">
                      Active Customer Ticket
                    </span>
                    <div className="text-5xl font-black text-white gradient-text tracking-tight animate-number-pop">
                      {activeToken.id}
                    </div>
                  </div>

                  {/* Customer Details & Priority */}
                  <div className="sm:text-right space-y-1">
                    <h3 className="text-lg font-bold text-white">{activeToken.name}</h3>
                    <p className="text-xs font-mono text-gray-400">{activeToken.phone}</p>
                    <div className="sm:justify-end flex">
                      <Badge
                        variant={activeToken.category}
                        label={CATEGORY_CONFIG[activeToken.category]?.label || 'Standard'}
                        showIcon
                        size="md"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Ticket Metadata */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-dark-700/60 rounded-xl p-2.5 border border-surface-border">
                    <span className="text-2xs text-gray-400 block">Service Requested</span>
                    <span className="font-semibold text-white truncate block">{activeToken.service}</span>
                  </div>
                  <div className="bg-dark-700/60 rounded-xl p-2.5 border border-surface-border">
                    <span className="text-2xs text-gray-400 block">Check-in Time</span>
                    <span className="font-mono font-semibold text-white">{activeToken.checkedInAt}</span>
                  </div>
                  <div className="bg-dark-700/60 rounded-xl p-2.5 border border-surface-border">
                    <span className="text-2xs text-gray-400 block">Prior Wait Time</span>
                    <span className="font-semibold text-accent-400">~{activeToken.waitedMinutes} mins</span>
                  </div>
                </div>

                {/* ── Clerk Service Notes / Remarks ────────────────────────── */}
                <div>
                  <label htmlFor="service-notes" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Clerk Remarks &amp; Resolution Notes
                  </label>
                  <textarea
                    id="service-notes"
                    rows={2}
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="Enter notes or actions taken (e.g. Identity verified, certificate issued, receipt attached)..."
                    className="input-field text-xs resize-none"
                  />
                  {/* Quick Remarks Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Resolved successfully', 'Documents verified', 'Challan paid', 'Needs follow-up'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setServiceNotes((prev) => (prev ? `${prev}, ${chip}` : chip))}
                        className="text-2xs px-2 py-0.5 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300 border border-surface-border transition"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Workflow Action Buttons ──────────────────────────────── */}
                <div className="pt-2 border-t border-surface-border space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleComplete}
                      className="font-bold shadow-glow-success"
                    >
                      ✓ Mark Completed &amp; Next
                    </Button>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCallNext}
                      className="font-bold"
                    >
                      📢 Call Next Token →
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRecall}
                      title="Play audio chime again"
                    >
                      🔔 Re-Call Chime
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setTransferModalOpen(true)}
                    >
                      ↗️ Transfer Desk
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleNoShow}
                    >
                      ⚠️ No-Show
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Desk State */
              <div className="py-12 text-center space-y-4">
                <div className="text-5xl">🪑</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Counter is Currently Idle</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    There is currently no active visitor being served at {currentCounter.name}. Click below to summon the next in line.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCallNext}
                  className="min-w-[200px]"
                >
                  📢 Call Next Token
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Upcoming Queue for this Counter */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>👥</span> Desk Queue ({deskQueue.length})
            </h3>
            <span className="text-2xs text-gray-400 font-mono">Real-time line</span>
          </div>

          <div className="glass-card p-3 space-y-2 max-h-[580px] overflow-y-auto">
            {deskQueue.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                Queue is clear! No more waiting visitors.
              </div>
            ) : (
              deskQueue.map((tok, idx) => (
                <div
                  key={tok.id}
                  className="p-3 rounded-xl bg-dark-800/80 border border-surface-border hover:border-gray-600 transition-all flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xs font-mono font-bold text-gray-400 bg-dark-700 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-xs">{tok.id}</span>
                        <Badge variant={tok.category} label={CATEGORY_CONFIG[tok.category]?.label || 'Normal'} size="sm" />
                      </div>
                      <p className="text-2xs text-gray-300 truncate mt-0.5">{tok.name}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCallSpecific(tok)}
                    className="px-2 py-1 rounded-lg bg-primary-600/20 hover:bg-primary-600 text-primary-300 hover:text-white text-2xs font-bold border border-primary-500/30 transition shrink-0"
                    title="Directly summon this token"
                  >
                    Call
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Transfer Token Modal ───────────────────────────────────────────── */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-800 border border-surface-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span>↗️</span> Transfer Active Token
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Select destination counter desk to redirect Token <strong className="text-white font-mono">{activeToken?.id}</strong>.
            </p>

            <div className="space-y-2 mb-5">
              {COUNTER_OPTIONS.filter((c) => c.id !== selectedCounterId).map((c) => (
                <label
                  key={c.id}
                  className={[
                    'flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition',
                    transferTarget === c.id
                      ? 'bg-primary-600/20 border-primary-500 text-white'
                      : 'bg-dark-700/60 border-surface-border text-gray-300 hover:border-gray-500',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="transferTarget"
                      checked={transferTarget === c.id}
                      onChange={() => setTransferTarget(c.id)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="font-semibold">{c.name}</span>
                  </div>
                  <span className="text-2xs text-gray-500 font-mono">{c.clerk}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setTransferModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={handleTransfer}
              >
                Confirm Transfer
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
