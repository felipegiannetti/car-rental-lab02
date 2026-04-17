import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Bell, CheckCircle2, XCircle, ShoppingBag, Car, ChevronLeft, ChevronRight, Phone, Mail, User } from 'lucide-react'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PAGE_SIZE = 5

const STATUS_META = {
  APROVADO: {
    icon: CheckCircle2,
    cls: 'bg-green-50 border-green-100 text-green-700',
    title: 'Pedido aprovado',
  },
  REPROVADO: {
    icon: XCircle,
    cls: 'bg-rose-50 border-rose-100 text-rose-700',
    title: 'Pedido recusado',
  },
}

function formatDateTime(value) {
  if (!value) return '---'
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NotificacoesPage() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!user) return
    fetchNotificacoes()
  }, [user])

  async function fetchNotificacoes() {
    setLoading(true)
    try {
      const response = await pedidoApi.getByCliente(user.id)
      setPedidos(response)
    } catch {
      toast.error('Erro ao carregar notificacoes.')
    } finally {
      setLoading(false)
    }
  }

  const notificacoes = useMemo(() => {
    return pedidos
      .filter((pedido) => ['APROVADO', 'REPROVADO'].includes(pedido.status))
      .sort((a, b) => new Date(b.dataAtualizacao || b.dataCriacao) - new Date(a.dataAtualizacao || a.dataCriacao))
  }, [pedidos])

  const totalPages = Math.max(1, Math.ceil(notificacoes.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const currentItems = notificacoes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/pedidos" replace />

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Notificacoes</h1>
          <p className="text-sm text-slate-400 mt-0.5">Acompanhe aprovacoes e recusas dos pedidos que voce fez.</p>
        </div>
        <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: '#f2fde0', border: '1px solid #c9f485', color: '#004521' }}>
          {notificacoes.length} notificacoes no total
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-slate-300 animate-pulse">Carregando notificacoes...</div>
        ) : currentItems.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center"><Bell className="w-8 h-8 text-slate-300" /></div>
            <p className="text-sm text-slate-400">Nenhuma notificacao disponivel no momento.</p>
            <Link to="/pedidos" className="btn-secondary text-xs">Ver meus pedidos</Link>
          </div>
        ) : (
          <>
            <div className="p-4 sm:p-5 space-y-4">
              {currentItems.map((pedido) => {
                const meta = STATUS_META[pedido.status] || STATUS_META.REPROVADO
                const Icon = meta.icon
                return (
                  <div key={pedido.id} className={`rounded-2xl border p-4 ${meta.cls}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/80 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold">{meta.title}</p>
                          <p className="text-sm opacity-80 mt-1">
                            {pedido.tipoPedido === 'COMPRA' ? <span className="inline-flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" /> Pedido de compra</span> : <span className="inline-flex items-center gap-1"><Car className="w-3.5 h-3.5" /> Pedido de aluguel</span>}
                            {' '}para {pedido.automovelInfo}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-medium opacity-70">{formatDateTime(pedido.dataAtualizacao || pedido.dataCriacao)}</p>
                    </div>

                    <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-slate-700">
                      {pedido.status === 'APROVADO'
                        ? `Seu pedido foi aprovado por ${pedido.anuncianteNome}.`
                        : `Seu pedido foi recusado por ${pedido.anuncianteNome}.`}
                    </div>

                    {pedido.contatoAnunciante && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white/80 px-3 py-2">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Nome completo</p>
                          <p className="mt-1 text-sm font-medium text-slate-800 inline-flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {pedido.contatoAnunciante.nome}</p>
                        </div>
                        <div className="rounded-xl bg-white/80 px-3 py-2">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                          <p className="mt-1 text-sm font-medium text-slate-800 inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {pedido.contatoAnunciante.email || '---'}</p>
                        </div>
                        <div className="rounded-xl bg-white/80 px-3 py-2">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Telefone</p>
                          <p className="mt-1 text-sm font-medium text-slate-800 inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {pedido.contatoAnunciante.telefone || '---'}</p>
                        </div>
                        <div className="rounded-xl bg-white/80 px-3 py-2">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Detalhes</p>
                          <Link to={`/pedidos/${pedido.id}`} className="mt-1 inline-flex text-sm font-medium" style={{ color: '#004521' }}>Abrir pedido</Link>
                        </div>
                      </div>
                    )}

                    {!pedido.contatoAnunciante && (
                      <div className="mt-4">
                        <Link to={`/pedidos/${pedido.id}`} className="inline-flex text-sm font-medium text-slate-700 hover:text-slate-900">Ver detalhes do pedido</Link>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="px-4 sm:px-5 py-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-400">Pagina {currentPage} de {totalPages}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="btn-secondary text-xs disabled:opacity-50"><ChevronLeft className="w-3.5 h-3.5" /> Anterior</button>
                <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="btn-secondary text-xs disabled:opacity-50">Proxima <ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
