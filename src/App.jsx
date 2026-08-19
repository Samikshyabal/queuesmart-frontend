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
  // Simple login state — no context, no backend.
  // handleLogin / handleLogout will be passed as props to the Login page + Navbar.
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin  = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  return (
    <BrowserRouter>
      {/* Outer shell — full height flex column so Navbar is always at the top */}
      <div className="min-h-screen flex flex-col bg-dark-900">

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
                  <div className="text-center">
                    <div className="text-8xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
                      404
                    </div>
                    <h1 className="text-xl font-semibold text-white mb-2">Page Not Found</h1>
                    <p className="text-gray-400 mb-6 text-sm">The page you're looking for doesn't exist.</p>
                    <a href="/" className="text-primary-400 hover:text-primary-300 text-sm underline underline-offset-2">
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
