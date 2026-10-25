import { useState, useEffect, useRef, Fragment } from 'react'
import { PARCIALES, PARCIAL_PROXIMO, PARTICIPANTES, rutaPreguntas } from '../navegacion'

/*
 * Header: logo + título (link a la landing), integrantes y selector de parcial.
 *   info          — ruta interpretada (parcial activo y migas; landing si no hay parcial)
 *   onParcial(p)  — click en un parcial habilitado
 */
export default function Header({ info, onParcial }) {
  const parcialActivo = info.parcial?.id ?? null
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="header-left">
          <a href="#/" className="app-header-home">
            <Logo />
            <h1>Física II — Grupo 3</h1>
          </a>
          <Integrantes />
        </div>

        {!info.landing && <Migas info={info} />}

        <div className="seg" role="group" aria-label="Parcial">
          {PARCIALES.map(p => {
            const activo = parcialActivo === p.id
            return (
              <button key={p.id} className={`seg-btn${activo ? ' seg-btn--activo' : ''}`}
                      onClick={() => onParcial(p)} aria-pressed={activo}>
                {p.label}
              </button>
            )
          })}
          <span className="seg-btn seg-btn--deshabilitado" title="Próximamente" aria-disabled="true">
            {PARCIAL_PROXIMO.label}
            <small className="seg-proximamente">próximamente</small>
          </span>
        </div>
      </div>
    </header>
  )
}

// Mismo dibujo que el favicon (index.html)
function Logo() {
  return (
    <svg className="app-logo" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="#64b5f6" strokeWidth="6">
        <ellipse cx="50" cy="50" rx="48" ry="18" />
        <ellipse cx="50" cy="50" rx="48" ry="18" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="48" ry="18" transform="rotate(120 50 50)" />
      </g>
      <circle cx="50" cy="50" r="8" fill="#64b5f6" />
    </svg>
  )
}

// Botón de texto con ícono + panel desplegable anclado debajo (se cierra con click afuera o Escape)
function Integrantes() {
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)
  const botonRef = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const alClickear = e => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false)
    }
    const alTeclear = e => {
      if (e.key === 'Escape') {
        setAbierto(false)
        botonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', alClickear)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('pointerdown', alClickear)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [abierto])

  return (
    <div className="part-wrap" ref={ref}>
      <button ref={botonRef} className="part-boton" onClick={() => setAbierto(a => !a)}
              aria-expanded={abierto} aria-controls="panel-integrantes">
        <IconoPersonas />
        Integrantes
      </button>
      {abierto && (
        <div className="part-menu" id="panel-integrantes">
          <div className="part-menu-titulo">Integrantes del grupo</div>
          <ul className="part-list">
            {PARTICIPANTES.map(nombre => <li key={nombre}>{nombre}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

// Dos siluetas simples de trazo
function IconoPersonas() {
  return (
    <svg className="part-icono" viewBox="0 0 24 24" aria-hidden="true" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3 19.5c0-3.3 2.7-5.6 6-5.6s6 2.3 6 5.6" />
      <circle cx="16.8" cy="9.3" r="2.6" />
      <path d="M16 14.1c.3-.1.7-.1 1-.1 2.7 0 4.6 2 4.6 4.8" />
    </svg>
  )
}

// Inicio / Parcial 2 / 1-b) Campo rotante / Resolución
function Migas({ info }) {
  const { parcial, tab, seccion, simulacro, rutaTeoria } = info
  const partes = [
    { label: 'Inicio', ruta: '/' },
    { label: parcial.corto, ruta: `/${parcial.slug}` },
    { label: tab.label, ruta: `/${parcial.slug}/${tab.id}` },
  ]
  if (seccion) partes.push({ label: seccion.label, ruta: `/${parcial.slug}/${tab.id}/${seccion.id}` })
  if (simulacro) partes.push({ label: 'Simulacro', ruta: rutaPreguntas(rutaTeoria, 'config') })

  return (
    <nav className="migas" aria-label="Ubicación">
      {partes.map((p, i) => (
        <Fragment key={p.ruta}>
          {i > 0 && <span className="migas-sep" aria-hidden="true">/</span>}
          <a href={`#${p.ruta}`} aria-current={i === partes.length - 1 ? 'page' : undefined}>{p.label}</a>
        </Fragment>
      ))}
    </nav>
  )
}
