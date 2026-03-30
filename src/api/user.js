import api from './axios'

export async function signup(payload) {
  const res = await api.post('/user/signup', payload)
  // backend: res => { response, token }
  return res.data
}

export async function login(payload) {
  const res = await api.post('/user/login', payload)
  // backend: res => { token }
  return res.data
}

export async function getProfile() {
  const res = await api.get('/user/profile')
  return res.data
}

export async function updatePassword(payload) {
  const res = await api.put('/user/profile/password', payload)
  return res.data
}

