import AppRouter from './componentes/AppRouter'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { OfflineBanner } from './componentes/OfflineBanner'

export default function App() {
  return (
    <AuthProvider>
      <OfflineBanner />
      <AppRouter />
    </AuthProvider>
  )
}
