import { useState, useMemo, useCallback } from 'react'
import { MathParagraphs, MathText } from '../../Formula'

// Estado de cada pregunta ('sabida' | 'repasar'), compartido entre todas las páginas.
// Se identifica por un hash del texto de la pregunta, así no depende del orden.
const CLAVE_STORAGE = 'fisica2:p2:preguntas'

function hash(texto) {
  let h = 5381
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

function leerEstados() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) ?? {}
  } catch {
    return {}
  }
}

function useEstados() {
  const [estados, setEstados] = useState(leerEstados)
  const marcar = useCallback((id, valor) => {
    setEstados(prev => {
      const nuevo = { ...prev }
      if (prev[id] === valor) delete nuevo[id]   // tocar de nuevo desmarca
      else nuevo[id] = valor
      try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevo)) } catch { /* sin storage */ }
      return nuevo
    })
  }, [])
  return [estados, marcar]
}

function mezclar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/*
 * preguntas: [{ pregunta, respuesta, tema, origen? }]
 *   origen (opcional): de qué ejercicio viene, se muestra junto al tema.
 * simulacro / onSimulacro (opcionales): modo simulacro controlado desde afuera (p. ej. por la URL).
 *   Si no se pasan, el componente lo maneja solo.
 */
export default function Preguntas({ preguntas, simulacro: simulacroProp, onSimulacro }) {
  const [estados, marcar] = useEstados()
  const [abiertas, setAbiertas] = useState(() => new Set())
  const [soloRepasar, setSoloRepasar] = useState(false)
  const [simulacroLocal, setSimulacroLocal] = useState(false)
  const controlado = simulacroProp !== undefined
  const simulacro = controlado ? simulacroProp : simulacroLocal
  const setSimulacro = v => (controlado ? onSimulacro?.(v) : setSimulacroLocal(v))

  const items = useMemo(() => preguntas.map(p => ({ ...p, id: hash(p.pregunta) })), [preguntas])
  const sabidas = items.filter(p => estados[p.id] === 'sabida').length
  const visibles = soloRepasar ? items.filter(p => estados[p.id] === 'repasar') : items

  const toggle = id => setAbiertas(prev => {
    const s = new Set(prev)
    s.has(id) ? s.delete(id) : s.add(id)
    return s
  })

  if (items.length === 0) return <p className="ap-vacio">Contenido en preparación.</p>

  return (
    <div className="ap-preguntas">
      <div className="ap-preguntas-barra">
        <span className="ap-contador">{sabidas} de {items.length} sabidas</span>
        {!simulacro && (
          <label className="ap-filtro">
            <input type="checkbox" checked={soloRepasar} onChange={e => setSoloRepasar(e.target.checked)} />
            Mostrar solo las de repasar
          </label>
        )}
        <button className="ap-boton" onClick={() => setSimulacro(!simulacro)}>
          {simulacro ? 'Volver a la lista' : 'Modo simulacro'}
        </button>
      </div>

      {simulacro ? (
        <Simulacro items={items} estados={estados} marcar={marcar} />
      ) : visibles.length === 0 ? (
        <p className="ap-vacio">No hay preguntas marcadas para repasar.</p>
      ) : (
        <ol className="ap-lista">
          {visibles.map(p => {
            const abierta = abiertas.has(p.id)
            return (
              <li key={p.id} className="ap-item">
                <button className="ap-pregunta" onClick={() => toggle(p.id)} aria-expanded={abierta}>
                  <MathText>{p.pregunta}</MathText>
                </button>
                <div className="ap-meta">
                  {[p.origen, p.tema].filter(Boolean).join(' · ')}
                  {estados[p.id] && <span> · {estados[p.id] === 'sabida' ? 'sabida' : 'a repasar'}</span>}
                </div>
                {abierta && (
                  <div className="ap-respuesta">
                    <MathParagraphs text={p.respuesta} />
                    <Marcas id={p.id} estado={estados[p.id]} marcar={marcar} />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

function Marcas({ id, estado, marcar }) {
  return (
    <div className="ap-marcas">
      <button className={`ap-marca${estado === 'sabida' ? ' ap-marca--sabida' : ''}`}
              onClick={() => marcar(id, 'sabida')} aria-pressed={estado === 'sabida'}>
        La sabía
      </button>
      <button className={`ap-marca${estado === 'repasar' ? ' ap-marca--repasar' : ''}`}
              onClick={() => marcar(id, 'repasar')} aria-pressed={estado === 'repasar'}>
        Repasar
      </button>
    </div>
  )
}

// Una pregunta al azar por vez, sin repetir hasta agotar el mazo
function Simulacro({ items, estados, marcar }) {
  const [mazo, setMazo] = useState(() => mezclar(items))
  const [pos, setPos] = useState(0)
  const [vuelta, setVuelta] = useState(1)
  const [mostrar, setMostrar] = useState(false)

  const actual = mazo[pos]

  const otra = () => {
    setMostrar(false)
    if (pos + 1 < mazo.length) {
      setPos(pos + 1)
    } else {
      // Nueva vuelta: evitar que la primera sea la misma que la última
      let nuevo = mezclar(items)
      if (nuevo.length > 1 && nuevo[0].id === actual.id) nuevo = [...nuevo.slice(1), nuevo[0]]
      setMazo(nuevo)
      setPos(0)
      setVuelta(v => v + 1)
    }
  }

  return (
    <div className="ap-simulacro">
      <div className="ap-simulacro-progreso">
        Pregunta {pos + 1} de {mazo.length}{vuelta > 1 && ` · vuelta ${vuelta}`}
        {actual.tema && ` · ${[actual.origen, actual.tema].filter(Boolean).join(' · ')}`}
      </div>
      <p className="ap-simulacro-pregunta"><MathText>{actual.pregunta}</MathText></p>

      {mostrar ? (
        <div className="ap-respuesta ap-respuesta--simulacro">
          <MathParagraphs text={actual.respuesta} />
          <Marcas id={actual.id} estado={estados[actual.id]} marcar={marcar} />
        </div>
      ) : (
        <button className="ap-boton" onClick={() => setMostrar(true)}>Mostrar respuesta</button>
      )}

      <div className="ap-simulacro-acciones">
        <button className="ap-boton ap-boton--principal" onClick={otra}>
          {pos + 1 < mazo.length ? 'Otra pregunta' : 'Empezar otra vuelta'}
        </button>
      </div>
    </div>
  )
}
