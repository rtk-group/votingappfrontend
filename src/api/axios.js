import axios from 'axios'

// const API_BASE_URL = 'http://localhost:3000/'
const API_BASE_URL = 'http://localhost:3000/'
console.log('Using API base URL:', API_BASE_URL)

// Central Axios instance so auth + error handling stay consistent.
const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

