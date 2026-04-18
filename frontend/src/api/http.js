import axios from 'axios'
import { AUTH_STORAGE_KEY } from '../constants/auth'

const http = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? '') + '/api',
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    const user = stored ? JSON.parse(stored) : null

    if (user?.tipoUsuario && user?.id) {
      config.headers['X-User-Role'] = user.tipoUsuario
      config.headers['X-User-Id'] = String(user.id)
    }
  } catch {
    // Ignore malformed local storage and continue without auth headers.
  }

  return config
})

export default http
