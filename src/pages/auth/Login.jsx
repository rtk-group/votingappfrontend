import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/user'
import { useAuth } from '../../auth/useAuth'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data?.error || err.message || 'Login failed'
}

export default function Login() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  const [aadharcardnumber, setAadharcardnumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await login({
        aadharcardnumber: Number(aadharcardnumber),
        password,
      })
      if (!data?.token) {
        throw new Error('Login succeeded but backend did not return token.')
      }
      await loginWithToken(data.token)
      navigate('/candidates', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-stretch">
      <section className="card-solid">
        <div className="card-header">
          <div className="badge mb-4">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Secure Access
          </div>
          <h1 className="text-3xl font-semibold mb-2">Login</h1>
          <p className="muted mb-5">Access your secure voting account.</p>
        </div>

        <div className="card-body pt-0">
          <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-cream/80">Aadhar Card Number</label>
            <input
              value={aadharcardnumber}
              onChange={(e) => setAadharcardnumber(e.target.value)}
              type="number"
              inputMode="numeric"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-cream/80">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input"
              required
            />
          </div>

          {error ? (
            <div className="notice-error">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-sm text-cream/70">
            No account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-accent hover:underline font-semibold"
            >
              Register
            </button>
          </div>
          </form>
        </div>
      </section>

      <aside className="hidden lg:block card">
        <div className="card-header">
          <h2 className="text-xl font-semibold mb-2">Premium Security</h2>
          <p className="muted mb-4">
          Vote once, view results in percentages, and keep your account safe with password updates.
          </p>
        </div>
        <div className="card-body pt-0 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-[0_0_0_1px_rgba(148,137,121,0.12)_inset]">
              1
            </div>
            <div>
              <div className="font-semibold">Secure Login</div>
              <div className="text-cream/70">JWT token stored in localStorage.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-[0_0_0_1px_rgba(148,137,121,0.12)_inset]">
              2
            </div>
            <div>
              <div className="font-semibold">One Vote Only</div>
              <div className="text-cream/70">Button disables after voting.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-[0_0_0_1px_rgba(148,137,121,0.12)_inset]">
              3
            </div>
            <div>
              <div className="font-semibold">Results First</div>
              <div className="text-cream/70">Percentages update from backend.</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

