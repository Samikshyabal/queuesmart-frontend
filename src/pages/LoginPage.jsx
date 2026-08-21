import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()

  // State
  const [roleTab, setRoleTab] = useState('staff') // 'staff' | 'admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Validation & Feedback State
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  // Preset demo accounts
  const demoAccounts = {
    staff: { email: 'staff@citycare.in', password: 'password123' },
    admin: { email: 'admin@citycare.in', password: 'admin123' },
  }

  // Auto-fill demo credentials
  const fillDemoCredentials = (role) => {
    setRoleTab(role)
    setEmail(demoAccounts[role].email)
    setPassword(demoAccounts[role].password)
    setErrors({})
    setAuthError('')
  }

  // Validate inputs
  const validate = () => {
    const errs = {}
    if (!email.trim()) {
      errs.email = 'Email address or Staff ID is required.'
    } else if (!/\S+@\S+\.\S+/.test(email.trim()) && !email.trim().startsWith('STAFF')) {
      errs.email = 'Please enter a valid email format.'
    }

    if (!password) {
      errs.password = 'Password is required.'
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault()
    setAuthError('')
    if (!validate()) return

    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      const targetAccount = demoAccounts[roleTab]
      const isValid =
        (email.trim().toLowerCase() === targetAccount.email && password === targetAccount.password) ||
        (email.trim().toLowerCase() === 'admin@demo.com' && password === 'password123') // fallback match

      if (isValid) {
        if (onLogin) onLogin(roleTab)
        if (roleTab === 'staff') {
          navigate('/counter')
        } else {
          navigate('/admin')
        }
      } else {
        setAuthError(`Invalid credentials for ${roleTab === 'admin' ? 'Administrator' : 'Staff'} role. Use quick demo autofill chips below.`)
        setIsLoading(false)
      }
    }, 450)
  }

  return (
    <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-surface-soft">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-2xl border border-surface-border shadow-card-elevated overflow-hidden animate-fade-in">
        
        {/* ── Left Side: Hospital Staff Portal Overview ─────────────────────── */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-8">
              <div className="w-9 h-9 rounded-lg bg-accent-700 flex items-center justify-center text-white shadow-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg text-white">
                  CityCare <span className="text-accent-400">Hospital</span>
                </span>
                <span className="text-2xs text-slate-400 font-normal">Care that moves with you</span>
              </div>
            </Link>

            <div className="space-y-4">
              <span className="text-2xs font-bold uppercase tracking-widest text-accent-400 bg-accent-950/80 border border-accent-800 px-2 py-0.5 rounded">
                Authorized Personnel
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Hospital Staff &amp; Operations Portal
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sign in to your counter desk to manage OPD queue flow, call patients, update consultation statuses, or access administrative operational metrics.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-emerald-400">🔒</span>
              <span>256-bit encrypted hospital workstation login</span>
            </div>
            <div className="flex items-center justify-between text-2xs text-slate-400">
              <span>CityCare IT Support: Ext. 4040</span>
              <Link to="/" className="text-accent-400 hover:text-accent-300">Public Portal →</Link>
            </div>
          </div>
        </div>

        {/* ── Right Side: Login Form ────────────────────────────────────────── */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Sign in to your workstation</h1>
            <p className="text-xs text-slate-500 mt-1">Select your access role to continue</p>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-surface-border mb-5">
            <button
              type="button"
              onClick={() => {
                setRoleTab('staff')
                setAuthError('')
              }}
              className={[
                'flex-1 py-2 text-xs font-bold rounded-md transition-all duration-150 flex items-center justify-center gap-2',
                roleTab === 'staff'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900',
              ].join(' ')}
            >
              <span>🖥️</span> Counter Staff
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleTab('admin')
                setAuthError('')
              }}
              className={[
                'flex-1 py-2 text-xs font-bold rounded-md transition-all duration-150 flex items-center justify-center gap-2',
                roleTab === 'admin'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900',
              ].join(' ')}
            >
              <span>🛡️</span> Hospital Admin
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-xs flex items-start gap-2 animate-scale-in">
              <span className="text-sm">⚠️</span>
              <span className="leading-relaxed font-medium">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                {roleTab === 'admin' ? 'Administrator Email' : 'Staff Email / Desk ID'} <span className="text-danger-600">*</span>
              </label>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleTab === 'admin' ? 'admin@citycare.in' : 'staff@citycare.in'}
                className={`input-field font-mono text-sm ${errors.email ? 'border-danger-400 focus:border-danger-500' : ''}`}
              />
              {errors.email && (
                <p className="text-2xs text-danger-600 font-medium mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                  Password <span className="text-danger-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-2xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`input-field pr-10 font-mono text-sm ${errors.password ? 'border-danger-400 focus:border-danger-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="text-2xs text-danger-600 font-medium mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs text-slate-600">Remember workstation</span>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Sign In as {roleTab === 'admin' ? 'Administrator' : 'Counter Staff'} →
            </Button>
          </form>

          {/* Quick Demo Autofill Chips */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-2 text-center">
              ⚡ Quick Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('staff')}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-primary-400 hover:bg-primary-50/40 text-left transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Counter Staff</span>
                  <span className="text-2xs bg-primary-100 text-primary-800 font-bold px-1.5 py-0.2 rounded">Auto</span>
                </div>
                <span className="text-2xs font-mono text-slate-500 block mt-0.5">staff@citycare.in</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-accent-400 hover:bg-accent-50/40 text-left transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Administrator</span>
                  <span className="text-2xs bg-accent-100 text-accent-800 font-bold px-1.5 py-0.2 rounded">Auto</span>
                </div>
                <span className="text-2xs font-mono text-slate-500 block mt-0.5">admin@citycare.in</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Mock Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-surface-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span>🔐</span> Password Recovery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              For demo testing, please use the pre-configured accounts:
              <br />
              <strong className="text-slate-900 block mt-2 font-mono bg-slate-50 p-1.5 rounded border border-slate-200">• staff@citycare.in / password123</strong>
              <strong className="text-slate-900 block mt-1.5 font-mono bg-slate-50 p-1.5 rounded border border-slate-200">• admin@citycare.in / admin123</strong>
            </p>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => setShowForgotModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
