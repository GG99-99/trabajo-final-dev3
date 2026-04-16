/**
 * AppRouter.tsx — Gestión centralizada de rutas con React Router v7
 *
 * Agrega aquí todas las rutas de la aplicación.
 * App.tsx importa este componente y lo envuelve con los providers globales.
 *
 * Rutas anidadas (ejemplo):
 *   <Route path="/dashboard" element={<LayoutDashboard />}>
 *     <Route index element={<DashboardHome />} />
 *     <Route path="perfil" element={<Perfil />} />
 *   </Route>
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// ── Páginas ────────────────────────────────────────────────────────────────
import Home     from '@/pages/Home'
import Login    from '@/pages/AuthLogin'
import NotFound from '@/pages/NotFound'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Públicas ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ── 404 ── */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
