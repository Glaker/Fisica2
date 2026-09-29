import { useState } from 'react'
import StepperResolucion from '../StepperResolucion'
import './Parcial2.css'

const SECCIONES = [
  { id: 'enunciado',  label: 'Enunciado' },
  { id: 'resolucion', label: 'Resolución' },
  { id: 'teoria',     label: 'Teoría y preguntas' },
]

/*
 * Estructura común de cada ejercicio del Parcial 2.
 *   enunciado / teoria — JSX (si falta, se muestra "En construcción")
 *   pasos + Visual     — datos para StepperResolucion (si pasos está vacío, "En construcción")
 */
export default function EjercicioLayout({ titulo, subtitulo, enunciado, pasos = [], Visual, teoria }) {
  const [seccion, setSeccion] = useState('enunciado')

  return (
    <div className="p2-root">
      <h2>{titulo}</h2>
      {subtitulo && <p className="cc2-subtitle">{subtitulo}</p>}

      <div className="p2-tabs" role="tablist">
        {SECCIONES.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={seccion === id}
            className={`p2-tab${seccion === id ? ' p2-tab--active' : ''}`}
            onClick={() => setSeccion(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p2-panel" role="tabpanel">
        {seccion === 'enunciado' && (enunciado ?? <EnConstruccion />)}
        {seccion === 'resolucion' && (
          pasos.length > 0 ? <StepperResolucion pasos={pasos} Visual={Visual} /> : <EnConstruccion />
        )}
        {seccion === 'teoria' && (teoria ?? <EnConstruccion />)}
      </div>
    </div>
  )
}

export function EnConstruccion() {
  return <div className="p2-wip">🚧 En construcción</div>
}
