import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const authApi = {
  login: (nomeUsuario, senha) =>
    api.post('/auth/login', { nomeUsuario, senha }).then(r => r.data),
}
