import http from './http'

export const userApi = {
  getAll: () => http.get('/usuarios/').then(r => r.data),
  getById: (tipo, id) => http.get(`/usuarios/${tipo}/${id}`).then(r => r.data),
  create: (data) => http.post('/usuarios/', data).then(r => r.data),
  update: (tipo, id, data) => http.put(`/usuarios/${tipo}/${id}`, data).then(r => r.data),
  remove: (tipo, id) => http.delete(`/usuarios/${tipo}/${id}`),
  fotoUrl: (tipo, id) => (tipo === 'cliente' ? `/api/clientes/${id}/foto` : null),
}
