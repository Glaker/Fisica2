import { useContext, useMemo } from 'react'
import StepperResolucion from '../StepperResolucion'
import TeoriaApunte from './teoria/TeoriaApunte'
import { rutaPreguntas } from '../../navegacion'
import { RutaContext, navegar } from '../../router'
import './Parcial2.css'

/*
 * Estructura común de cada ejercicio del Parcial 2.
 *   enunciado      — JSX (si falta, se muestra "En construcción")
 *   pasos + Visual + ecuaciones — datos para StepperResolucion (si pasos está vacío, "En construcción")
 *   teoria         — { secciones, preguntas } para TeoriaApunte
 *
 * La pestaña interna, el paso de la resolución y la vista de las preguntas salen de la URL
 * (#/parcial2/<ejercicio>/<pestaña>/<paso>, #/parcial2/<ejercicio>/teoria/simulacro/curso),
 * vía RutaContext.
 */
export default function EjercicioLayout({ subtitulo, enunciado, pasos = [], Visual, teoria, ecuaciones }) {
  const ruta = useContext(RutaContext)
  const seccion = ruta?.seccion?.id ?? 'enunciado'
  const pasoInicial = ruta?.paso ? ruta.paso - 1 : 0

  // Desde la teoría: abrir la Resolución en el paso indicado (1-based) y subir al inicio
  const verPaso = paso => {
    navegar(`${ruta.base}/resolucion/${paso}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Preguntas de la teoría con el ejercicio de origen (para el simulacro y el tema)
  const origen = ruta?.tab?.origen
  const preguntas = useMemo(
    () => (teoria?.preguntas ?? []).map(p => ({ ...p, origen })),
    [teoria?.preguntas, origen],
  )
  const onVista = (vista, opciones) => navegar(rutaPreguntas(ruta.rutaTeoria, vista), opciones)

  // Al avanzar pasos se actualiza la URL sin agregar historial (recargar mantiene el paso)
  const alCambiarPaso = i => navegar(`${ruta.base}/resolucion/${i + 1}`, { reemplazar: true })

  return (
    <div className="p2-root">
      {subtitulo && <p className="cc2-subtitle">{subtitulo}</p>}

      <div className="p2-panel" role="tabpanel">
        {seccion === 'enunciado' && (
          <>
            {enunciado ?? <EnConstruccion />}
            {pasos.length > 0 && (
              <div className="p2-ver-resolucion">
                <button className="p2-btn-resolucion" onClick={() => verPaso(1)}>
                  Ver resolución →
                </button>
              </div>
            )}
          </>
        )}
        {seccion === 'resolucion' && (
          pasos.length > 0
            ? <StepperResolucion pasos={pasos} Visual={Visual} ecuaciones={ecuaciones}
                                 pasoInicial={pasoInicial} onPasoChange={alCambiarPaso} />
            : <EnConstruccion />
        )}
        {seccion === 'teoria' && (
          <TeoriaApunte
            secciones={teoria?.secciones ?? []}
            preguntas={preguntas}
            onVerPaso={pasos.length > 0 ? verPaso : undefined}
            vista={ruta?.vista ?? 'lista'}
            onVista={onVista}
          />
        )}
      </div>
    </div>
  )
}

export function EnConstruccion() {
  return <div className="p2-wip">🚧 En construcción</div>
}
