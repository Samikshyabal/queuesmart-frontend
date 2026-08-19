import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
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
    }, 600)
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success-500/20 text-success-400 text-2xl mb-3 border border-success-500/30 animate-number-pop">
              ✓
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Token Generated Successfully!
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Your turn will be called on the live display board.
            </p>
          </div>

          {/* Ticket Card Container */}
          <Card className="border-2 border-primary-500/40 relative overflow-hidden bg-dark-800 shadow-2xl p-6 sm:p-8">
            {/* Top punch-out notch for ticket feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-dark-900 rounded-b-full border-b border-surface-border" />

            {/* Service & Date Header */}
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
              <div>
                <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  {generatedTicket.service.counter}
                </span>
                <h2 className="text-base font-bold text-white">
                  {generatedTicket.service.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">{generatedTicket.date}</span>
                <span className="text-xs font-mono text-gray-400">{generatedTicket.generatedAt}</span>
              </div>
            </div>

            {/* Main Token Display Box */}
            <div className="bg-dark-900/90 border border-surface-border rounded-2xl p-6 text-center mb-6 relative">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1">
                Your Token Number
              </span>
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-white gradient-text py-1 animate-number-pop">
                {generatedTicket.tokenNumber}
              </div>

              {/* Priority Category Badge */}
              <div className="mt-3 flex justify-center">
                <Badge
                  variant={generatedTicket.category}
                  label={CATEGORY_CONFIG[generatedTicket.category]?.label || 'Standard'}
                  showIcon
                  size="md"
                />
              </div>
            </div>

            {/* Live Queue Estimates Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-dark-700/60 rounded-xl p-3 text-center border border-surface-border">
                <span className="text-2xl block mb-0.5">⏱️</span>
                <span className="text-xs text-gray-400 block">Est. Wait</span>
                <span className="text-base font-bold text-accent-400">
                  ~{generatedTicket.waitTime} mins
                </span>
              </div>

              <div className="bg-dark-700/60 rounded-xl p-3 text-center border border-surface-border">
                <span className="text-2xl block mb-0.5">👥</span>
                <span className="text-xs text-gray-400 block">Position</span>
                <span className="text-base font-bold text-white">
                  #{generatedTicket.queuePosition} in line
                </span>
              </div>

              <div className="bg-dark-700/60 rounded-xl p-3 text-center border border-surface-border col-span-2 sm:col-span-1">
                <span className="text-2xl block mb-0.5">📢</span>
                <span className="text-xs text-gray-400 block">Now Serving</span>
                <span className="text-base font-bold text-success-400">
                  Token #{MOCK_QUEUE_STATUS.nowServing}
                </span>
              </div>
            </div>

            {/* Customer Details Summary */}
            <div className="bg-dark-900/50 rounded-xl p-4 text-xs space-y-1.5 text-gray-300 border border-surface-border/60 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Visitor Name:</span>
                <span className="font-medium text-white">{generatedTicket.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mobile Number:</span>
                <span className="font-mono text-white">{generatedTicket.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SMS Notification:</span>
                <span className="text-success-400 font-medium">
                  {generatedTicket.receiveSms ? '✓ Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Print feedback toast */}
            {printed && (
              <div className="mb-4 text-center py-2 px-3 bg-primary-500/20 border border-primary-500/30 text-primary-300 rounded-lg text-xs animate-fade-in">
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
                className="sm:w-auto text-gray-400"
              >
                Book Another
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* ── View 2: Token Booking Input Form ──────────────────────────────── */
        <div className="animate-fade-in">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-accent-400 uppercase tracking-widest">
              Digital Queue Desk
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Get Your Digital Token
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-2">
              Select your required service, fill your details, and track your queue in real time without standing in line.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Service Selection */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                1. Select Service Category <span className="text-danger-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SERVICES.map((srv) => {
                  const isSelected = selectedService === srv.id
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={[
                        'cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-start gap-3.5',
                        isSelected
                          ? 'bg-primary-600/15 border-primary-500 shadow-glow-primary'
                          : 'bg-dark-800/80 border-surface-border hover:border-gray-600 hover:bg-dark-800',
                      ].join(' ')}
                    >
                      <div className="w-10 h-10 rounded-xl bg-dark-700 border border-surface-border flex items-center justify-center text-xl shrink-0">
                        {srv.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-white text-sm truncate">
                            {srv.name}
                          </h3>
                          <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-dark-700 text-primary-300 border border-surface-border shrink-0">
                            {srv.code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. Customer Personal Details */}
            <div className="glass-card p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-bold text-white border-b border-surface-border pb-3">
                2. Visitor Information &amp; Priority
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="token-name" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Full Name <span className="text-danger-400">*</span>
                  </label>
                  <input
                    id="token-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className={[
                      'input-field',
                      errors.fullName ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : '',
                    ].join(' ')}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-danger-400 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label htmlFor="token-phone" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Mobile Phone Number <span className="text-danger-400">*</span>
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
                      errors.phone ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : '',
                    ].join(' ')}
                  />
                  {errors.phone && (
                    <p className="text-xs text-danger-400 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Priority Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Special Category / Priority Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                    const isSelected = category === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key)}
                        className={[
                          'flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all text-left',
                          isSelected
                            ? 'bg-primary-600/20 border-primary-500 text-white shadow'
                            : 'bg-dark-700/60 border-surface-border text-gray-300 hover:border-gray-500',
                        ].join(' ')}
                      >
                        <span className="text-lg" aria-hidden="true">{cfg.icon}</span>
                        <span className="truncate">{cfg.label}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-2xs text-gray-500 mt-2">
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
                    className="w-4 h-4 rounded bg-dark-700 border-surface-border text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-900"
                  />
                  <span className="text-xs text-gray-300">
                    Send me free SMS alerts when my turn is 5 minutes away.
                  </span>
                </label>
              </div>
            </div>

            {/* Form Submit CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link to="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
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
