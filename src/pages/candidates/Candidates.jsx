import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCandidates, voteCandidate } from '../../api/candidates'
import { useAuth } from '../../auth/useAuth'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.response?.data?.error || err.message || 'Request failed'
}

export default function Candidates() {
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()

  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [votingId, setVotingId] = useState(null)
  const [voteMessage, setVoteMessage] = useState(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getCandidates()
        setCandidates(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const hasVoted = Boolean(user?.isvoted)
  const isAdmin = user?.role === 'admin'

  const canVote = useMemo(() => !hasVoted && !isAdmin, [hasVoted, isAdmin])

  const onVote = async (candidateid) => {
    setVoteMessage(null)
    setVotingId(candidateid)
    try {
      await voteCandidate(candidateid)
      await refreshProfile() // updates isvoted
      setVoteMessage('Vote successful. You can view results now.')
      navigate('/results', { replace: false })
    } catch (err) {
      setVoteMessage(getErrorMessage(err))
    } finally {
      setVotingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3">
          <div>
            <h1 className="text-3xl font-semibold">Candidates</h1>
            <p className="muted text-sm mt-1">
              Vote once. Your voting status: <span className="font-semibold">{hasVoted ? 'Voted' : 'Not voted'}</span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/results')}
              className="btn-primary"
            >
              View Results
            </button>
            {user?.role === 'admin' ? (
              <div className="badge">
                Admins cannot vote in this backend.
              </div>
            ) : null}
          </div>
        </div>

      </div>

      {error ? (
        <div className="notice-error">{error}</div>
      ) : null}

      {voteMessage ? (
        <div className="notice">{voteMessage}</div>
      ) : null}

      {loading ? (
        <div className="min-h-[240px] card p-6 flex items-center justify-center">
          Loading...
        </div>
      ) : candidates.length === 0 ? (
        <div className="min-h-[240px] card p-6 flex items-center justify-center">
          No candidates found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {candidates.map((c) => {
            const id = c._id || c.id
            const name = c.name || '—'
            const party = c.party || '—'
            const age = c.age ?? '—'
            const votecount = c.votecount ?? 0

            return (
              <div key={id} className="card p-5 transition-transform hover:-translate-y-[1px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm muted">Candidate</div>
                    <div className="text-xl font-semibold">{name}</div>
                    <div className="text-sm muted mt-1">Party: {party}</div>
                    <div className="text-sm muted mt-1">Age: {age}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm muted">Votes</div>
                    <div className="text-2xl font-semibold text-accent">{votecount}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-sm muted">
                    {hasVoted ? 'Voting is locked for you.' : isAdmin ? 'Admin cannot vote.' : 'Ready to vote.'}
                  </div>
                  <button
                    type="button"
                    onClick={() => onVote(id)}
                    disabled={!canVote || votingId === id}
                    className="btn-primary"
                  >
                    {votingId === id ? 'Voting...' : 'Vote'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

