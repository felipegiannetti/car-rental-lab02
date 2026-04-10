import http from './http'

export const pedidoApi = {
  getAll:          ()              => http.get('/pedidos/').then(r => r.data),
  getByCliente:    (clienteId)     => http.get(`/pedidos/?clienteId=${clienteId}`).then(r => r.data),
  getByAnunciante: (anuncianteId)  => http.get(`/pedidos/?anuncianteId=${anuncianteId}`).then(r => r.data),
  getById:         (id)            => http.get(`/pedidos/${id}`).then(r => r.data),
  create:          (data)          => http.post('/pedidos/', data).then(r => r.data),
  atualizarStatus: (id, status)    => http.patch(`/pedidos/${id}/status`, { status }).then(r => r.data),
  cancelar:        (id)            => http.post(`/pedidos/${id}/cancelar`).then(r => r.data),
  remove:          (id)            => http.delete(`/pedidos/${id}`),
}
