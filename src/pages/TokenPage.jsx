import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { CATEGORY_CONFIG, estimateWait, MOCK_QUEUE_STATUS } from '../mockData'

// Available Service Categories / Counters
const SERVICES = [
  {
    id: 'general',
    name: 'General Service & Inquiries',
    icon: '📋',
    code: 'A',
    description: 'Basic assistance, forms, general queries & guidance',
    counter: 'Counter 1',
  },
  {
    id: 'billing',
    name: 'Billing, Fees & Payments',
    icon: '💳',
    code: 'B',
    description: 'Challan payment, receipt issuance & fee refunds',
    counter: 'Counter 2',
  },
  {
    id: 'documents',
    name: 'Document Verification & Issuance',
    icon: '📑',
    code: 'C',
    description: 'Certificates, identity verification & official stamps',
    counter: 'Counter 3',
  },
  {
    id: 'priority_desk',
    name: 'Express & Priority Assistance',
    icon: '⚡',
    code: 'P',
    description: 'Special expedited service for seniors and disabled citizens',
    counter: 'Priority Desk',
  },
]

// Crisp High-Contrast SVG QR Code Component
function TicketQRCode({ tokenNumber }) {
  return (
    <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 120 120"
        className="w-28 h-28 sm:w-32 sm:h-32 text-slate-900"
        fill="currentColor"
        shapeRendering="crispEdges"
      >
        {/* Outer Frame Top Left */}
        <rect x="10" y="10" width="30" height="30" rx="4" fill="currentColor" />
        <rect x="15" y="15" width="20" height="20" rx="2" fill="#ffffff" />
        <rect x="20" y="20" width="10" height="10" rx="1" fill="currentColor" />

        {/* Outer Frame Top Right */}
        <rect x="80" y="10" width="30" height="30" rx="4" fill="currentColor" />
        <rect x="85" y="15" width="20" height="20" rx="2" fill="#ffffff" />
        <rect x="90" y="20" width="10" height="10" rx="1" fill="currentColor" />

        {/* Outer Frame Bottom Left */}
        <rect x="10" y="80" width="30" height="30" rx="4" fill="currentColor" />
        <rect x="15" y="85" width="20" height="20" rx="2" fill="#ffffff" />
        <rect x="20" y="90" width="10" height="10" rx="1" fill="currentColor" />

        {/* Dynamic Pattern Pixels */}
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
        <rect x="100" y="60" width="8" height="12" fill="currentColor" />

        <rect x="46" y="82" width="10" height="12" fill="currentColor" />
        <rect x="62" y="82" width="18" height="6" fill="currentColor" />
        <rect x="86" y="82" width="8" height="18" fill="currentColor" />
        <rect x="100" y="82" width="8" height="6" fill="currentColor" />

        <rect x="52" y="100" width="22" height="8" fill="currentColor" />
        <rect x="80" y="104" width="12" height="6" fill="currentColor" />
        <rect x="98" y="94" width="10" height="16" fill="currentColor" />
      </svg>
      <span className="text-2xs font-mono font-bold text-slate-500 mt-1.5 uppercase tracking-wider">
        SCAN TO TRACK • {tokenNumber}
      </span>
    </div>
  )
}

export default function TokenPage() {
  // Form State
  const [selectedService, setSelectedService] = useState('general')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState('normal')
  const [receiveSms, setReceiveSms] = useState(true)

  // Validation & UI State
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedTicket, setGeneratedTicket] = useState(null)
  const [printed, setPrinted] = useState(false)

  // Form validation
  const validate = () => {
    const errs = {}
    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.'
    } else if (fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters long.'
    }

    if (!phone.trim()) {
      errs.phone = 'Please enter your mobile phone number.'
    } else if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit phone number.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Handle Token Generation
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Simulate instant token processing
    setTimeout(() => {
      const chosenService = SERVICES.find((s) => s.id === selectedService) || SERVICES[0]
      const randomNum = Math.floor(Math.random() * 80) + 101
      const tokenNumber = `${chosenService.code}-${randomNum}`
      const waitTime = estimateWait(category, MOCK_QUEUE_STATUS.totalInQueue)
      const queuePosition = MOCK_QUEUE_STATUS.totalInQueue + 1

      setGeneratedTicket({
        tokenNumber,
        service: chosenService,
        name: fullName.trim(),
        phone: phone.trim(),
        category,
        waitTime,
        queuePosition,
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        receiveSms,
      })

      setIsSubmitting(false)
    }, 500)
  }

  // Reset form to generate another token
  const handleReset = () => {
    setGeneratedTicket(null)
    setFullName('')
    setPhone('')
    setCategory('normal')
    setErrors({})
    setPrinted(false)
  }

  // Mock Print / Download
  const handlePrint = () => {
    setPrinted(true)
    setTimeout(() => setPrinted(false), 3000)
    window.print()
  }

  return (
    <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* ── View 1: Generated Ticket Receipt ───────────────────────────────── */}
      {generatedTicket ? (
        <div className="max-w-xl mx-auto w-full animate-scale-in">
          {/* Success Banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 text-2xl mb-3 border border-emerald-300 shadow-sm animate-number-pop">
              ✓
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Token Generated Successfully!
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Your token has been added to the queue. Watch the live display boards.
            </p>
          </div>

          {/* Ticket Card Container */}
          <div className="border border-slate-300 rounded-3xl relative overflow-hidden bg-white shadow-card-elevated p-6 sm:p-8">
            {/* Top punch-out notch for ticket realism */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-100 rounded-b-full border-b border-slate-300" />

            {/* Service & Date Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                  {generatedTicket.service.counter}
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {generatedTicket.service.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600 font-medium block">{generatedTicket.date}</span>
                <span className="text-xs font-mono text-slate-500">{generatedTicket.generatedAt}</span>
              </div>
            </div>

            {/* Main Token Display Box + High-Contrast QR Code */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-center mb-6 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="text-center sm:text-left flex-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Your Queue Number
                </span>
                <div className="text-5xl sm:text-6xl font-black tracking-tight text-primary-700 py-1 animate-number-pop">
                  {generatedTicket.tokenNumber}
                </div>

                {/* Priority Category Badge */}
                <div className="mt-3 flex justify-center sm:justify-start">
                  <Badge
                    variant={generatedTicket.category}
                    label={CATEGORY_CONFIG[generatedTicket.category]?.label || 'Standard'}
                    showIcon
                    size="md"
                  />
                </div>
              </div>

              {/* QR Code Container */}
              <TicketQRCode tokenNumber={generatedTicket.tokenNumber} />
            </div>

            {/* Live Queue Estimates Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-slate-50 rounded-xl p-3.5 text-center border border-slate-200">
                <span className="text-2xl block mb-0.5">⏱️</span>
                <span className="text-xs text-slate-500 font-medium block">Est. Wait</span>
                <span className="text-base font-bold text-accent-700">
                  ~{generatedTicket.waitTime} mins
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 text-center border border-slate-200">
                <span className="text-2xl block mb-0.5">👥</span>
                <span className="text-xs text-slate-500 font-medium block">Position</span>
                <span className="text-base font-bold text-slate-900">
                  #{generatedTicket.queuePosition} in line
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 text-center border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-2xl block mb-0.5">📢</span>
                <span className="text-xs text-slate-500 font-medium block">Now Serving</span>
                <span className="text-base font-bold text-emerald-700">
                  Token #{MOCK_QUEUE_STATUS.nowServing}
                </span>
              </div>
            </div>

            {/* Customer Details Summary */}
            <div className="bg-slate-50/80 rounded-xl p-4 text-xs space-y-2 text-slate-700 border border-slate-200 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Visitor Name:</span>
                <span className="font-semibold text-slate-900">{generatedTicket.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-mono font-medium text-slate-900">{generatedTicket.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SMS Notification:</span>
                <span className="text-emerald-700 font-semibold">
                  {generatedTicket.receiveSms ? '✓ Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Print feedback toast */}
            {printed && (
              <div className="mb-4 text-center py-2 px-3 bg-primary-50 border border-primary-200 text-primary-800 rounded-lg text-xs font-semibold animate-fade-in">
                Printing ticket receipt...
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/queue" className="flex-1">
                <Button variant="primary" size="md" fullWidth>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  Track Live Queue
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="md"
                onClick={handlePrint}
                className="sm:w-auto"
                title="Print or Save PDF"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={handleReset}
                className="sm:w-auto"
              >
                Book Another
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ── View 2: Token Booking Input Form ──────────────────────────────── */
        <div className="animate-fade-in">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-widest bg-primary-50 border border-primary-200 px-3 py-1 rounded-full">
              Digital Queue Kiosk
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Get Your Digital Token
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Select your required service, enter your details, and track your position in real time without standing in physical queues.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Service Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                1. Select Service Category <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map((srv) => {
                  const isSelected = selectedService === srv.id
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={[
                        'cursor-pointer rounded-2xl p-4.5 border-2 transition-all duration-200 flex items-start gap-3.5',
                        isSelected
                          ? 'bg-primary-50/60 border-primary-600 shadow-sm ring-1 ring-primary-600/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs',
                      ].join(' ')}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                        {srv.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm truncate">
                            {srv.name}
                          </h3>
                          <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-primary-700 border border-slate-200 shrink-0">
                            {srv.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. Customer Personal Details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
                2. Visitor Information &amp; Priority
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="token-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="token-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className={[
                      'input-field',
                      errors.fullName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '',
                    ].join(' ')}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 font-medium mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label htmlFor="token-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="token-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className={[
                      'input-field font-mono',
                      errors.phone ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '',
                    ].join(' ')}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-600 font-medium mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Priority Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Special Category / Priority Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                    const isSelected = category === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key)}
                        className={[
                          'flex items-center gap-2 p-3 rounded-xl border-2 text-xs font-semibold transition-all text-left',
                          isSelected
                            ? 'bg-primary-50 border-primary-600 text-primary-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <span className="text-lg" aria-hidden="true">{cfg.icon}</span>
                        <span className="truncate">{cfg.label}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-2xs text-slate-500 mt-2 font-medium">
                  Priority categories will be scheduled with equitable fairness to reduce waiting times for vulnerable visitors.
                </p>
              </div>

              {/* SMS Notification Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={receiveSms}
                    onChange={(e) => setReceiveSms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Send me free SMS alerts when my turn is 5 minutes away.
                  </span>
                </label>
              </div>
            </div>

            {/* Form Submit CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link to="/" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                ← Back to Home
              </Link>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full sm:w-auto sm:min-w-[220px]"
              >
                Generate Token Now →
              </Button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
