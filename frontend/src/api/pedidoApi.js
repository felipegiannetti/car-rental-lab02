import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const pedidoApi = {
  getAll:          ()              => api.get('/pedidos/').then(r => r.data),
  getByCliente:    (clienteId)     => api.get(`/pedidos/?clienteId=${clienteId}`).then(r => r.data),
  getById:         (id)            => api.get(`/pedidos/${id}`).then(r => r.data),
  create:          (data)          => api.post('/pedidos/', data).then(r => r.data),
  atualizarStatus: (id, status)    => api.patch(`/pedidos/${id}/status`, { status }).then(r => r.data),
  cancelar:        (id)            => api.post(`/pedidos/${id}/cancelar`).then(r => r.data),
}
