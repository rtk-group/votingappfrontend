import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCandidates, getVoteCount } from '../../api/candidates'
import { useAuth } from '../../auth/useAuth'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data?.error || err.message || 'Request failed'
}

function StatCard({ label, value, hint }) {
  return (
    <div className="card p-5">
      <div className="muted text-sm">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-accent">{value}</div>
      {hint ? <div className="mt-2 text-sm muted">{hint}</div> : null}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [candidateCount, setCandidateCount] = useState(null)
  const [voteRows, setVoteRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const [cands, votes] = await Promise.all([getCandidates(), getVoteCount()])
        setCandidateCount(Array.isArray(cands) ? cands.length : 0)
        setVoteRows(Array.isArray(votes) ? votes : [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const totalVotes = useMemo(
    () => voteRows.reduce((sum, r) => sum + (Number(r.count) || 0), 0),
    [voteRows]
  )

  const topParty = useMemo(() => {
    if (!voteRows.length) return null
    const sorted = [...voteRows].sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0))
    const first = sorted[0]
    return first ? { party: first.party, count: Number(first.count) || 0 } : null
  }, [voteRows])

  return (
    <div className="space-y-6">
      <section className="card-solid overflow-hidden">
        <div className="card-header">
          <div className="badge mb-4">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Dashboard
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold leading-tight">!Hello & Welcome{user?.name ? `, ${user.name}` : ''}</h1>
              <p className="muted text-sm mt-2">
                Role: <span className="font-semibold capitalize text-cream">{user?.role || '—'}</span> · Voting:{' '}
                <span className="font-semibold text-cream">{user?.isvoted ? 'Locked' : 'Open'}</span>
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button type="button" className="btn-primary cursor-pointer" onClick={() => navigate('/candidates')}>
                Go to Candidates
              </button>
              <button type="button" className="btn-ghost cursor-pointer" onClick={() => navigate('/results')}>
                View Results
              </button>
              <button type="button" className="btn-ghost cursor-pointer" onClick={() => navigate('/profile')}>
                Profile
              </button>
              {user?.role === 'admin' ? (
                <button type="button" className="btn-ghost" onClick={() => navigate('/admin/candidates')}>
                  Admin Panel
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="card-body pt-0">
          {error ? <div className="notice-error">{error}</div> : null}

          {loading ? (
            <div className="min-h-[140px] flex items-center justify-center muted">Loading dashboard…</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <StatCard
                label="Candidates"
                value={candidateCount ?? '—'}
                hint="Total candidates available for voting"
              />
              <StatCard label="Total votes" value={totalVotes} hint="Sum of votes across parties" />
              <StatCard
                label="Top party"
                value={topParty?.party ? String(topParty.party).toUpperCase() : '—'}
                hint={topParty ? `${topParty.count} votes` : 'No votes yet'}
              />
            </div>
          )}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Quick insights</h2>
            <p className="muted text-sm mt-1">Top parties by vote share (from `/candidate/vote/count`).</p>
          </div>
          <button type="button" className="btn-ghost" onClick={() => navigate('/results')}>
            Full results
          </button>
        </div>

        {loading ? (
          <div className="min-h-[120px] flex items-center justify-center muted">Loading…</div>
        ) : voteRows.length === 0 ? (
          <div className="min-h-[120px] flex items-center justify-center muted">No vote data yet.</div>
        ) : (
          <div className="mt-5 grid md:grid-cols-2 gap-4">
            {[...voteRows]
              .sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0))
              .slice(0, 4)
              .map((r) => {
                const count = Number(r.count) || 0
                const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0
                return (
                  <div key={r.party} className="rounded-2xl border border-white/15 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="muted text-sm">Party</div>
                        <div className="text-lg font-semibold capitalize">{r.party}</div>
                      </div>
                      <div className="text-right">
                        <div className="muted text-sm">Share</div>
                        <div className="text-lg font-semibold text-accent">{pct.toFixed(2)}%</div>
                      </div>
                    </div>
                    <div className="mt-3 h-3 rounded-full overflow-hidden border border-white/10" style={{ background: 'rgba(34, 40, 49, 0.45)' }}>
                      <div className="h-full" style={{ width: `${Math.min(100, pct)}%`, background: 'var(--accent)' }} />
                    </div>
                    <div className="mt-2 muted text-sm">{count} votes</div>
                  </div>
                )
              })}
          </div>
        )}
      </section>
    </div>
  )
}

