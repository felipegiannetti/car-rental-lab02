import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import ClienteListPage from './pages/ClienteListPage'
import ClienteFormPage from './pages/ClienteFormPage'
import ClienteDetailPage from './pages/ClienteDetailPage'
import AutomovelListPage from './pages/AutomovelListPage'
import AutomovelFormPage from './pages/AutomovelFormPage'
import PedidoListPage from './pages/PedidoListPage'
import PedidoFormPage from './pages/PedidoFormPage'
import PedidoDetailPage from './pages/PedidoDetailPage'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/pedidos" replace />} />

        {/* Clientes — públicos no admin */}
        <Route path="clientes" element={<ClienteListPage />} />
        <Route path="clientes/novo" element={<ClienteFormPage />} />
        <Route path="clientes/:id" element={<ClienteDetailPage />} />
        <Route path="clientes/:id/editar" element={<ClienteFormPage />} />

        {/* Automóveis */}
        <Route path="automoveis" element={<AutomovelListPage />} />
        <Route path="automoveis/novo" element={<AutomovelFormPage />} />
        <Route path="automoveis/:id/editar" element={<AutomovelFormPage />} />

        {/* Pedidos — requerem login */}
        <Route path="pedidos" element={<ProtectedRoute><PedidoListPage /></ProtectedRoute>} />
        <Route path="pedidos/novo" element={<ProtectedRoute><PedidoFormPage /></ProtectedRoute>} />
        <Route path="pedidos/:id" element={<ProtectedRoute><PedidoDetailPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}
