import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ClienteListPage from './pages/ClienteListPage'
import ClienteFormPage from './pages/ClienteFormPage'
import ClienteDetailPage from './pages/ClienteDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/clientes" replace />} />
        <Route path="clientes" element={<ClienteListPage />} />
        <Route path="clientes/novo" element={<ClienteFormPage />} />
        <Route path="clientes/:id" element={<ClienteDetailPage />} />
        <Route path="clientes/:id/editar" element={<ClienteFormPage />} />
      </Route>
    </Routes>
  )
}
