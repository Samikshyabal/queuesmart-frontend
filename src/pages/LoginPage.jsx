import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
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
    staff: { email: 'staff@demo.com', password: 'password123' },
    admin: { email: 'admin@demo.com', password: 'admin123' },
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
    }, 500)
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Subtle background ambient circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        {/* ── Brand Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
              QS
            </div>
            <span className="font-bold text-xl text-slate-900">
              Queue<span className="text-primary-600">Smart</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Staff Portal Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Access queue management controls and service counter desks
          </p>
        </div>

        {/* ── Role Selector Tabs ────────────────────────────────────────────── */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setRoleTab('staff')
              setAuthError('')
            }}
            className={[
              'flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2',
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
              'flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2',
              roleTab === 'admin'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
          >
            <span>🛡️</span> System Admin
          </button>
        </div>

        {/* ── Main Login Card ──────────────────────────────────────────────── */}
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-card-elevated">
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-scale-in">
              <span className="text-sm">⚠️</span>
              <span className="leading-relaxed font-medium">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                {roleTab === 'admin' ? 'Admin Email / ID' : 'Staff Email / Desk ID'} <span className="text-rose-600">*</span>
              </label>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleTab === 'admin' ? 'admin@demo.com' : 'staff@demo.com'}
                className={[
                  'input-field font-mono text-sm',
                  errors.email ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '',
                ].join(' ')}
              />
              {errors.email && (
                <p className="text-2xs text-rose-600 font-medium mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                  Password <span className="text-rose-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-2xs font-semibold text-primary-600 hover:text-primary-700 transition"
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
                  className={[
                    'input-field pr-10 font-mono text-sm',
                    errors.password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '',
                  ].join(' ')}
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
                <p className="text-2xs text-rose-600 font-medium mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs text-slate-600 font-medium">Remember on this terminal</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                className="text-sm font-bold shadow-md"
              >
                Sign In as {roleTab === 'admin' ? 'Administrator' : 'Counter Staff'} →
              </Button>
            </div>
          </form>

          {/* ── Quick Autofill Demo Credentials ────────────────────────────── */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-2xs uppercase tracking-wider text-slate-500 font-bold block mb-2.5 text-center">
              ⚡ Quick Demo Login Chips
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemoCredentials('staff')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-primary-400 hover:bg-primary-50/50 text-left transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary-700">Staff Desk</span>
                  <span className="text-2xs bg-primary-100 text-primary-800 font-bold px-1.5 py-0.5 rounded">Fill</span>
                </div>
                <span className="text-2xs font-mono text-slate-500 block mt-0.5">staff@demo.com</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-accent-400 hover:bg-accent-50/50 text-left transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-accent-800">Admin Org</span>
                  <span className="text-2xs bg-accent-100 text-accent-800 font-bold px-1.5 py-0.5 rounded">Fill</span>
                </div>
                <span className="text-2xs font-mono text-slate-500 block mt-0.5">admin@demo.com</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
            ← Back to Public Home
          </Link>
        </div>
      </div>

      {/* ── Forgot Password Mock Modal ─────────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span>🔐</span> Password Recovery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              For demo testing, please use the pre-configured accounts:
              <br />
              <strong className="text-slate-900 block mt-2 font-mono bg-slate-50 p-1.5 rounded border border-slate-200">• staff@demo.com / password123</strong>
              <strong className="text-slate-900 block mt-1.5 font-mono bg-slate-50 p-1.5 rounded border border-slate-200">• admin@demo.com / admin123</strong>
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
