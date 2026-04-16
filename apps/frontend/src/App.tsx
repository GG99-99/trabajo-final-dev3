/**
 * App.tsx — Punto de entrada de la aplicación
 *
 * Responsabilidad ÚNICA: envolver la app con todos los providers
 * de contexto global y montar el router.
 *
 * ✅ Agrega aquí:
 *   - Providers de contexto global (AuthProvider, ThemeProvider, etc.)
 *   - Providers de librerías externas (QueryClientProvider, etc.)
 *
 * ❌ No pongas aquí:
 *   - Lógica de rutas  → AppRouter.tsx
 *   - Componentes de UI → src/componentes/
 *   - Lógica de negocio → src/hooks/ o src/context/
 */

import AppRouter from './componentes/AppRouter'
import './App.css'

// ── Providers globales (descomenta según los vayas creando) ────────────────
// import { AuthProvider }  from './context/AuthContext'
// import { ThemeProvider } from './context/ThemeContext'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// const queryClient = new QueryClient()

export default function App() {
  return (
    // Apila los providers de afuera hacia adentro según dependencias:
    // <QueryClientProvider client={queryClient}>
    //   <AuthProvider>
    //     <ThemeProvider>
    //       <AppRouter />
    //     </ThemeProvider>
    //   </AuthProvider>
    // </QueryClientProvider>

    <AppRouter />
  )
}
