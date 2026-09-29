import { useState } from 'react'
import Formula from '../Formula'

// Piezas comunes de la pestaña Enunciado de los ejercicios del Parcial 2.

export function Cita({ children }) {
  return <blockquote className="p2-cita">{children}</blockquote>
}

export function Nota({ children }) {
  return <p className="p2-nota">{children}</p>
}

export function Seccion({ titulo, children }) {
  return (
    <>
      <h3 className="cc2-section-title">{titulo}</h3>
      {children}
    </>
  )
}

// filas: [{ tex, que, unidad }]
export function TablaSimbolos({ filas }) {
  return (
    <div className="cc-table-wrap">
      <table className="cc-table p2-tabla">
        <thead>
          <tr><th>Símbolo</th><th>Qué es</th><th>Unidad</th></tr>
        </thead>
        <tbody>
          {filas.map(({ tex, que, unidad }) => (
            <tr key={tex}>
              <td><Formula tex={tex} /></td>
              <td className="p2-tabla-que">{que}</td>
              <td>{unidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// tarjetas: [{ titulo, contenido (JSX) }]
export function TarjetasPide({ tarjetas }) {
  return (
    <div className="p2-pide">
      {tarjetas.map(({ titulo, contenido }) => (
        <div key={titulo} className="fs-card">
          <div className="fs-card-title">{titulo}</div>
          <p>{contenido}</p>
        </div>
      ))}
    </div>
  )
}

// items: [{ id, chip, texto }] — un chip abierto por vez
export function Suposiciones({ items }) {
  const [abierta, setAbierta] = useState(null)
  const sup = items.find(s => s.id === abierta)
  return (
    <>
      <div className="p2-chips">
        {items.map(({ id, chip }) => (
          <button
            key={id}
            className={`p2-chip${abierta === id ? ' p2-chip--active' : ''}`}
            onClick={() => setAbierta(a => a === id ? null : id)}
            aria-expanded={abierta === id}
          >
            {chip}
          </button>
        ))}
      </div>
      {sup && <div className="p2-chip-body">{sup.texto}</div>}
    </>
  )
}
