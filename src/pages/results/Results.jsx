import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVoteCount } from '../../api/candidates'
import { useAuth } from '../../auth/useAuth'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data?.error || err.message || 'Request failed'
}

export default function Results() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getVoteCount()
        setRows(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const total = useMemo(() => rows.reduce((sum, r) => sum + (Number(r.count) || 0), 0), [rows])

  return (
    <div className="space-y-6">
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Results</h1>
          <p className="muted text-sm mt-1">
            Live percentages from backend vote counts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/candidates')}
          className="btn-ghost"
        >
          Back to Candidates
        </button>
      </div>

      {error ? (
        <div className="notice-error">{error}</div>
      ) : null}

      {loading ? (
        <div className="min-h-[240px] card p-6 flex items-center justify-center">
          Loading...
        </div>
      ) : rows.length === 0 ? (
        <div className="min-h-[240px] card p-6 flex items-center justify-center">
          No results available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {rows.map((r) => {
            const count = Number(r.count) || 0
            const pct = total > 0 ? (count / total) * 100 : 0

            return (
              <div key={r.party} className="card p-5 transition-transform hover:-translate-y-[1px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm muted">Party</div>
                    <div className="text-xl font-semibold capitalize">{r.party}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm muted">Votes</div>
                    <div className="text-2xl font-semibold text-accent">{count}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm muted">
                    <span>{pct.toFixed(2)}%</span>
                    <span>{total > 0 ? `${count}/${total}` : '0/0'}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-primary/45 border border-cream/10 overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                {user?.role === 'admin' ? (
                  <div className="mt-4 text-xs text-cream/60">
                    Admin view: voting allowed is disabled by backend.
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

