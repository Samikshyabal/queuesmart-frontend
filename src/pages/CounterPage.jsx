import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CATEGORY_CONFIG, MOCK_TOKENS, MOCK_QUEUE_STATUS, DEPT_WAIT_ESTIMATES } from '../mockData'

// ── Counter Desks aligned with hospital departments ───────────────────────────
const COUNTER_OPTIONS = [
  { id: 'c1', code: 'REG',   name: 'Counter 01 — Registration & Inquiries', clerk: DEPT_WAIT_ESTIMATES.registration.doctorName, service: 'UHID & Check-in', avgConsultMin: 4 },
  { id: 'c2', code: 'OPD',   name: 'Counter 02 — General OPD Consultation', clerk: DEPT_WAIT_ESTIMATES.opd.doctorName,          service: 'General Medicine', avgConsultMin: 8 },
  { id: 'c3', code: 'CARD',  name: 'Room 104 — Cardiology Clinic',          clerk: DEPT_WAIT_ESTIMATES.cardiology.doctorName,   service: 'Heart & ECG Review', avgConsultMin: 12 },
  { id: 'c4', code: 'ORTHO', name: 'Room 106 — Orthopedics OPD',           clerk: DEPT_WAIT_ESTIMATES.orthopedics.doctorName,  service: 'Bone & Joint Consult', avgConsultMin: 10 },
  { id: 'c5', code: 'PED',   name: 'Room 108 — Pediatrics OPD',            clerk: DEPT_WAIT_ESTIMATES.pediatrics.doctorName,   service: 'Child Health', avgConsultMin: 8 },
  { id: 'c6', code: 'PH',    name: 'Counter 06 — Pharmacy Dispensing',     clerk: DEPT_WAIT_ESTIMATES.pharmacy.doctorName,     service: 'Prescription Dispensing', avgConsultMin: 5 },
]

export default function CounterPage() {
  // Desk State
  const [selectedCounterId, setSelectedCounterId] = useState('c2')
  const [counterStatus, setCounterStatus]         = useState('Serving') // 'Available' | 'Serving' | 'On Break'
  const [serviceNotes, setServiceNotes]           = useState('')
  const [deskServedCount, setDeskServedCount]     = useState(18)
  const [actionAlert, setActionAlert]             = useState('')
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [transferTarget, setTransferTarget]       = useState('c6')

  // Currently Serving Token
  const [activeToken, setActiveToken] = useState({
    id: 'OPD-102',
    name: 'Ramesh Kumar',
    phone: '98765-43210',
    category: 'senior',
    service: 'General OPD Consultation',
    checkedInAt: '10:14 AM',
    waitedMinutes: 24, // Exceeds average wait to demonstrate long-wait badge
  })

  // Upcoming Queue for this desk
  const [deskQueue, setDeskQueue] = useState(MOCK_TOKENS)

  // Serving Timer (seconds)
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

  const showActionFeedback = (msg) => {
    setActionAlert(msg)
    setTimeout(() => setActionAlert(''), 3500)
  }

  // ── 1. Primary Action: Call Next Patient ───────────────────────────────────
  const handleCallNext = () => {
    if (deskQueue.length === 0) {
      showActionFeedback('No more patients waiting in the queue for this department.')
      setActiveToken(null)
      setCounterStatus('Available')
      return
    }

    const [nextPerson, ...rest] = deskQueue
    const currentCounter = COUNTER_OPTIONS.find((c) => c.id === selectedCounterId) || COUNTER_OPTIONS[0]

    setActiveToken({
      id: nextPerson.id,
      name: nextPerson.name,
      phone: '98765-XXXXX',
      category: nextPerson.category,
      service: currentCounter.service,
      checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waitedMinutes: nextPerson.waitMin,
    })
    setDeskQueue(rest)
    setElapsedSeconds(0)
    setServiceNotes('')
    setCounterStatus('Serving')
    showActionFeedback(`📢 Calling Token #${nextPerson.id} (${nextPerson.name}) to this workstation!`)
  }

  // ── 2. Important Completion Action: Mark Complete ─────────────────────────
  const handleComplete = () => {
    if (!activeToken) return
    setDeskServedCount((prev) => prev + 1)
    showActionFeedback(`✓ Token #${activeToken.id} consultation completed. Ready for next patient.`)
    setActiveToken(null)
    setCounterStatus('Available')
    setServiceNotes('')
    setElapsedSeconds(0)
  }

  // ── 3. Secondary Action: Mark as No-Show ──────────────────────────────────
  const handleNoShow = () => {
    if (!activeToken) return
    showActionFeedback(`⚠️ Token #${activeToken.id} marked as No-Show and archived.`)
    setActiveToken(null)
    setCounterStatus('Available')
    setElapsedSeconds(0)
  }

  // ── 4. Secondary Action: Transfer to Department ───────────────────────────
  const handleTransfer = () => {
    if (!activeToken) return
    const targetDesk = COUNTER_OPTIONS.find((c) => c.id === transferTarget)
    showActionFeedback(`↗️ Token #${activeToken.id} transferred to ${targetDesk.name}.`)
    setTransferModalOpen(false)
    setActiveToken(null)
    setCounterStatus('Available')
    setElapsedSeconds(0)
  }

  // Audio Chime Recall
  const handleRecall = () => {
    if (!activeToken) return
    const currentCounter = COUNTER_OPTIONS.find((c) => c.id === selectedCounterId) || COUNTER_OPTIONS[0]
    showActionFeedback(`🔔 Chime broadcast: "Now calling Token ${activeToken.id} at ${currentCounter.name}"`)
  }

  // Quick Direct Call from queue
  const handleCallSpecific = (tokenItem) => {
    const currentCounter = COUNTER_OPTIONS.find((c) => c.id === selectedCounterId) || COUNTER_OPTIONS[0]
    setActiveToken({
      id: tokenItem.id,
      name: tokenItem.name,
      phone: '98765-XXXXX',
      category: tokenItem.category,
      service: currentCounter.service,
      checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waitedMinutes: tokenItem.waitMin,
    })
    setDeskQueue((prev) => prev.filter((t) => t.id !== tokenItem.id))
    setElapsedSeconds(0)
    setServiceNotes('')
    setCounterStatus('Serving')
    showActionFeedback(`📢 Direct Call: Token #${tokenItem.id} is now active at this workstation.`)
  }

  const currentCounter = COUNTER_OPTIONS.find((c) => c.id === selectedCounterId) || COUNTER_OPTIONS[0]

  // Smart Priority Check: is the very next patient a priority category?
  const isNextPatientPriority = deskQueue.length > 0 && deskQueue[0].category !== 'normal'

  // Calculate estimated call time for waiting patients
  const now = new Date()
  const getCallTime = (waitMin) => {
    const t = new Date(now.getTime() + waitMin * 60000)
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Check if current patient waited longer than the hospital average (~18m)
  const isWaitedLongerThanExpected = activeToken && activeToken.waitedMinutes > MOCK_QUEUE_STATUS.avgWaitMinutes

  return (
    <main className="flex-1 page-section py-6 space-y-6 bg-surface-soft max-w-7xl mx-auto w-full">
      {/* ── Action Alert Toast ─────────────────────────────────────────────── */}
      {actionAlert && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between shadow-card-elevated animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>{actionAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionAlert('')}
            className="text-slate-400 hover:text-white px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 1. Desk Header & Status Control ────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center text-xl shrink-0">
            🖥️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold text-primary-700 uppercase tracking-widest">
                DEPARTMENT WORKSTATION
              </span>
              <span className="text-2xs text-slate-500 font-mono">• {currentCounter.clerk}</span>
            </div>

            {/* Department selector */}
            <div className="flex items-center gap-2 mt-0.5">
              <select
                id="counter-select"
                value={selectedCounterId}
                onChange={(e) => setSelectedCounterId(e.target.value)}
                className="bg-transparent text-base sm:text-lg font-bold text-slate-900 border-none outline-none cursor-pointer p-0 pr-4"
              >
                {COUNTER_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status controls */}
        <div className="flex flex-wrap items-center gap-2">
          {['Serving', 'Available', 'On Break'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setCounterStatus(st)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border',
                counterStatus === st
                  ? st === 'Serving'
                    ? 'bg-success-600 border-success-600 text-white shadow-sm'
                    : st === 'Available'
                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                      : 'bg-amber-600 border-amber-600 text-white shadow-sm'
                  : 'bg-white border-surface-border text-slate-600 hover:border-slate-300',
              ].join(' ')}
            >
              <span className="mr-1">
                {st === 'Serving' ? '●' : st === 'Available' ? '✓' : '⏸'}
              </span>
              {st}
            </button>
          ))}
          <Link to="/admin" className="ml-2">
            <Button variant="secondary" size="sm">Admin Console</Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Session Info Bar ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-surface-border shadow-card text-center">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Served Today</p>
          <p className="text-xl font-bold text-emerald-700 font-mono mt-0.5">{deskServedCount} patients</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-surface-border shadow-card text-center">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Tokens Remaining</p>
          <p className="text-xl font-bold text-primary-700 font-mono mt-0.5">{deskQueue.length} in queue</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-surface-border shadow-card text-center">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Consult Duration</p>
          <p className="text-xl font-bold text-slate-800 font-mono mt-0.5">{currentCounter.avgConsultMin}m / patient</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-surface-border shadow-card text-center">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Consultation Timer</p>
          <p className={`text-xl font-bold font-mono mt-0.5 ${elapsedSeconds > 600 ? 'text-danger-600 animate-pulse' : 'text-slate-900'}`}>
            {formatTimer(elapsedSeconds)}
          </p>
        </div>
      </div>

      {/* ── 3. Main Workstation Area ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Currently Serving Hero Area (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 bg-white border border-surface-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success-500 animate-ping inline-flex" />
                Now Serving at Workstation
              </span>
              {activeToken && (
                <span className="text-2xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Elapsed: {formatTimer(elapsedSeconds)}
                </span>
              )}
            </div>

            {activeToken ? (
              <div className="space-y-5">
                {/* Active Token Hero Box */}
                <div className="bg-surface-soft border border-surface-border rounded-2xl p-6 text-center">
                  <p className="text-2xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Active Patient Token Number
                  </p>
                  <div className="text-5xl sm:text-6xl font-black text-slate-900 font-mono tracking-tight animate-number-pop">
                    {activeToken.id}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <Badge
                      variant={activeToken.category}
                      label={CATEGORY_CONFIG[activeToken.category]?.label || 'General Patient'}
                      showIcon
                      size="md"
                    />
                    <span className="text-2xs font-semibold text-slate-600 bg-white border border-surface-border px-2.5 py-0.5 rounded-full">
                      Waited: {activeToken.waitedMinutes}m
                    </span>
                    {/* Visual indicator if patient waited longer than expected */}
                    {isWaitedLongerThanExpected && (
                      <span className="text-2xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        ⚠️ Waited longer than average
                      </span>
                    )}
                  </div>
                </div>

                {/* Patient Information Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-surface-border">
                  <div>
                    <span className="text-slate-400 block font-medium">Patient Name</span>
                    <span className="font-bold text-slate-900 text-sm">{activeToken.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Department / Desk</span>
                    <span className="font-semibold text-slate-800">{activeToken.service}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Check-in Time</span>
                    <span className="font-mono font-semibold text-slate-700">{activeToken.checkedInAt}</span>
                  </div>
                </div>

                {/* Staff Consultation Notes */}
                <div>
                  <label htmlFor="counter-notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Consultation Remarks / Notes (Optional)
                  </label>
                  <textarea
                    id="counter-notes"
                    rows={2}
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="Enter diagnostic summary, pharmacy prescription, or follow-up notes..."
                    className="input-field text-xs resize-none"
                  />
                </div>

                {/* ── Action Hierarchy ─────────────────────────────────────── */}
                <div className="pt-2 space-y-3">
                  {/* Primary & Important Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleCallNext}
                      className="shadow-sm font-bold"
                    >
                      Call Next Patient →
                    </Button>
                    <Button
                      variant="success"
                      size="lg"
                      fullWidth
                      onClick={handleComplete}
                      className="shadow-sm font-bold"
                    >
                      ✓ Mark Complete
                    </Button>
                  </div>

                  {/* Secondary Actions (Recall, No-Show, Transfer) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRecall}
                      title="Broadcast audio chime recall"
                      className="border border-surface-border bg-slate-50 text-slate-700 hover:bg-slate-100"
                    >
                      🔔 Recall Chime
                    </Button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleNoShow}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:text-danger-600 hover:border-danger-300 hover:bg-danger-50 text-xs font-semibold transition"
                      >
                        No Show
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransferModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50 text-xs font-semibold transition"
                      >
                        Transfer Desk →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">No Patient Currently Active</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click "Call Next Patient" to advance the waiting queue and begin the next consultation.
                  </p>
                </div>
                <Button variant="primary" size="lg" onClick={handleCallNext}>
                  Call Next Patient →
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Waiting Queue for this Counter (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* ── 4. Smart Priority Alert ───────────────────────────────────── */}
          {isNextPatientPriority && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-2.5 shadow-2xs animate-scale-in">
              <span className="text-base">⚡</span>
              <div className="text-xs text-amber-950">
                <span className="font-bold">Priority Patient Next in Queue: </span>
                {deskQueue[0].name} ({CATEGORY_CONFIG[deskQueue[0].category]?.label || 'Priority'}) is next in line at position #1.
              </div>
            </div>
          )}

          {/* ── 5. Queue List ─────────────────────────────────────────────── */}
          <Card className="p-5 bg-white border border-surface-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Upcoming Queue ({deskQueue.length})
              </h3>
              <span className="text-2xs font-mono text-slate-400">Assigned Department</span>
            </div>

            {deskQueue.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                No upcoming patients in queue for this desk.
              </div>
            ) : (
              <div className="divide-y divide-surface-border max-h-[440px] overflow-y-auto pr-1">
                {deskQueue.map((tok, idx) => {
                  const isPriority = tok.category !== 'normal'
                  const statusText = idx === 0 ? 'Next Up' : 'Waiting'
                  return (
                    <div
                      key={tok.id}
                      className={[
                        'py-3 flex items-center justify-between gap-3 transition-colors',
                        isPriority ? 'bg-amber-50/40 px-2 rounded-lg' : '',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono font-semibold text-slate-400 shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold font-mono text-slate-900">
                              {tok.id}
                            </span>
                            <Badge
                              variant={tok.category}
                              label={CATEGORY_CONFIG[tok.category]?.label || 'General'}
                              showIcon
                              size="sm"
                            />
                          </div>
                          <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                            {tok.name}
                          </p>
                          <span className="text-2xs text-slate-400 font-mono block">
                            Est. Call: {getCallTime(tok.waitMin)} · <strong className={idx === 0 ? 'text-amber-800' : 'text-slate-500'}>{statusText}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCallSpecific(tok)}
                          title="Direct Call this token"
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-700 text-2xs font-bold transition border border-surface-border"
                        >
                          Call
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ── Transfer Token Modal ───────────────────────────────────────────── */}
      {transferModalOpen && activeToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-surface-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span>↗️</span> Transfer Token #{activeToken.id}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Select the destination department or counter desk to re-route this patient:
            </p>

            <div className="space-y-3 mb-5">
              {COUNTER_OPTIONS.filter((c) => c.id !== selectedCounterId).map((c) => (
                <label
                  key={c.id}
                  className={[
                    'flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all',
                    transferTarget === c.id
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-surface-border bg-white text-slate-700 hover:border-slate-300',
                  ].join(' ')}
                >
                  <div>
                    <span className="font-bold block">{c.name}</span>
                    <span className="text-2xs text-slate-400">{c.service}</span>
                  </div>
                  <input
                    type="radio"
                    name="transfer-target"
                    value={c.id}
                    checked={transferTarget === c.id}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleTransfer}
              >
                Confirm Transfer
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setTransferModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
