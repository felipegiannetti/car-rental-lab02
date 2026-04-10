import http from './http'

export const automovelApi = {
  getAll:  ()         => http.get('/automoveis/').then(r => r.data),
  getById: (id)       => http.get(`/automoveis/${id}`).then(r => r.data),
  create:  (data)     => http.post('/automoveis/', data).then(r => r.data),
  update:  (id, data) => http.put(`/automoveis/${id}`, data).then(r => r.data),
  remove:  (id)       => http.delete(`/automoveis/${id}`),
  fotoUrl: (id)       => `/api/automoveis/${id}/foto`,
}
