import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import LandingPage from './pages/LandingPage'
import TokenPage from './pages/TokenPage'
import QueueDisplayPage from './pages/QueueDisplayPage'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import CounterPage from './pages/CounterPage'

// ── Simple protected route ────────────────────────────────────────────────────
// Redirects to /login if not logged in. No context needed — just a prop.
function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

// ── App root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin  = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  return (
    <BrowserRouter>
      {/* Outer shell — full height flex column so Navbar is always at the top */}
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">

        {/* Navbar appears on every page */}
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* Page content fills remaining space */}
        <div className="flex-1 flex flex-col">
          <Routes>
            {/* Public pages */}
            <Route path="/"      element={<LandingPage />} />
            <Route path="/token" element={<TokenPage />} />
            <Route path="/queue" element={<QueueDisplayPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

            {/* Protected pages — redirect to /login if not authenticated */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counter"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <CounterPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
                  <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-card max-w-md w-full">
                    <div className="text-7xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                      404
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h1>
                    <p className="text-slate-500 mb-6 text-sm">The page you're looking for doesn't exist or has been moved.</p>
                    <a href="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition shadow-sm">
                      Go to Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}
