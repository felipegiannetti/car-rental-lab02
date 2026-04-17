import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UsuarioListPage from './pages/UsuarioListPage'
import UsuarioFormPage from './pages/UsuarioFormPage'
import UsuarioDetailPage from './pages/UsuarioDetailPage'
import AutomovelListPage from './pages/AutomovelListPage'
import AutomovelFormPage from './pages/AutomovelFormPage'
import AutomovelDetailPage from './pages/AutomovelDetailPage'
import MeusAnunciosPage from './pages/MeusAnunciosPage'
import PedidoListPage from './pages/PedidoListPage'
import PedidoFormPage from './pages/PedidoFormPage'
import PedidoDetailPage from './pages/PedidoDetailPage'
import PedidosRecebidosPage from './pages/PedidosRecebidosPage'
import NotificacoesPage from './pages/NotificacoesPage'
import DesignPage from './pages/DesignPage'
import SlidesPage from './pages/SlidesPage'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/automoveis" replace />} />

        <Route path="usuarios" element={<AdminRoute><UsuarioListPage /></AdminRoute>} />
        <Route path="usuarios/novo" element={<AdminRoute><UsuarioFormPage /></AdminRoute>} />
        <Route path="usuarios/:tipo/:id" element={<AdminRoute><UsuarioDetailPage /></AdminRoute>} />
        <Route path="usuarios/:tipo/:id/editar" element={<AdminRoute><UsuarioFormPage /></AdminRoute>} />

        <Route path="automoveis" element={<AutomovelListPage />} />
        <Route path="automoveis/:id" element={<AutomovelDetailPage />} />
        <Route path="automoveis/novo" element={<ProtectedRoute><AutomovelFormPage /></ProtectedRoute>} />
        <Route path="automoveis/:id/editar" element={<ProtectedRoute><AutomovelFormPage /></ProtectedRoute>} />
        <Route path="meus-anuncios" element={<ProtectedRoute><MeusAnunciosPage /></ProtectedRoute>} />

        <Route path="pedidos" element={<ProtectedRoute><PedidoListPage /></ProtectedRoute>} />
        <Route path="pedidos/novo" element={<ProtectedRoute><PedidoFormPage /></ProtectedRoute>} />
        <Route path="pedidos/:id" element={<ProtectedRoute><PedidoDetailPage /></ProtectedRoute>} />
        <Route path="pedidos-recebidos" element={<ProtectedRoute><PedidosRecebidosPage /></ProtectedRoute>} />
        <Route path="notificacoes" element={<ProtectedRoute><NotificacoesPage /></ProtectedRoute>} />
        <Route path="design" element={<DesignPage />} />
        <Route path="slides" element={<SlidesPage />} />
      </Route>
    </Routes>
  )
}
