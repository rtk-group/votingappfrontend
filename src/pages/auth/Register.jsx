import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../../api/user'
import { useAuth } from '../../auth/useAuth'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data?.error || err.message || 'Signup failed'
}

export default function Register() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    aadharcardnumber: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await signup({
        name: form.name,
        age: Number(form.age),
        email: form.email || undefined,
        mobile: form.mobile || undefined,
        address: form.address,
        aadharcardnumber: Number(form.aadharcardnumber),
        password: form.password,
      })
      if (!data?.token) {
        throw new Error('Signup succeeded but no token was returned by backend.')
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
            New Voter
          </div>
          <h1 className="text-3xl font-semibold mb-2">Create Account</h1>
          <p className="muted mb-5">Register once and start voting securely.</p>
        </div>

        <div className="card-body pt-0">
          <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-cream/80">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-cream/80">Age</label>
              <input
                value={form.age}
                onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                type="number"
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-cream/80">Email (optional)</label>
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                type="email"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-cream/80">Mobile (optional)</label>
              <input
                value={form.mobile}
                onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
                type="tel"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-cream/80">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-cream/80">Aadhar Card Number</label>
            <input
              value={form.aadharcardnumber}
              onChange={(e) => setForm((p) => ({ ...p, aadharcardnumber: e.target.value }))}
              type="number"
              inputMode="numeric"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-cream/80">Password</label>
            <input
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
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
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <div className="text-sm text-cream/70">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="text-accent hover:underline font-semibold">
              Login
            </button>
          </div>
          </form>
        </div>
      </section>

      <aside className="hidden lg:block card">
        <div className="card-header">
          <h2 className="text-xl font-semibold mb-2">Premium Experience</h2>
          <p className="muted mb-4">
          Your token is stored in localStorage, and you can update your password anytime.
          </p>
        </div>
        <div className="card-body pt-0 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-[0_0_0_1px_rgba(148,137,121,0.12)_inset]">
              ✓
            </div>
            <div>
              <div className="font-semibold">Secure JWT</div>
              <div className="text-cream/70">Authorization header on every request.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-[0_0_0_1px_rgba(148,137,121,0.12)_inset]">
              ✓
            </div>
            <div>
              <div className="font-semibold">One Vote</div>
              <div className="text-cream/70">Buttons disable after voting.</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

