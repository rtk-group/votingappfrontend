import api from './axios'

export async function getCandidates() {
  const res = await api.get('/candidate')
  return res.data
}

export async function voteCandidate(candidateid) {
  const res = await api.post(`/candidate/vote/${candidateid}`)
  return res.data
}

export async function getVoteCount() {
  const res = await api.get('/candidate/vote/count')
  return res.data
}

// Admin-only candidate management endpoints
export async function createCandidate(payload) {
  const res = await api.post('/candidate/signup', payload)
  return res.data
}

export async function updateCandidate(candidateid, payload) {
  const res = await api.put(`/candidate/${candidateid}`, payload)
  return res.data
}

export async function deleteCandidate(candidateid) {
  const res = await api.delete(`/candidate/${candidateid}`)
  return res.data
}

