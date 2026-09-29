import { useState, useEffect, useRef } from 'react'
import {
  ComposedChart, LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceDot,
} from 'recharts'
import { Lectura, Lecturas } from '../Lectura'
import { fmt } from '../formato'
import CircuitoSVG from './CircuitoSVG'
import { TAU, Q_CAP, I_0, I_INF, qDescarga, iDescarga, pR2, eR2 } from './datos'

const T_FIN_MS = 40               // rango del slider de la descarga
const VEL_MS_POR_S = 5            // con play: 5 ms simulados por segundo real
const TAU_MS = TAU * 1000
const PX_POR_A = 80               // régimen: los puntitos avanzan 80 px/s por cada ampere
const PX_POR_MC = 80              // descarga: avance ∝ carga que ya circuló (se frenan solos)

const TIEMPOS_MS = Array.from({ length: 201 }, (_, k) => (k * T_FIN_MS) / 200)
const DATOS_Q = TIEMPOS_MS.map(t => ({ t, q: qDescarga(t / 1000) * 1000 }))

// Corriente con unidad: por debajo de 0,1 A se muestra en mA
const fmtCorriente = i => (Math.abs(i) < 0.1 ? `${fmt(i * 1000, 1)} mA` : `${fmt(i, 3)} A`)

const ETIQ_0 = '1 A'
const ETIQ_INF = '5/6 A ≈ 0,833 A'

// Llama a onFrame(dt) en cada cuadro mientras `activo` sea true
function useFrame(activo, onFrame) {
  const ref = useRef(onFrame)
  useEffect(() => { ref.current = onFrame })
  useEffect(() => {
    if (!activo) return
    let id, previo = performance.now()
    const frame = ahora => {
      const dt = Math.min((ahora - previo) / 1000, 0.1)
      previo = ahora
      ref.current(dt)
      id = requestAnimationFrame(frame)
    }
    id = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(id)
  }, [activo])
}

/*
 * Pasos:
 *   0 — lectura del circuito: nodos y ramas numeradas, interruptores abiertos
 *   1 — C y L en los extremos (selector t = 0⁺ / t → ∞)
 *   2 — inciso a: corriente en t = 0⁺
 *   3 — inciso b: corriente en t → ∞
 *   4 — incisos c y d: régimen + carga en los capacitores y energía en L
 *   5 — inciso e: descarga con slider de tiempo y gráfico de q(t)
 *   6 — inciso f: potencia y energía en R2
 */
export default function CircuitoVisual({ paso }) {
  const [extremo, setExtremo] = useState('0')
  const [reloj, setReloj] = useState(0)          // s reales, para la animación del régimen
  const [tMs, setTMs] = useState(0)              // tiempo simulado de la descarga
  const [play, setPlay] = useState(true)
  const [pasoPrevio, setPasoPrevio] = useState(paso)

  // Al entrar a la descarga desde un paso anterior, arranca de t = 0 en play
  if (paso !== pasoPrevio) {
    setPasoPrevio(paso)
    if (paso >= 5 && pasoPrevio < 5) { setTMs(0); setPlay(true) }
  }

  const regimen = paso >= 2 && paso <= 4
  const descarga = paso >= 5

  useFrame(regimen, dt => setReloj(r => r + dt))
  useFrame(descarga && play, dt => setTMs(t => Math.min(t + dt * VEL_MS_POR_S, T_FIN_MS)))
  useEffect(() => { if (tMs >= T_FIN_MS) setPlay(false) }, [tMs])

  const togglePlay = () => {
    if (!play && tMs >= T_FIN_MS) setTMs(0)
    setPlay(p => !p)
  }

  const t = tMs / 1000
  const ramas = estadoRamas(paso, reloj, t)

  return (
    <div className="ci-visual">
      {paso === 1 && (
        <div className="ci-selector" role="group" aria-label="Instante">
          <button className={`tab-btn${extremo === '0' ? ' active' : ''}`} onClick={() => setExtremo('0')}>t = 0⁺</button>
          <button className={`tab-btn${extremo === 'inf' ? ' active' : ''}`} onClick={() => setExtremo('inf')}>t → ∞</button>
        </div>
      )}

      {descarga && (
        <div className="fs-controls ci-controls">
          <div className="fs-slider-row">
            <button className="tab-btn active ci-play" onClick={togglePlay}>
              {play ? '❚❚ Pausa' : '▶ Play'}
            </button>
            <span className="fs-z-label">t = <strong>{fmt(tMs, 1)} ms</strong></span>
            <input
              type="range" min={0} max={T_FIN_MS} step={0.1}
              value={tMs}
              onChange={ev => { setPlay(false); setTMs(parseFloat(ev.target.value)) }}
              className="fs-slider"
              aria-label="Tiempo desde la apertura de los interruptores"
            />
          </div>
        </div>
      )}

      <CircuitoSVG
        ramas={ramas}
        cerrados={paso >= 1 && paso <= 4}
        resaltarNodos={paso === 0}
        numerarRamas={paso === 0}
        extremo={paso === 1 ? extremo : null}
        extrasRegimen={paso === 4}
        resaltarR2={paso === 6}
      />

      {paso === 0 && (
        <p className="ci-nota">
          Ramas: <strong>1</strong> A→B (S₂, L) · <strong>2</strong> A→C (R₁) · <strong>3</strong> B→C (R₂) ·{' '}
          <strong>4</strong> B→D (R₃) · <strong>5</strong> C→D (C₁, C₂) · <strong>6</strong> D→A (R₄, ε, S₁)
        </p>
      )}

      {paso === 4 && (
        <p className="ci-nota ci-nota--recuadro">
          Por R₂ no circula corriente, así que C y B están al mismo potencial: la tensión en los
          capacitores es la misma que en R₃.
        </p>
      )}

      {paso === 5 && (
        <>
          <Lecturas>
            <Lectura titulo="t" valor={`${fmt(tMs, 1)} ms`} extra={`${fmt(tMs / TAU_MS, 2)} τ`} />
            <Lectura titulo="q" valor={`${fmt(qDescarga(t) * 1000, 3)} mC`} extra="en C₁ y en C₂ (serie)" color="#8e24aa" />
            <Lectura titulo="i" valor={fmtCorriente(iDescarga(t))} color="#1565c0" />
          </Lecturas>
          <GraficoQ tMs={tMs} />
        </>
      )}

      {paso === 6 && (
        <>
          <Lecturas>
            <Lectura titulo="t" valor={`${fmt(tMs, 1)} ms`} extra={`${fmt(tMs / TAU_MS, 2)} τ`} />
            <Lectura titulo="P en R₂" valor={`${fmt(pR2(t), 3)} W`} color="#e65100" />
            <Lectura titulo="energía disipada en R₂ hasta t" valor={`${fmt(eR2(t) * 1000, 3)} mJ`}
                     color="#e65100" destacado />
          </Lecturas>
          <GraficoP tMs={tMs} />
          <p className="ci-nota">
            A los 5 s (≈ 667 τ) la energía ya es 1,875 mJ: la descarga terminó hace mucho.
          </p>
        </>
      )}
    </div>
  )
}

// Estado de cada rama según el paso. Corrientes con signo respecto del sentido de referencia.
function estadoRamas(paso, reloj, t) {
  const neutras = Object.fromEntries([1, 2, 3, 4, 5, 6].map(n => [n, { modo: 'neutra' }]))
  if (paso <= 1) return neutras

  if (paso <= 4) {
    const i = paso === 2
      ? { 1: 0, 2: I_0, 3: 0, 4: 0, 5: I_0, 6: I_0 }
      : { 1: I_INF, 2: 0, 3: 0, 4: I_INF, 5: 0, 6: I_INF }
    const etiqueta = paso === 2 ? ETIQ_0 : ETIQ_INF
    return Object.fromEntries(Object.entries(i).map(([n, v]) => [n, v
      ? { modo: 'activa', etiqueta, s: PX_POR_A * v * reloj }
      : { modo: 'inactiva', etiqueta: '0 A' }]))
  }

  // Descarga: sale de C por R2 hacia B (rama 3 al revés), baja por R3 a D (rama 4 a favor)
  // y vuelve a los capacitores por C2 (rama 5 al revés)
  const q = (Q_CAP - qDescarga(t)) * 1000     // mC que ya circularon
  const etiqueta = fmtCorriente(iDescarga(t))
  const activa = signo => ({ modo: 'activa', etiqueta, s: signo * PX_POR_MC * q })
  return {
    1: { modo: 'inactiva' }, 2: { modo: 'inactiva' }, 6: { modo: 'inactiva' },
    3: activa(-1), 4: activa(+1), 5: activa(-1),
  }
}

// ── Gráficos ─────────────────────────────────────────────────────────────────
const EJE_T = {
  dataKey: 't', type: 'number', domain: [0, T_FIN_MS], ticks: [0, 10, 20, 30, 40],
  label: { value: 't (ms)', position: 'insideBottom', offset: -8 },
}

function GraficoQ({ tMs }) {
  const marcas = [[1, 'τ'], [3, '3τ'], [5, '5τ']]
  return (
    <div className="fs-chart-wrap">
      <div className="cc2-chart-title">q(t) = 3,75·e^(−t/τ) [mC]</div>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={DATOS_Q} margin={{ top: 16, right: 20, left: 0, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis {...EJE_T} />
          <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} width={32} />
          <Tooltip formatter={v => [`${fmt(v, 3)} mC`, 'q']} labelFormatter={v => `t = ${fmt(v, 1)} ms`} />
          {marcas.map(([k, txt]) => (
            <ReferenceLine key={txt} x={k * TAU_MS} stroke="#999" strokeDasharray="4 3"
                           label={{ value: txt, position: 'top', fontSize: 11, fill: '#555' }} />
          ))}
          <Line dataKey="q" stroke="#8e24aa" strokeWidth={2} dot={false} isAnimationActive={false} />
          <ReferenceLine x={tMs} stroke="#c62828" strokeWidth={1.5} />
          <ReferenceDot x={tMs} y={qDescarga(tMs / 1000) * 1000} r={5} fill="#c62828" stroke="#fff" strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function GraficoP({ tMs }) {
  // Área sombreada de 0 a t; se agrega el punto exacto t para que el borde coincida con el cursor
  const datos = [...TIEMPOS_MS.filter(x => x < tMs), tMs, ...TIEMPOS_MS.filter(x => x > tMs)]
    .map(x => {
      const p = pR2(x / 1000)
      return { t: x, P: p, Psomb: x <= tMs ? p : null }
    })
  return (
    <div className="fs-chart-wrap">
      <div className="cc2-chart-title">P en R₂: P(t) = 0,5·e^(−2t/τ) [W]</div>
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis {...EJE_T} />
          <YAxis domain={[0, 0.55]} ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} width={40}
                 tickFormatter={v => fmt(v, v ? 1 : 0)} />
          <Tooltip formatter={v => [`${fmt(v, 3)} W`, 'P']} labelFormatter={v => `t = ${fmt(v, 1)} ms`} />
          <Area dataKey="Psomb" stroke="none" fill="#ff9800" fillOpacity={0.35} tooltipType="none"
                isAnimationActive={false} connectNulls={false} />
          <Line dataKey="P" stroke="#e65100" strokeWidth={2} dot={false} isAnimationActive={false} />
          <ReferenceLine x={tMs} stroke="#c62828" strokeWidth={1.5} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
