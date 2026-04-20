import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startOfflineWatcher } from './lib/punch.offline'

// Arranca el watcher de sincronización offline para el módulo de ponche.
// Se ejecuta una vez al iniciar la app y corre en background cada 15 s.
startOfflineWatcher()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
