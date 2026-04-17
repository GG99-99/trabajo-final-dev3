/**
 * Home.tsx — Página principal de Permanence
 * Contiene: Nav · Hero · Canvas · Collection · Archive · CTA · Footer
 */

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import Icon from '@/componentes/Icon'

// ── Datos ──────────────────────────────────────────────────────────────────
const portraits = [
  { name: 'Rafael Viera', year: '1847', bg: 'linear-gradient(135deg,#1a1010 0%,#2d1a1a 100%)' },
  { name: 'Elena Toro',   year: '1923', bg: 'linear-gradient(135deg,#101218 0%,#1a1825 100%)' },
]

const collection = [
  { caption: 'Vanitas XII', meta: 'Óleo · 1891',     shape: 'circle' },
  { caption: 'Estudio III', meta: 'Bronce · 1904',   shape: 'rect'   },
  { caption: 'Retrato IV',  meta: 'Carbón · 1878',   shape: 'face'   },
  { caption: 'Natura V',   meta: 'Acuarela · 1912',  shape: 'oval'   },
  { caption: 'Forma IX',   meta: 'Mármol · 1933',    shape: 'tri'    },
]

// ── Sub-componentes internos ───────────────────────────────────────────────
function PortraitPlaceholder({ bg }: { bg: string }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <svg width="60" height="80" viewBox="0 0 60 80" fill="none" style={{ opacity: 0.18 }}>
        <ellipse cx="30" cy="25" rx="16" ry="18" stroke="#e8e0d8" strokeWidth="1" />
        <path d="M5 75 Q10 48 30 46 Q50 48 55 75" stroke="#e8e0d8" strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}

function CollectionShape({ shape }: { shape: string }) {
  const s = { stroke: '#e8e0d8', strokeWidth: '0.8', fill: 'none', opacity: 0.2 }
  return (
    <svg width="80" height="100" viewBox="0 0 80 100">
      {shape === 'circle' && <ellipse cx="40" cy="50" rx="28" ry="32" {...s} />}
      {shape === 'rect'   && <rect x="16" y="18" width="48" height="64" {...s} />}
      {shape === 'face'   && (
        <>
          <ellipse cx="40" cy="36" rx="18" ry="20" {...s} />
          <path d="M18 80 Q22 56 40 54 Q58 56 62 80" {...s} />
        </>
      )}
      {shape === 'oval' && <ellipse cx="40" cy="50" rx="20" ry="36" {...s} />}
      {shape === 'tri'  && <path d="M40 12 L68 82 L12 82 Z" {...s} />}
    </svg>
  )
}

// ── Helper scroll suave ────────────────────────────────────────────────────
function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
  e.preventDefault()
  const simpleBarEl = document.querySelector('.simplebar-content-wrapper')
  const target      = document.getElementById(targetId)
  if (!simpleBarEl || !target) return

  const containerTop = simpleBarEl.getBoundingClientRect().top
  const targetTop    = target.getBoundingClientRect().top
  const offset       = targetTop - containerTop + simpleBarEl.scrollTop
  simpleBarEl.scrollTo({ top: offset, behavior: 'smooth' })
}

// ── Página ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <SimpleBar style={{ height: '100svh', width: '100%' }} autoHide={false} forceVisible="y">

      {/* ── NAV ── */}
      <nav className="nav">
        <span className="nav-logo">Permanence</span>
        <ul className="nav-links">
          <li><a href="#canvas"     onClick={(e) => handleNavClick(e, 'canvas')}>El Canvas</a></li>
          <li><a href="#collection" onClick={(e) => handleNavClick(e, 'collection')}>Colección</a></li>
          <li><a href="#archive"    onClick={(e) => handleNavClick(e, 'archive')}>Archivo</a></li>
        </ul>
        <button className="nav-cta">
          <Icon name="mdi:login-variant" size={13} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Ingresar
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-bg-grid" />
        <div className="hero-content">
          <p className="hero-eyebrow">Estudio de Arte · Est. 2024</p>
          <h1 className="hero-title">
            Permanence
            <em>Refined.</em>
          </h1>
          <p className="hero-body">
            Un archivo vivo de obras que trascienden el tiempo. Cada pieza, una conversación
            entre el artista y la eternidad.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">
              <Icon name="mdi:view-grid-outline" size={13} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Explorar Colección
            </button>
            <button className="btn-ghost">
              <Icon name="mdi:book-open-page-variant-outline" size={13} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Nuestra Historia
            </button>
          </div>
        </div>
      </section>

      {/* ── THE CANVAS ── */}
      <section className="canvas-section" id="canvas">
        <div className="canvas-text">
          <p className="section-sub">I — El Canvas</p>
          <h2 className="section-label">El arte que<br />permanece</h2>
          <p>
            Cada obra en nuestra colección ha sido seleccionada por su capacidad de
            resistir el paso del tiempo. No como reliquia, sino como presencia viva
            que dialoga con cada nueva generación.
          </p>
          <button className="btn-primary">
            <Icon name="mdi:account-group-outline" size={13} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Ver Artistas
          </button>
        </div>
        <div className="canvas-portraits">
          {portraits.map((p) => (
            <div className="portrait-card" key={p.name}>
              <PortraitPlaceholder bg={p.bg} />
              <span className="portrait-name">{p.name}</span>
              <span className="portrait-year">{p.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE COLLECTION ── */}
      <section className="collection-section" id="collection">
        <p className="section-sub">II — La Colección</p>
        <h2 className="section-label">Obras Selectas</h2>
        <div className="collection-grid">
          {collection.map((item) => (
            <div className="collection-item" key={item.caption}>
              <div className="collection-thumb">
                <div className="collection-thumb-placeholder">
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CollectionShape shape={item.shape} />
                  </div>
                </div>
              </div>
              <div className="collection-caption">{item.caption}</div>
              <div className="collection-meta">{item.meta}</div>
            </div>
          ))}
        </div>
        <button className="btn-ghost">
          <Icon name="mdi:format-list-bulleted" size={13} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Catálogo Completo
        </button>
      </section>

      {/* ── ARCHIVE STUDIO ── */}
      <section className="archive-section" id="archive">
        <div className="archive-visual">
          <div className="archive-light" />
          <div className="archive-light-bar" />
        </div>
        <div className="archive-text">
          <p className="section-sub">III — El Archivo</p>
          <h2 className="section-label">The Archive<br />Studio</h2>
          <p>
            Nuestro espacio de conservación y estudio donde las obras reciben el cuidado
            que merecen. Un lugar donde el pasado y el presente coexisten en silencio
            productivo, dando origen a nuevas interpretaciones.
          </p>
          <div className="archive-stats">
            {[
              { num: '847', label: 'Obras Archivadas',       icon: 'mdi:image-multiple-outline' },
              { num: '12',  label: 'Décadas de Historia',    icon: 'mdi:timeline-clock-outline'  },
              { num: '94',  label: 'Artistas Representados', icon: 'mdi:palette-outline'         },
              { num: '38',  label: 'Países de Origen',       icon: 'mdi:earth'                   },
            ].map(({ num, label, icon }) => (
              <div key={label}>
                <div className="stat-num">{num}</div>
                <div className="stat-label">
                  <Icon name={icon} size={11} style={{ marginRight: 6, verticalAlign: 'middle', opacity: 0.6 }} />
                  {label}
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary">
            <Icon name="mdi:door-open" size={13} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Visitar el Estudio
          </button>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="section-label">Begin Your<br />Entry</h2>
        <div className="cta-form">
          <input type="text"  placeholder="Nombre completo" />
          <input type="email" placeholder="Correo electrónico" />
          <button className="btn-primary">
            <Icon name="mdi:send-outline" size={13} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Solicitar Acceso
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="footer-logo">Permanence</span>
        <div className="footer-links">
          <Icon name="mdi:instagram" size={16} style={{ opacity: 0.4, cursor: 'pointer' }} />
          <Icon name="mdi:twitter"   size={16} style={{ opacity: 0.4, cursor: 'pointer' }} />
          <Icon name="mdi:pinterest" size={16} style={{ opacity: 0.4, cursor: 'pointer' }} />
        </div>
        <span className="footer-copy">© 2024 — Todos los derechos reservados</span>
      </footer>

    </SimpleBar>
  )
}
