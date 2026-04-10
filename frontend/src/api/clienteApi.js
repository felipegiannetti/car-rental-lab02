import http from './http'

export const clienteApi = {
  getAll:       ()          => http.get('/clientes').then(r => r.data),
  getById:      (id)        => http.get(`/clientes/${id}`).then(r => r.data),
  create:       (data)      => http.post('/clientes', data).then(r => r.data),
  update:       (id, data)  => http.put(`/clientes/${id}`, data).then(r => r.data),
  remove:       (id)        => http.delete(`/clientes/${id}`),
  buscarPorCpf: (cpf)       => http.get(`/clientes/buscar-cpf/${cpf}`).then(r => r.data),
  fotoUrl:      (id)        => `/api/clientes/${id}/foto`,
}
