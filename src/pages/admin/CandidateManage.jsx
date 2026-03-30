import { useEffect, useState } from 'react'
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '../../api/candidates'
import { useAuth } from '../../auth/useAuth'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data?.error || err.message || 'Request failed'
}

export default function CandidateManage() {
  const { refreshProfile } = useAuth()

  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', party: '', age: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const data = await getCandidates()
      setCandidates(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const payload = {
        name: form.name,
        party: form.party,
        age: Number(form.age),
      }

      if (editingId) {
        await updateCandidate(editingId, payload)
        setMessage('Candidate updated successfully.')
      } else {
        await createCandidate(payload)
        setMessage('Candidate added successfully.')
      }

      setEditingId(null)
      setForm({ name: '', party: '', age: '' })
      await load()

      // Not required for admin candidate changes, but keeps UI consistent.
      await refreshProfile().catch(() => {})
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const onEdit = (candidate) => {
    setEditingId(candidate._id || candidate.id)
    setForm({
      name: candidate.name || '',
      party: candidate.party || '',
      age: candidate.age ?? '',
    })
    setMessage(null)
    setError(null)
  }

  const onDelete = async (candidate) => {
    const id = candidate._id || candidate.id
    if (!window.confirm('Delete this candidate?')) return

    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      await deleteCandidate(id)
      setMessage('Candidate deleted.')
      if (editingId === id) {
        setEditingId(null)
        setForm({ name: '', party: '', age: '' })
      }
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h1 className="text-3xl font-semibold">Admin: Candidate Management</h1>
        <p className="muted text-sm mt-1">
          Add, update, and delete candidates. Vote counts are shown read-only.
        </p>
      </div>

      <section className="card-solid">
        <div className="card-header">
          <h2 className="text-2xl font-semibold mb-2">{editingId ? 'Edit Candidate' : 'Add Candidate'}</h2>
          <p className="muted text-sm">Only admins can access these routes in the backend.</p>
        </div>

        <div className="card-body pt-0">
          <form onSubmit={onSubmit} className="grid sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm mb-1 text-cream/80">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-cream/80">Party</label>
            <input
              value={form.party}
              onChange={(e) => setForm((p) => ({ ...p, party: e.target.value }))}
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

          <div className="sm:col-span-3 flex gap-2 flex-wrap">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-5 py-3"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditingId(null)
                  setForm({ name: '', party: '', age: '' })
                  setError(null)
                  setMessage(null)
                }}
                className="btn-ghost px-5 py-3"
              >
                Cancel
              </button>
            ) : null}
          </div>
          </form>

          {error ? <div className="mt-4 notice-error">{error}</div> : null}
          {message ? <div className="mt-4 notice-success">{message}</div> : null}
        </div>
      </section>

      <section className="card p-5">
        <h3 className="text-xl font-semibold mb-4">Candidate List</h3>
        {loading ? (
          <div className="min-h-[160px] flex items-center justify-center text-sm muted">Loading...</div>
        ) : candidates.length === 0 ? (
          <div className="min-h-[160px] flex items-center justify-center text-sm muted">
            No candidates yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {candidates.map((c) => {
              const id = c._id || c.id
              return (
                <div key={id} className="rounded-2xl border border-cream/15 bg-surface/40 p-4 transition-transform hover:-translate-y-[1px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-lg">{c.name}</div>
                      <div className="text-sm muted mt-1">Party: {c.party}</div>
                      <div className="text-sm muted mt-1">Age: {c.age}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm muted">Votes</div>
                      <div className="text-2xl font-semibold text-accent">{c.votecount ?? 0}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onEdit(c)}
                      disabled={saving}
                      className="btn-ghost text-sm px-3 py-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(c)}
                      disabled={saving}
                      className="btn-danger text-sm px-3 py-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

