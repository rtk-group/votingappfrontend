import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-cream">
        Loading...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/candidates" replace />
  return children
}

