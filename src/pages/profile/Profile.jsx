import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { updatePassword } from '../../api/user'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data?.error || err.message || 'Request failed'
}

export default function Profile() {
  const { user, refreshProfile } = useAuth()

  const [currentpassword, setCurrentpassword] = useState('')
  const [newpassword, setNewpassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await updatePassword({ currentpassword, newpassword })
      setSuccess('Password updated successfully.')
      setCurrentpassword('')
      setNewpassword('')
      await refreshProfile()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="card-solid">
        <div className="card-header">
          <div className="badge mb-4">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Account
          </div>
          <h1 className="text-3xl font-semibold mb-4">Profile</h1>
        </div>

        <div className="card-body pt-0">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-cream/15 bg-primary/20 p-4">
            <div className="muted">Name</div>
            <div className="font-semibold">{user.name}</div>
          </div>
          <div className="rounded-xl border border-cream/15 bg-primary/20 p-4">
            <div className="muted">Age</div>
            <div className="font-semibold">{user.age}</div>
          </div>

          <div className="rounded-xl border border-cream/15 bg-primary/20 p-4">
            <div className="muted">Email</div>
            <div className="font-semibold">{user.email || '—'}</div>
          </div>
          <div className="rounded-xl border border-cream/15 bg-primary/20 p-4">
            <div className="muted">Mobile</div>
            <div className="font-semibold">{user.mobile || '—'}</div>
          </div>

          <div className="rounded-xl border border-cream/15 bg-primary/20 p-4 sm:col-span-2">
            <div className="muted">Address</div>
            <div className="font-semibold">{user.address}</div>
          </div>

          <div className="rounded-xl border border-cream/15 bg-primary/20 p-4">
            <div className="muted">Aadhar</div>
            <div className="font-semibold">{user.aadharcardnumber}</div>
          </div>
          <div className="rounded-xl border border-cream/15 bg-primary/20 p-4">
            <div className="muted">Role</div>
            <div className="font-semibold capitalize">{user.role}</div>
          </div>

          <div className="rounded-xl border border-cream/15 bg-primary/20 p-4 sm:col-span-2">
            <div className="muted">Voting Status</div>
            <div className="font-semibold">
              {user.isvoted ? 'Voted (locked)' : 'Not voted yet'}
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="card-solid">
        <div className="card-header">
          <h2 className="text-2xl font-semibold mb-2">Update Password</h2>
          <p className="muted text-sm mb-2">
          Keep your account secure. Your password is updated using the backend route.
          </p>
        </div>

        <div className="card-body pt-0">
          <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-cream/80">Current Password</label>
            <input
              value={currentpassword}
              onChange={(e) => setCurrentpassword(e.target.value)}
              type="password"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-cream/80">New Password</label>
            <input
              value={newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
              type="password"
              className="input"
              required
            />
          </div>

          {error ? (
            <div className="notice-error">{error}</div>
          ) : null}
          {success ? (
            <div className="notice-success">{success}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          </form>
        </div>
      </section>
    </div>
  )
}

