import { useState, useMemo, useEffect, useRef } from 'react'
import { MathParagraphs, MathText } from '../../Formula'
import {
  ESTADOS, SIN_VER, useEstados, hash, contar, plural, pasaFiltro, BarraEstados, Punto,
} from './estadoPreguntas'
import { ConfigSimulacro, Simulacro, nuevaSesion } from './Simulacro'

const FILTROS = [
  { id: 'todas',   label: 'Todas' },
  { id: 'repasar', label: 'Para repasar' },
  { id: SIN_VER,   label: 'Sin ver' },
]

const VACIO = {
  repasar: 'No hay preguntas para repasar.',
  [SIN_VER]: 'No quedan preguntas sin ver.',
}

/*
 * preguntas: [{ pregunta, respuesta, tema, origen? }]
 *   origen (opcional): de qué ejercicio viene ('1-a', '1-b', '2', 'General'); sirve para
 *   elegir temas en el simulacro y se muestra junto al tema.
 * vista / onVista(vista, { reemplazar }) (opcionales): 'lista' | 'config' | 'curso', controlada
 *   desde afuera (p. ej. por la URL). Si no se pasan, el componente la maneja solo.
 */
export default function Preguntas({ preguntas, vista: vistaProp, onVista }) {
  const [estados, marcar] = useEstados()
  const [vistaLocal, setVistaLocal] = useState('lista')
  const controlado = vistaProp !== undefined
  const vista = controlado ? vistaProp : vistaLocal
  const irA = (v, opciones) => (controlado ? onVista?.(v, opciones) : setVistaLocal(v))

  const items = useMemo(() => preguntas.map(p => ({ ...p, id: hash(p.pregunta) })), [preguntas])
  const origenes = useMemo(() => [...new Set(items.map(p => p.origen).filter(Boolean))], [items])

  // La configuración y el simulacro en curso viven acá: sobreviven a ir y volver con "atrás"
  const [config, setConfig] = useState(() => ({
    origenes, filtro: 'todas', cantidad: 10, tiempo: false,
  }))
  const [sesion, setSesion] = useState(null)

  // En .../simulacro/curso sin un simulacro en memoria (p. ej. al recargar): a la configuración
  useEffect(() => {
    if (vista === 'curso' && !sesion) irA('config', { reemplazar: true })
  })

  // Al cambiar de vista, si el comienzo de las preguntas quedó arriba de la pantalla, subir hasta ahí
  const raizRef = useRef(null)
  const vistaAnterior = useRef(vista)
  useEffect(() => {
    if (vistaAnterior.current === vista) return
    vistaAnterior.current = vista
    const el = raizRef.current
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' })
  }, [vista])

  const empezar = lista => {
    setSesion(nuevaSesion(lista, config.tiempo))
    irA('curso')
  }

  if (items.length === 0) return <p className="ap-vacio">Contenido en preparación.</p>

  return (
    <div className="ap-preguntas" ref={raizRef}>
      {vista === 'config' ? (
        <ConfigSimulacro
          items={items} origenes={origenes} estados={estados}
          config={config} setConfig={setConfig}
          onEmpezar={empezar} onLista={() => irA('lista')}
        />
      ) : vista === 'curso' && sesion ? (
        <Simulacro
          sesion={sesion} setSesion={setSesion} marcar={marcar}
          mostrarOrigen={origenes.length > 0}
          onRepasar={lista => setSesion(nuevaSesion(lista, sesion.tiempo))}
          onNuevo={() => irA('config')}
          onLista={() => irA('lista')}
        />
      ) : vista === 'lista' ? (
        <Lista items={items} estados={estados} marcar={marcar}
               mostrarOrigen={origenes.length > 1} onSimulacro={() => irA('config')} />
      ) : null}
    </div>
  )
}

function Lista({ items, estados, marcar, mostrarOrigen, onSimulacro }) {
  const [abiertas, setAbiertas] = useState(() => new Set())
  const [filtro, setFiltro] = useState('todas')

  const cuentas = contar(items, p => estados[p.id])
  const visibles = items.filter(p => pasaFiltro(filtro, estados[p.id]))

  const toggle = id => setAbiertas(prev => {
    const s = new Set(prev)
    s.has(id) ? s.delete(id) : s.add(id)
    return s
  })

  return (
    <>
      <div className="ap-resumen">
        <p className="ap-resumen-texto">
          {plural(cuentas.sabida, 'sabida', 'sabidas')} · {cuentas['a-medias']} a medias
          · {cuentas['no-sabida']} para repasar · {cuentas[SIN_VER]} sin ver
        </p>
        <BarraEstados cuentas={cuentas} />
      </div>

      <div className="ap-preguntas-barra">
        <fieldset className="ap-filtros">
          <legend className="ap-oculto">Mostrar</legend>
          {FILTROS.map(f => (
            <label key={f.id} className="ap-opcion">
              <input type="radio" name="ap-filtro" value={f.id}
                     checked={filtro === f.id} onChange={() => setFiltro(f.id)} />
              {f.label}
            </label>
          ))}
        </fieldset>
        <button className="ap-boton" onClick={onSimulacro}>Modo simulacro</button>
      </div>

      {visibles.length === 0 ? (
        <p className="ap-vacio">{VACIO[filtro]}</p>
      ) : (
        <ul className="ap-lista">
          {visibles.map(p => {
            const abierta = abiertas.has(p.id)
            const estado = estados[p.id]
            return (
              <li key={p.id} className="ap-item">
                <Punto estado={estado} />
                <div className="ap-item-cuerpo">
                  <button className="ap-pregunta" onClick={() => toggle(p.id)} aria-expanded={abierta}>
                    <MathText>{p.pregunta}</MathText>
                  </button>
                  <div className="ap-meta">
                    {[mostrarOrigen && p.origen, p.tema, ESTADOS.find(e => e.id === estado)?.nombre]
                      .filter(Boolean).join(' · ')}
                  </div>
                  {abierta && (
                    <div className="ap-respuesta">
                      <MathParagraphs text={p.respuesta} />
                      <Marcas id={p.id} estado={estado} marcar={marcar} />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

// Botones de texto chicos debajo de cada respuesta. Tocar el marcado de nuevo lo desmarca.
function Marcas({ id, estado, marcar }) {
  return (
    <div className="ap-marcas">
      {[...ESTADOS].reverse().map(e => (
        <button key={e.id}
                className={`ap-marca${estado === e.id ? ` ap-marca--activa ap-texto--${e.id}` : ''}`}
                onClick={() => marcar(id, e.id, { alternar: true })}
                aria-pressed={estado === e.id}>
          {e.boton}
        </button>
      ))}
    </div>
  )
}
