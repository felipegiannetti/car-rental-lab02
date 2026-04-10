import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const automovelApi = {
  getAll:  ()         => api.get('/automoveis/').then(r => r.data),
  getById: (id)       => api.get(`/automoveis/${id}`).then(r => r.data),
  create:  (data)     => api.post('/automoveis/', data).then(r => r.data),
  update:  (id, data) => api.put(`/automoveis/${id}`, data).then(r => r.data),
  remove:  (id)       => api.delete(`/automoveis/${id}`),
}
