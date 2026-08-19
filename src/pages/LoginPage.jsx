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
        // Route staff to counter, admin to dashboard
        if (roleTab === 'staff') {
          navigate('/counter')
        } else {
          navigate('/admin')
        }
      } else {
        setAuthError(`Invalid credentials for ${roleTab === 'admin' ? 'Administrator' : 'Staff'} role. Use quick demo autofill below.`)
        setIsLoading(false)
      }
    }, 600)
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark-900 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        {/* ── Brand Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-black text-base shadow-glow-primary group-hover:scale-105 transition-transform">
              QS
            </div>
            <span className="font-bold text-xl text-white">
              Queue<span className="gradient-text">Smart</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">
            Staff Portal Login
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Access queue management tools and live desk counters
          </p>
        </div>

        {/* ── Role Selector Tabs ────────────────────────────────────────────── */}
        <div className="flex bg-dark-800 p-1 rounded-2xl border border-surface-border mb-6">
          <button
            type="button"
            onClick={() => {
              setRoleTab('staff')
              setAuthError('')
            }}
            className={[
              'flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2',
              roleTab === 'staff'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5',
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
              'flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2',
              roleTab === 'admin'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5',
            ].join(' ')}
          >
            <span>🛡️</span> System Admin
          </button>
        </div>

        {/* ── Main Login Card ──────────────────────────────────────────────── */}
        <Card className="p-6 sm:p-8 bg-dark-800/90 border border-surface-border shadow-2xl">
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-danger-500/15 border border-danger-500/30 text-danger-300 text-xs flex items-start gap-2.5 animate-scale-in">
              <span className="text-sm">⚠️</span>
              <span className="leading-relaxed">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-gray-300 mb-1.5">
                {roleTab === 'admin' ? 'Admin Email / ID' : 'Staff Email / Desk ID'} <span className="text-danger-400">*</span>
              </label>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleTab === 'admin' ? 'admin@demo.com' : 'staff@demo.com'}
                className={[
                  'input-field font-mono text-sm',
                  errors.email ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : '',
                ].join(' ')}
              />
              {errors.email && (
                <p className="text-2xs text-danger-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-gray-300">
                  Password <span className="text-danger-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-2xs text-primary-400 hover:text-primary-300 transition"
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
                    errors.password ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : '',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="text-2xs text-danger-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-dark-700 border-surface-border text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-900"
                />
                <span className="text-xs text-gray-400">Remember on this terminal</span>
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
                className="text-sm font-semibold"
              >
                Sign In as {roleTab === 'admin' ? 'Administrator' : 'Counter Staff'} →
              </Button>
            </div>
          </form>

          {/* ── Quick Autofill Demo Credentials ────────────────────────────── */}
          <div className="mt-6 pt-5 border-t border-surface-border/80">
            <span className="text-2xs uppercase tracking-wider text-gray-400 font-bold block mb-2.5 text-center">
              ⚡ Quick Demo Login Chips
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('staff')}
                className="p-2.5 rounded-xl bg-dark-700/80 border border-surface-border hover:border-primary-500/50 hover:bg-dark-700 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-primary-300">Staff Desk</span>
                  <span className="text-2xs bg-primary-500/20 text-primary-300 px-1.5 py-0.5 rounded">Fill</span>
                </div>
                <span className="text-2xs font-mono text-gray-400 block mt-0.5">staff@demo.com</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="p-2.5 rounded-xl bg-dark-700/80 border border-surface-border hover:border-accent-500/50 hover:bg-dark-700 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-accent-300">Admin Org</span>
                  <span className="text-2xs bg-accent-500/20 text-accent-300 px-1.5 py-0.5 rounded">Fill</span>
                </div>
                <span className="text-2xs font-mono text-gray-400 block mt-0.5">admin@demo.com</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-gray-400 hover:text-white transition">
            ← Back to Public Home
          </Link>
        </div>
      </div>

      {/* ── Forgot Password Mock Modal ─────────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-800 border border-surface-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span>🔐</span> Password Recovery
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              For demo security, please use the pre-configured accounts:
              <br />
              <strong className="text-white block mt-2 font-mono">• staff@demo.com / password123</strong>
              <strong className="text-white block font-mono">• admin@demo.com / admin123</strong>
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
