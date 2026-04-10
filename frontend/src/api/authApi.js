import http from './http'

export const authApi = {
  login: (nomeUsuario, senha) =>
    http.post('/auth/login', { nomeUsuario, senha }).then(r => r.data),
}
