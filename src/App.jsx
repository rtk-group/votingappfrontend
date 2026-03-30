import { useMemo } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { AuthProvider } from './auth/AuthProvider'
import { useAuth } from './auth/useAuth'
import RequireAuth from './auth/RequireAuth'
import RequireAdmin from './auth/RequireAdmin'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Profile from './pages/profile/Profile'
import Candidates from './pages/candidates/Candidates'
import Results from './pages/results/Results'
import CandidateManage from './pages/admin/CandidateManage'

function HomeRedirect() {
  const { user, loading } = useAuth()
  const target = useMemo(() => (user ? '/dashboard' : '/login'), [user])

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-cream">Loading...</div>
  }
  return <Navigate to={target} replace />
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/candidates"
          element={
            <RequireAuth>
              <Candidates />
            </RequireAuth>
          }
        />
        <Route
          path="/results"
          element={
            <RequireAuth>
              <Results />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <RequireAdmin>
              <CandidateManage />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell>
          <AnimatedRoutes />
        </AppShell>
      </BrowserRouter>
    </AuthProvider>
  )
}
