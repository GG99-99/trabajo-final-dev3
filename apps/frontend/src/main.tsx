import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerCIR } from './lib/cir'

// Registra el Service Worker de resiliencia (CIR).
// Intercepta todas las peticiones al core y provee cache + cola offline.
registerCIR()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
