import { useState, useEffect, useRef } from 'react'
import './App.css'
import FieldSuperposition from './components/FieldSuperposition'
import CapacitorCircuit from './components/CapacitorCircuit'
import Flashcards from './components/Flashcards'
import ConductoresConcentricos from './components/ConductoresConcentricos'
import CableJ from './components/parcial2/CableJ'
import CampoRotante from './components/parcial2/CampoRotante'
import CircuitoRCRL from './components/parcial2/CircuitoRCRL'

const TABS = {
  1: [
    { id: 'conductores', label: 'Conductores Concéntricos', Component: ConductoresConcentricos },
    { id: 'fields',     label: 'Superposición de Campos',  Component: FieldSuperposition },
    { id: 'capacitors', label: 'Circuito de Capacitores',  Component: CapacitorCircuit  },
    { id: 'flashcards', label: 'Flashcards de Repaso',     Component: Flashcards        },
  ],
  2: [
    { id: 'cable',    label: '1-a) Cable con J(r)',  Component: CableJ       },
    { id: 'rotante',  label: '1-b) Campo rotante',   Component: CampoRotante },
    { id: 'circuito', label: '2) Circuito RC-RL',    Component: CircuitoRCRL },
  ],
}

const PARCIALES = [
  { id: 1, label: 'Parcial 1 · Electrostática' },
  { id: 2, label: 'Parcial 2 · Electromagnetismo' },
]

const PARTICIPANTES = [
  'Geronimo Garrote',
  'Demarco Melina',
  'Rasio Valentín',
  'Anita Paez',
  'Gomez Mattoni Melisa',
]

export default function App() {
  const [parcial, setParcial]       = useState(2)
  // Pestaña activa de cada parcial (se recuerda al cambiar de parcial)
  const [activeTabs, setActiveTabs] = useState({ 1: 'conductores', 2: 'cable' })
  const activeTab                   = activeTabs[parcial]
  const setActiveTab = id => setActiveTabs(prev => ({ ...prev, [parcial]: id }))
  const [menuOpen, setMenuOpen]     = useState(false)
  const menuRef                     = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

  const { Component } = TABS[parcial].find(t => t.id === activeTab)

  return (
    <>
      <header className="app-header">
        {/* Decorative field lines — purely visual, aria-hidden */}
        <svg className="app-header-deco" aria-hidden="true"
             viewBox="0 0 600 80" xmlns="http://www.w3.org/2000/svg">
          <g stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round">
            <line x1="592" y1="40" x2="-10" y2="40"  opacity="0.07"/>
            <line x1="592" y1="40" x2="-10" y2="11"  opacity="0.065"/>
            <line x1="592" y1="40" x2="-10" y2="69"  opacity="0.065"/>
            <line x1="592" y1="40" x2="75"  y2="-4"  opacity="0.06"/>
            <line x1="592" y1="40" x2="75"  y2="84"  opacity="0.06"/>
            <line x1="592" y1="40" x2="220" y2="-4"  opacity="0.055"/>
            <line x1="592" y1="40" x2="220" y2="84"  opacity="0.055"/>
            <line x1="592" y1="40" x2="390" y2="-4"  opacity="0.045"/>
            <line x1="592" y1="40" x2="390" y2="84"  opacity="0.045"/>
            <circle cx="592" cy="40" r="4"   fill="white" opacity="0.13"/>
            <circle cx="592" cy="40" r="9"   strokeWidth="0.9" opacity="0.07"/>
            <circle cx="592" cy="40" r="16"  strokeWidth="0.7" opacity="0.04"/>
          </g>
        </svg>
        <div className="app-header-inner">
        <div className="header-left">
          <h1>Física II — Grupo 3</h1>

          {/* Participantes dropdown — next to title */}
          <div className="part-wrap" ref={menuRef}>
            <button
              className="parcial-pill parcial-pill--participants"
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
            >
              Participantes
            </button>
            {menuOpen && (
              <div className="part-menu">
                <div className="part-menu-header">
                  <span>Integrantes del grupo</span>
                  <button className="part-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar">✕</button>
                </div>
                <ul className="part-list">
                  {PARTICIPANTES.map(name => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="header-controls">

          {PARCIALES.map(({ id, label, disabled }) =>
            disabled ? (
              <div key={id} className="parcial-pill parcial-pill--disabled" title="Disponible próximamente">
                {label}
                <span className="parcial-soon">Próximamente</span>
              </div>
            ) : (
              <button
                key={id}
                className={`parcial-pill${parcial === id ? ' parcial-pill--active' : ''}`}
                onClick={() => setParcial(id)}
              >
                {label}
              </button>
            )
          )}
        </div>
        </div>{/* end app-header-inner */}
      </header>

      <div className={`app${parcial === 2 ? ' app--nav-lateral' : ''}`}>
      <nav className="tab-bar">
        {TABS[parcial].map(({ id, label }) => (
          <button
            key={id}
            className={`tab-btn${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="tab-content">
        <Component />
      </main>
      </div>
    </>
  )
}
