import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

function NavItem({ to, label, activeClassName = '' }) {
  const location = useLocation()
  const active = location.pathname === to

  return (
    <Link
      to={to}
      className={[
        'px-3 py-2 rounded-xl border transition-all text-sm font-semibold',
        'border-cream/15 hover:border-cream/30 hover:bg-surface/35',
        active ? 'bg-surface/70 border-cream/30 shadow-[0_0_0_1px_rgba(223,208,184,0.08)_inset]' : 'bg-transparent',
        activeClassName,
      ].join(' ')}
    >
      {label}
    </Link>
  )
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen text-cream">
      <header className="sticky top-0 z-40 border-b border-cream/10 bg-primary/55 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-surface/70 border border-cream/15 flex items-center justify-center font-bold shadow-premium">
              <span className="text-accent">V</span>
            </div>
            <div>
              <div className="text-xs tracking-widest uppercase text-cream/70">Premium Voting</div>
              <div className="text-lg font-semibold leading-tight">Secure Elections</div>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <NavItem to="/dashboard" label="Dashboard" />
              <NavItem to="/candidates" label="Candidates" />
              <NavItem to="/results" label="Results" />
              <NavItem to="/profile" label="Profile" />
              {user.role === 'admin' ? <NavItem to="/admin/candidates" label="Admin" /> : null}

              <button
                type="button"
                onClick={onLogout}
                className="ml-1 btn-ghost text-sm px-3 py-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-ghost text-sm px-3 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm px-3 py-2"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">{children}</main>
    </div>
  )
}

