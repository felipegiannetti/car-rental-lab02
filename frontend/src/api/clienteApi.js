import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const clienteApi = {
  getAll:       ()          => api.get('/clientes').then(r => r.data),
  getById:      (id)        => api.get(`/clientes/${id}`).then(r => r.data),
  create:       (data)      => api.post('/clientes', data).then(r => r.data),
  update:       (id, data)  => api.put(`/clientes/${id}`, data).then(r => r.data),
  remove:       (id)        => api.delete(`/clientes/${id}`),
  buscarPorCpf: (cpf)       => api.get(`/clientes/buscar-cpf/${cpf}`).then(r => r.data),
  fotoUrl:      (id)        => `/api/clientes/${id}/foto`,
}
