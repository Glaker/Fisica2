import { useState, useEffect, useRef } from 'react'
import Formula, { MathParagraphs } from '../../Formula'
import Preguntas from './Preguntas'
import './Teoria.css'

/*
 * Apunte de teoría: secciones numeradas + "Preguntas del profe", con índice lateral.
 *
 * secciones: [{
 *   id, titulo,
 *   formula?:     string LaTeX o array,
 *   queDice, deDondeViene, cuandoSirve,   // texto con $...$, **negrita**, listas "- " y "1) "
 *   enElParcial?: { texto, paso },        // paso 1-based de la Resolución
 *   nota?:        texto (nota al margen)
 * }]
 * preguntas: [{ pregunta, respuesta, tema, origen? }]
 * onVerPaso(paso): si está, muestra el link "Ver en la resolución →"
 * simulacro / onSimulacro: modo simulacro controlado (ver Preguntas). Si el apunte se abre
 *   con el simulacro activo, se baja directo hasta las preguntas.
 */
const BLOQUES = [
  ['queDice', 'Qué dice'],
  ['deDondeViene', 'De dónde viene'],
  ['cuandoSirve', 'Cuándo sirve'],
]

const ID_PREGUNTAS = 'preguntas'

export default function TeoriaApunte({
  secciones, preguntas, onVerPaso, tituloPreguntas = 'Preguntas del profe', simulacro, onSimulacro,
}) {
  const entradas = [
    ...secciones.map((s, i) => ({ id: s.id, titulo: s.titulo, n: i + 1 })),
    ...(preguntas.length ? [{ id: ID_PREGUNTAS, titulo: tituloPreguntas, n: secciones.length + 1 }] : []),
  ]
  const [activa, setActiva] = useState(entradas[0]?.id)
  const [indiceAbierto, setIndiceAbierto] = useState(false)
  const refs = useRef({})

  // Resalta en el índice la última sección cuyo título ya pasó el borde superior (+ margen)
  const claveEntradas = entradas.map(e => e.id).join('|')
  useEffect(() => {
    const alScrollear = () => {
      let actual = entradas[0]?.id
      for (const { id } of entradas) {
        const el = refs.current[id]
        if (el && el.getBoundingClientRect().top <= 140) actual = id
      }
      setActiva(actual)
    }
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [claveEntradas])

  // Abierto directo en modo simulacro: bajar a las preguntas (después del scroll a 0 de la página)
  useEffect(() => {
    if (!simulacro) return
    const id = requestAnimationFrame(() => {
      refs.current[ID_PREGUNTAS]?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, []) // solo al montar

  const ir = id => {
    refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIndiceAbierto(false)
  }

  if (entradas.length === 0) return <p className="ap-vacio">Contenido en preparación.</p>

  const listaIndice = (
    <ol className="ap-indice-lista">
      {entradas.map(({ id, titulo, n }) => (
        <li key={id}>
          <button className={`ap-indice-item${activa === id ? ' ap-indice-item--activo' : ''}`}
                  onClick={() => ir(id)} aria-current={activa === id ? 'location' : undefined}>
            <span className="ap-indice-n">{n}</span>{titulo}
          </button>
        </li>
      ))}
    </ol>
  )

  return (
    <div className="ap-root">
      {/* Índice en pantallas angostas: desplegable arriba */}
      <details className="ap-indice-movil" open={indiceAbierto}
               onToggle={e => setIndiceAbierto(e.currentTarget.open)}>
        <summary>Índice</summary>
        {listaIndice}
      </details>

      <article className="ap-texto">
        {secciones.length === 0 && <p className="ap-vacio">Contenido en preparación.</p>}

        {secciones.map((s, i) => (
          <section key={s.id} className="ap-seccion" ref={el => { refs.current[s.id] = el }}>
            <h3 className="ap-titulo"><span className="ap-titulo-n">{i + 1}</span>{s.titulo}</h3>

            {s.formula && (
              <div className="ap-formula">
                {[].concat(s.formula).map((tex, j) => <Formula key={j} tex={tex} block />)}
              </div>
            )}

            {BLOQUES.map(([clave, rotulo]) => s[clave] && (
              <div key={clave} className="ap-bloque">
                <div className="ap-rotulo">{rotulo}</div>
                <MathParagraphs text={s[clave]} />
              </div>
            ))}

            {s.enElParcial && (
              <div className="ap-bloque">
                <div className="ap-rotulo">En el parcial</div>
                <MathParagraphs text={s.enElParcial.texto} />
                {onVerPaso && s.enElParcial.paso && (
                  <button className="ap-link" onClick={() => onVerPaso(s.enElParcial.paso)}>
                    Ver en la resolución →
                  </button>
                )}
              </div>
            )}

            {s.nota && (
              <aside className="ap-nota"><MathParagraphs text={s.nota} /></aside>
            )}
          </section>
        ))}

        {preguntas.length > 0 && (
          <section className="ap-seccion" ref={el => { refs.current[ID_PREGUNTAS] = el }}>
            <h3 className="ap-titulo">
              <span className="ap-titulo-n">{secciones.length + 1}</span>{tituloPreguntas}
            </h3>
            <Preguntas preguntas={preguntas} simulacro={simulacro} onSimulacro={onSimulacro} />
          </section>
        )}
      </article>

      {/* Índice lateral (pantallas anchas) */}
      <nav className="ap-indice" aria-label="Índice de la teoría">
        <div className="ap-indice-titulo">Índice</div>
        {listaIndice}
      </nav>
    </div>
  )
}
