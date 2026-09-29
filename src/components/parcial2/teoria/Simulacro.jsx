import { useState, useEffect, useRef } from 'react'
import { MathParagraphs, MathText } from '../../Formula'
import {
  ESTADOS, SIN_VER, contar, plural, pasaFiltro, mezclar, BarraEstados, Punto,
} from './estadoPreguntas'

const SEGUNDOS = 60
// "No la sabía" vuelve a aparecer esta cantidad de preguntas más adelante (una sola vez)
const DISTANCIA_REPETICION = 3

const FILTROS = [
  { id: 'todas',   label: 'Todas' },
  { id: 'repasar', label: 'Solo para repasar' },
  { id: SIN_VER,   label: 'Solo sin ver' },
]
const CANTIDADES = [10, 20, 'todas']

/*
 * Un simulacro: cola de preguntas + posición. Las repeticiones se agregan a la cola,
 * así "Pregunta 4 de 11" se ajusta solo.
 *   cola:     [{ p, repetida }]
 *   primeras: { [id]: estado } — la primera respuesta a cada pregunta (la que cuenta en el resumen)
 */
export function nuevaSesion(items, tiempo) {
  return {
    clave: Date.now(),
    cola: mezclar(items).map(p => ({ p, repetida: false })),
    pos: 0,
    primeras: {},
    tiempo,
  }
}

// Campos de texto: ahí los atajos no se aplican
function enCampoDeTexto(el) {
  return el?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName)
}

// ── Configuración ───────────────────────────────────────────────────────────
export function ConfigSimulacro({ items, origenes, estados, config, setConfig, onEmpezar, onLista }) {
  const set = cambios => setConfig(c => ({ ...c, ...cambios }))
  const toggleOrigen = o => set({
    origenes: config.origenes.includes(o)
      ? config.origenes.filter(x => x !== o)
      : origenes.filter(x => x === o || config.origenes.includes(x)),   // mantiene el orden
  })

  const disponibles = items.filter(p =>
    (!p.origen || config.origenes.includes(p.origen)) && pasaFiltro(config.filtro, estados[p.id]))
  const n = disponibles.length
  const cantidad = config.cantidad === 'todas' ? n : Math.min(config.cantidad, n)

  const empezar = () => onEmpezar(mezclar(disponibles).slice(0, cantidad))

  return (
    <div className="ap-config">
      <div className="ap-sim-cabecera">
        <h4 className="ap-config-titulo">Simulacro</h4>
        <button className="ap-link ap-link--suave" onClick={onLista}>Volver a la lista</button>
      </div>

      {origenes.length > 0 && (
        <fieldset className="ap-config-grupo">
          <legend className="ap-rotulo">Temas</legend>
          {origenes.map(o => (
            <label key={o} className="ap-opcion">
              <input type="checkbox" checked={config.origenes.includes(o)} onChange={() => toggleOrigen(o)} />
              {o}
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className="ap-config-grupo">
        <legend className="ap-rotulo">Qué preguntas</legend>
        {FILTROS.map(f => (
          <label key={f.id} className="ap-opcion">
            <input type="radio" name="ap-config-filtro" checked={config.filtro === f.id}
                   onChange={() => set({ filtro: f.id })} />
            {f.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="ap-config-grupo">
        <legend className="ap-rotulo">Cantidad</legend>
        {CANTIDADES.map(c => (
          <label key={c} className="ap-opcion">
            <input type="radio" name="ap-config-cantidad" checked={config.cantidad === c}
                   onChange={() => set({ cantidad: c })} />
            {c === 'todas' ? 'Todas' : c}
          </label>
        ))}
      </fieldset>

      <fieldset className="ap-config-grupo">
        <legend className="ap-oculto">Tiempo</legend>
        <label className="ap-opcion">
          <input type="checkbox" checked={config.tiempo} onChange={e => set({ tiempo: e.target.checked })} />
          Con tiempo: {SEGUNDOS} s por pregunta
        </label>
      </fieldset>

      <div className="ap-config-accion">
        <button className="ap-boton ap-boton--principal" onClick={empezar} disabled={n === 0}>
          Empezar
        </button>
        <p className="ap-config-disponibles" aria-live="polite">
          {n === 0
            ? 'Ninguna pregunta cumple esta selección.'
            : <>
                {plural(n, 'pregunta disponible', 'preguntas disponibles')}
                {cantidad < n && ` · se toman ${cantidad} al azar`}
              </>}
        </p>
      </div>
    </div>
  )
}

// ── Simulacro en curso ──────────────────────────────────────────────────────
export function Simulacro({ sesion, setSesion, marcar, mostrarOrigen, onRepasar, onNuevo, onLista }) {
  const terminado = sesion.pos >= sesion.cola.length

  // Escape sale (también desde el resumen)
  useEffect(() => {
    const alTecla = e => {
      if (e.key !== 'Escape' || e.defaultPrevented || enCampoDeTexto(e.target)) return
      e.preventDefault()
      onLista()
    }
    window.addEventListener('keydown', alTecla)
    return () => window.removeEventListener('keydown', alTecla)
  }, [onLista])

  const responder = valor => {
    const { pos } = sesion
    const { p, repetida } = sesion.cola[pos]
    marcar(p.id, valor)
    setSesion(s => {
      if (s.pos !== pos) return s   // doble toque: ya se respondió
      const cola = [...s.cola]
      if (!repetida && valor === 'no-sabida') {
        cola.splice(Math.min(s.pos + DISTANCIA_REPETICION, cola.length), 0, { p, repetida: true })
      } else if (!repetida && valor === 'a-medias') {
        cola.push({ p, repetida: true })
      }
      const primeras = p.id in s.primeras ? s.primeras : { ...s.primeras, [p.id]: valor }
      return { ...s, cola, pos: s.pos + 1, primeras }
    })
  }

  return (
    <div className="ap-sim">
      {terminado ? (
        <Resumen sesion={sesion} onRepasar={onRepasar} onNuevo={onNuevo} onLista={onLista} />
      ) : (
        <Tarjeta
          key={`${sesion.clave}-${sesion.pos}`}
          item={sesion.cola[sesion.pos]}
          numero={sesion.pos + 1}
          total={sesion.cola.length}
          tiempo={sesion.tiempo}
          mostrarOrigen={mostrarOrigen}
          onResponder={responder}
          onSalir={onLista}
        />
      )}
    </div>
  )
}

function Tarjeta({ item, numero, total, tiempo, mostrarOrigen, onResponder, onSalir }) {
  const { p } = item
  const [mostrada, setMostrada] = useState(false)
  const [agotado, setAgotado] = useState(false)
  const preguntaRef = useRef(null)
  const respuestaRef = useRef(null)

  // Cada pregunta nueva toma el foco (el teclado sigue desde acá y el lector la anuncia)
  useEffect(() => { preguntaRef.current?.focus({ preventScroll: true }) }, [])

  const mostrar = () => {
    setMostrada(true)
    requestAnimationFrame(() => respuestaRef.current?.focus({ preventScroll: true }))
  }

  // Atajos: espacio muestra la respuesta; 1, 2, 3 responden
  useEffect(() => {
    const alTecla = e => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || enCampoDeTexto(e.target)) return
      if (!mostrada && e.key === ' ') {
        // Sobre un botón o link, el espacio hace lo suyo
        if (e.target.closest?.('button, a, summary, [role="button"]')) return
        e.preventDefault()
        mostrar()
      } else if (mostrada && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault()
        onResponder(ESTADOS[Number(e.key) - 1].id)
      }
    }
    window.addEventListener('keydown', alTecla)
    return () => window.removeEventListener('keydown', alTecla)
  })

  return (
    <article className="ap-sim-tarjeta" aria-label={`Pregunta ${numero} de ${total}`}>
      <div className="ap-sim-cabecera">
        <span className="ap-sim-numero">Pregunta {numero} de {total}</span>
        <span className="ap-sim-derecha">
          <span className="ap-sim-tema">
            {[mostrarOrigen && p.origen, p.tema].filter(Boolean).join(' · ')}
          </span>
          <button className="ap-link ap-link--suave" onClick={onSalir} aria-keyshortcuts="Escape">
            Salir del simulacro
          </button>
        </span>
      </div>
      <div className="ap-sim-progreso" aria-hidden="true">
        <span style={{ width: `${((numero - 1) / total) * 100}%` }} />
      </div>

      <h4 className="ap-sim-pregunta" tabIndex={-1} ref={preguntaRef}>
        <MathText>{p.pregunta}</MathText>
      </h4>
      <p className="ap-sim-ayuda">Respondé en voz alta antes de ver la respuesta.</p>

      {tiempo && (
        <div className={`ap-sim-tiempo${agotado ? ' ap-sim-tiempo--agotado' : ''}`}>
          <div className="ap-sim-tiempo-pista" aria-hidden="true">
            <span className="ap-sim-tiempo-barra"
                  style={{ animationDuration: `${SEGUNDOS}s`, animationPlayState: mostrada ? 'paused' : 'running' }}
                  onAnimationEnd={() => setAgotado(true)} />
          </div>
          <span className="ap-sim-tiempo-texto" role="status">{agotado ? 'Tiempo' : ''}</span>
        </div>
      )}

      {!mostrada ? (
        <button className="ap-boton ap-sim-mostrar" onClick={mostrar}>
          Mostrar respuesta <kbd className="ap-atajo">espacio</kbd>
        </button>
      ) : (
        <div className="ap-sim-respuesta">
          <div className="ap-sim-respuesta-texto" tabIndex={-1} ref={respuestaRef}>
            <MathParagraphs text={p.respuesta} />
          </div>
          <div className="ap-sim-botones" role="group" aria-label="¿La sabías?">
            {ESTADOS.map((e, i) => (
              <button key={e.id} className="ap-sim-boton" onClick={() => onResponder(e.id)}
                      aria-keyshortcuts={String(i + 1)}>
                <Punto estado={e.id} />
                <span>{e.boton}</span>
                <kbd className="ap-atajo">{i + 1}</kbd>
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

// ── Resumen ─────────────────────────────────────────────────────────────────
function Resumen({ sesion, onRepasar, onNuevo, onLista }) {
  const tituloRef = useRef(null)
  useEffect(() => { tituloRef.current?.focus({ preventScroll: true }) }, [])

  const { primeras } = sesion
  const unicas = sesion.cola.filter(c => !c.repetida).map(c => c.p)
  const estadoDe = p => primeras[p.id]
  const cuentas = contar(unicas, estadoDe)

  // Por origen + tema ("1-a · Resultado"), de peor a mejor: primero la proporción de sabidas,
  // después la de "a medias"
  const grupos = new Map()
  for (const p of unicas) {
    const tema = [p.origen, p.tema ?? 'Sin tema'].filter(Boolean).join(' · ')
    if (!grupos.has(tema)) grupos.set(tema, [])
    grupos.get(tema).push(p)
  }
  const temas = [...grupos].map(([tema, ps]) => ({ tema, total: ps.length, cuentas: contar(ps, estadoDe) }))
  const puntaje = t => (t.cuentas.sabida + t.cuentas['a-medias'] / 2) / t.total
  temas.sort((a, b) => a.cuentas.sabida / a.total - b.cuentas.sabida / b.total || puntaje(a) - puntaje(b))

  const falladas = ['no-sabida', 'a-medias'].flatMap(e => unicas.filter(p => primeras[p.id] === e))

  return (
    <div className="ap-sim-tarjeta ap-sim-resumen">
      <div className="ap-sim-cabecera">
        <h4 className="ap-config-titulo" tabIndex={-1} ref={tituloRef}>Resultado</h4>
      </div>
      <p className="ap-resumen-texto">
        {cuentas.sabida} de {unicas.length} {unicas.length === 1 ? 'sabida' : 'sabidas'}
        {' · '}{cuentas['a-medias']} a medias · {cuentas['no-sabida']} no
      </p>
      <BarraEstados cuentas={cuentas} />

      <div className="ap-rotulo ap-sim-subtitulo">Por tema</div>
      <ul className="ap-temas">
        {temas.map(t => (
          <li key={t.tema} className="ap-tema">
            <span className="ap-tema-nombre">{t.tema}</span>
            <BarraEstados cuentas={t.cuentas} className="ap-tema-barra" />
            <span className="ap-tema-n">{t.cuentas.sabida}/{t.total}</span>
          </li>
        ))}
      </ul>

      {falladas.length > 0 && (
        <>
          <div className="ap-rotulo ap-sim-subtitulo">Para repasar</div>
          <ul className="ap-falladas">
            {falladas.map(p => (
              <li key={p.id}>
                <details className="ap-fallada">
                  <summary>
                    <Punto estado={primeras[p.id]} />
                    <span className="ap-fallada-texto">
                      <MathText>{p.pregunta}</MathText>
                      <span className="ap-meta">
                        {ESTADOS.find(e => e.id === primeras[p.id]).nombre}
                      </span>
                    </span>
                  </summary>
                  <div className="ap-respuesta">
                    <MathParagraphs text={p.respuesta} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="ap-sim-acciones">
        {falladas.length > 0 && (
          <button className="ap-boton ap-boton--principal" onClick={() => onRepasar(falladas)}>
            Repasar estas
          </button>
        )}
        <button className="ap-boton" onClick={onNuevo}>Nuevo simulacro</button>
        <button className="ap-link ap-link--suave" onClick={onLista}>Volver a la lista</button>
      </div>
    </div>
  )
}
