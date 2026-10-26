import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Formula, { MathText, MathParagraphs } from './Formula'
import './StepperResolucion.css'

/*
 * Layout de resolución paso a paso.
 *
 * Props:
 *   pasos  — array de objetos:
 *     {
 *       titulo:   'Ley de Ampère',                       // obligatorio
 *       texto:    'Explicación... admite $x^2$ inline',  // párrafos separados por \n\n
 *       formula:  '\\oint \\vec B \\cdot d\\vec l = \\mu_0 I_{enc}',   // string LaTeX o array de strings
 *       simbolos: [{ simbolo: '\\mu_0', significado: 'Permeabilidad del vacío' }],
 *       origen:   'Texto de "¿De dónde sale?" (opcional)',
 *       pregunta: 'Pregunta de defensa' | { pregunta, respuesta }   (opcional)
 *     }
 *   Visual — componente que recibe `paso` (índice activo, base 0) y dibuja el gráfico.
 *   pasoInicial — índice (base 0) con el que arranca; por defecto el primero.
 *   onPasoChange(i) — se llama cuando el usuario cambia de paso (no al montar).
 */
export default function StepperResolucion({ pasos, Visual, pasoInicial = 0, onPasoChange }) {
  const [paso, setPaso] = useState(() => Math.min(Math.max(pasoInicial, 0), Math.max(pasos.length - 1, 0)))
  const rootRef = useRef(null)
  const firstRender = useRef(true)

  /*
   * Alto fijo: antes del primer pintado se recorren todos los pasos (en useLayoutEffect, sin
   * parpadeo), se mide el alto del layout en cada uno y se fija el máximo como alto mínimo.
   * Así la caja no cambia de tamaño y Anterior / Siguiente quedan siempre en el mismo lugar.
   * `midiendo` = índice del paso que se está midiendo (null = no se está midiendo).
   */
  const [alto, setAlto] = useState(null)
  const [midiendo, setMidiendo] = useState(0)
  const maxAlto = useRef(0)
  const total = pasos?.length ?? 0

  useLayoutEffect(() => {
    if (midiendo == null) return
    maxAlto.current = Math.max(maxAlto.current, rootRef.current?.offsetHeight ?? 0)
    if (midiendo + 1 < total) setMidiendo(midiendo + 1)
    else { setAlto(maxAlto.current); setMidiendo(null) }
  }, [midiendo, total])

  // Al cambiar el ancho de la ventana o terminar de cargar las fuentes, se vuelve a medir
  useEffect(() => {
    const remedir = () => { maxAlto.current = 0; setAlto(null); setMidiendo(0) }
    let ancho = window.innerWidth
    let timer
    const alCambiarTamano = () => {
      if (window.innerWidth === ancho) return
      ancho = window.innerWidth
      clearTimeout(timer)
      timer = setTimeout(remedir, 250)
    }
    window.addEventListener('resize', alCambiarTamano)
    document.fonts?.ready.then(remedir)
    return () => { window.removeEventListener('resize', alCambiarTamano); clearTimeout(timer) }
  }, [])

  // Al cambiar de paso, si el comienzo del stepper quedó fuera de pantalla, volver arriba
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    onPasoChange?.(paso)
    const el = rootRef.current
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [paso])

  if (!pasos?.length) return null

  const pasoVista = midiendo ?? paso   // durante la medición se muestran todos los pasos en orden
  const actual = pasos[pasoVista]
  const formulas = actual.formula == null ? []
    : Array.isArray(actual.formula) ? actual.formula : [actual.formula]
  const pregunta = typeof actual.pregunta === 'string'
    ? { pregunta: actual.pregunta } : actual.pregunta

  return (
    <div className="stp-root" ref={rootRef} style={alto != null && midiendo == null ? { '--stp-alto': `${alto}px` } : undefined}>
      <div className="stp-visual">
        {Visual ? <Visual paso={pasoVista} /> : <div className="stp-visual-empty">Visualización</div>}
      </div>

      <div className="stp-side">
        <nav className="stp-nav" aria-label="Pasos de la resolución">
          {pasos.map((p, i) => (
            <button
              key={i}
              className={`stp-num${i === pasoVista ? ' stp-num--active' : ''}${i < pasoVista ? ' stp-num--done' : ''}`}
              onClick={() => setPaso(i)}
              title={p.titulo}
              aria-current={i === pasoVista ? 'step' : undefined}
            >
              {i + 1}
            </button>
          ))}
        </nav>

        {/* key → al cambiar de paso se cierran los desplegables */}
        <article className="stp-card" key={pasoVista}>
          <div className="stp-card-kicker">Paso {pasoVista + 1} de {pasos.length}</div>
          <h3 className="stp-card-title"><MathText>{actual.titulo}</MathText></h3>

          {actual.texto && (
            <div className="stp-text"><MathParagraphs text={actual.texto} /></div>
          )}

          {formulas.length > 0 && (
            <div className="stp-formula">
              {formulas.some(f => f.includes('\\hl{')) && (
                <div className="stp-hl-leyenda"><span className="hl">resaltado</span> = lo que cambia respecto del paso anterior</div>
              )}
              {formulas.map((tex, i) => <Formula key={i} tex={tex} block />)}
            </div>
          )}

          {actual.simbolos?.length > 0 && (
            <Desplegable titulo="¿Qué es cada símbolo?">
              <dl className="stp-symbols">
                {actual.simbolos.map(({ simbolo, significado }, i) => (
                  <div key={i} className="stp-symbol-row">
                    <dt><Formula tex={simbolo} /></dt>
                    <dd><MathText>{significado}</MathText></dd>
                  </div>
                ))}
              </dl>
            </Desplegable>
          )}

          {actual.origen && (
            <Desplegable titulo="¿De dónde sale?">
              <MathParagraphs text={actual.origen} />
            </Desplegable>
          )}

          {pregunta && <PreguntaDefensa {...pregunta} />}

          <div className="stp-controls">
            <button
              className="tab-btn"
              onClick={() => setPaso(p => p - 1)}
              disabled={paso === 0}
            >
              ← Anterior
            </button>
            <button
              className="tab-btn active"
              onClick={() => setPaso(p => p + 1)}
              disabled={paso === pasos.length - 1}
            >
              Siguiente →
            </button>
          </div>
        </article>
      </div>
    </div>
  )
}

function Desplegable({ titulo, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="cc2-accordion-item stp-collapse">
      <button className="cc2-accordion-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{titulo}</span>
        <span className="cc2-chevron">{open ? '▼' : '▶'}</span>
      </button>
      {open && <div className="cc2-accordion-body">{children}</div>}
    </div>
  )
}

function PreguntaDefensa({ pregunta, respuesta }) {
  const [open, setOpen] = useState(false)
  return (
    <aside className="stp-defensa">
      <div className="stp-defensa-label">Pregunta de defensa</div>
      <p className="stp-defensa-q"><MathText>{pregunta}</MathText></p>
      {respuesta && (
        <>
          <button className="stp-defensa-toggle" onClick={() => setOpen(o => !o)}>
            {open ? 'Ocultar respuesta' : 'Ver respuesta'}
          </button>
          {open && <div className="stp-defensa-a"><MathParagraphs text={respuesta} /></div>}
        </>
      )}
    </aside>
  )
}
