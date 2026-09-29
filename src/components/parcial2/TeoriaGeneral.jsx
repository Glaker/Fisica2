import { useContext } from 'react'
import TeoriaApunte from './teoria/TeoriaApunte'
import { RutaContext, navegar } from '../../router'
import { RUTA_SIMULACRO } from '../../navegacion'
import * as general from './teoria/teoriaGeneral'
import * as t1a from './teoria/teoria1a'
import * as t1b from './teoria/teoria1b'
import * as t2 from './teoria/teoria2'
import './Parcial2.css'

// Todas las preguntas del parcial, con el ejercicio de origen para mostrarlo junto al tema
const TODAS_LAS_PREGUNTAS = [
  ...t1a.PREGUNTAS.map(p => ({ ...p, origen: '1-a' })),
  ...t1b.PREGUNTAS.map(p => ({ ...p, origen: '1-b' })),
  ...t2.PREGUNTAS.map(p => ({ ...p, origen: '2' })),
  ...general.PREGUNTAS.map(p => ({ ...p, origen: 'General' })),
]

export default function TeoriaGeneral() {
  // El modo simulacro sigue a la URL (#/parcial2/teoria/simulacro): se puede linkear y "atrás" lo cierra
  const ruta = useContext(RutaContext)
  const simulacro = Boolean(ruta?.simulacro)
  const onSimulacro = activo => navegar(activo ? RUTA_SIMULACRO : '/parcial2/teoria')

  return (
    <div className="p2-root">
      <h2>Teoría general</h2>
      <p className="cc2-subtitle">
        Conceptos comunes a todo el parcial y simulacro con las preguntas de los tres ejercicios.
      </p>
      <TeoriaApunte
        secciones={general.SECCIONES}
        preguntas={TODAS_LAS_PREGUNTAS}
        tituloPreguntas="Simulacro: todas las preguntas"
        simulacro={simulacro}
        onSimulacro={onSimulacro}
      />
    </div>
  )
}
