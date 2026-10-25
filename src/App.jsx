import { useEffect, useRef, Fragment } from 'react'
import './App.css'
import FieldSuperposition from './components/FieldSuperposition'
import CapacitorCircuit from './components/CapacitorCircuit'
import Flashcards from './components/Flashcards'
import ConductoresConcentricos from './components/ConductoresConcentricos'
import CableJ from './components/parcial2/CableJ'
import CampoRotante from './components/parcial2/CampoRotante'
import CircuitoRCRL from './components/parcial2/CircuitoRCRL'
import TeoriaGeneral from './components/parcial2/TeoriaGeneral'
import Landing from './components/Landing'
import Header from './components/Header'
import { interpretarRuta, SECCIONES_EJERCICIO } from './navegacion'
import { useRuta, navegar, RutaContext } from './router'

// Componente de cada pestaña, por parcial
const COMPONENTES = {
  1: { conductores: ConductoresConcentricos, fields: FieldSuperposition, capacitors: CapacitorCircuit, flashcards: Flashcards },
  2: { '1a': CableJ, '1b': CampoRotante, '2': CircuitoRCRL, teoria: TeoriaGeneral },
}

export default function App() {
  const ruta = useRuta()
  const info = interpretarRuta(ruta)
  // Última ruta visitada de cada parcial, para volver ahí desde el selector
  const ultimaRuta = useRef({})

  // Rutas incompletas o inválidas → forma canónica (sin agregar historial)
  useEffect(() => {
    if (info.canonica !== ruta) navegar(info.canonica, { reemplazar: true })
  }, [ruta, info.canonica])

  useEffect(() => {
    if (info.parcial) ultimaRuta.current[info.parcial.id] = info.canonica
  }, [info.parcial, info.canonica])

  // Al cambiar de página (no de paso ni de pestaña interna), volver arriba
  const pagina = info.landing ? 'landing' : `${info.parcial.id}/${info.tab.id}`
  useEffect(() => { window.scrollTo(0, 0) }, [pagina])

  useEffect(() => {
    document.title = info.landing
      ? 'Física II — Grupo 3'
      : `${info.tab.label} · ${info.parcial.corto} — Física II`
  }, [info.landing, info.tab, info.parcial])

  const irAParcial = p => navegar(ultimaRuta.current[p.id] ?? `/${p.slug}`)

  return (
    <>
      <Header info={info} onParcial={irAParcial} />

      {info.landing ? (
        <Landing />
      ) : (
        <Pagina info={info} />
      )}
    </>
  )
}

function Pagina({ info }) {
  const { parcial, tab } = info
  const Component = COMPONENTES[parcial.id][tab.id]

  return (
    <>
      <div className={`app${parcial.id === 2 ? ' app--nav-lateral' : ''}`}>
        <nav className="tab-bar">
          {parcial.tabs.map(({ id, label, separado }) => (
            <Fragment key={id}>
              {separado && <span className="tab-sep" aria-hidden="true" />}
              <button
                className={`tab-btn${tab.id === id ? ' active' : ''}`}
                onClick={() => { if (tab.id !== id) navegar(`/${parcial.slug}/${id}`) }}
                aria-current={tab.id === id ? 'page' : undefined}
              >
                {label}
              </button>
              {parcial.id === 2 && tab.id === id && info.seccion && (
                <div className="sub-nav" role="group" aria-label="Sección del ejercicio">
                  {SECCIONES_EJERCICIO.map(s => (
                    <button
                      key={s.id}
                      className={`sub-btn${info.seccion.id === s.id ? ' active' : ''}`}
                      onClick={() => { if (info.seccion.id !== s.id) navegar(`${info.base}/${s.id}`) }}
                      aria-current={info.seccion.id === s.id ? 'page' : undefined}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </Fragment>
          ))}
        </nav>

        <main className="tab-content">
          <RutaContext.Provider value={info}>
            <Component />
          </RutaContext.Provider>
        </main>
      </div>
    </>
  )
}
