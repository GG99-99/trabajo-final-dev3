import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { ReactNode } from 'react'

// ── Páginas ────────────────────────────────────────────────────────────────
import Home          from '@/pages/Home'
import Login         from '@/pages/AuthLogin'
import Register      from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import CashierLogin  from '@/pages/CashierLogin'
import CashierPOS    from '@/pages/CashierPOS'
import AdminDashboard from '@/pages/AdminDashboard'
import NotFound      from '@/pages/NotFound'

// ── Guards ─────────────────────────────────────────────────────────────────
function RequireAuth({ children, role }: { children: ReactNode; role?: 'cashier' | 'worker' | 'client' }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.type !== role) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Públicas ── */}
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cashier/login"  element={<CashierLogin />} />

        {/* ── Cashier (protegida) ── */}
        <Route path="/cashier/pos" element={
          <RequireAuth role="cashier"><CashierPOS /></RequireAuth>
        } />

        {/* ── Admin (protegida, worker o cualquier autenticado) ── */}
        <Route path="/admin" element={
          <RequireAuth><AdminDashboard /></RequireAuth>
        } />

        {/* ── 404 ── */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
