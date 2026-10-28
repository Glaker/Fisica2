import { useState, useEffect, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, ReferenceDot,
} from 'recharts'
import { Lectura, Lecturas } from '../Lectura'
import { fmt, fmtSigno } from '../formato'
import { T_MAX, B0_DEFECTO, COLOR_1, COLOR_2, COLOR_B, estado } from './datos'

// ── Geometría del SVG (redibujo de la figura del enunciado) ──────────────────
const P  = { x: 250, y: 150 }                          // cruce de los ejes, origen de B
const E1 = { cx: 110, cy: 150, rx: 22, ry: 78 }       // espira 1: parada, eje horizontal
const E2 = { cx: 250, cy: 285, rx: 85, ry: 22 }       // espira 2: acostada, eje vertical
const L_B = 95                                         // largo de la flecha de B
const ROT = { x: 375, y: 55, r: 16 }                   // flecha curva de rotación

const TIEMPOS = Array.from({ length: 201 }, (_, k) => (k * T_MAX) / 200)
const TICKS_T = [0, 0.5, 1, 1.5, 2]
const TICKS_T_FINOS = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

/*
 * Pasos:
 *   0 — B girando
 *   1 — proyecciones B·cos θ (eje de la espira 1) y B·sen θ (eje de la espira 2)
 *   2 — barras de flujo + gráfico de Φ₁ y Φ₂
 *   3 — espira 1: Φ₁ e I₁ normalizadas; flechas de sentido de corriente; fem y corrientes en vivo
 *   4 — I₁ e I₂ juntas con la marca del desfase
 */
export default function CampoRotanteVisual({ paso }) {
  const [t, setT] = useState(0)
  const [play, setPlay] = useState(true)
  const [vel, setVel] = useState(1)
  const b0 = B0_DEFECTO

  // Animación a velocidad real (× vel); al llegar a T_MAX vuelve a 0
  useEffect(() => {
    if (!play) return
    let id, previo = performance.now()
    const frame = ahora => {
      const dt = (ahora - previo) / 1000
      previo = ahora
      setT(t0 => {
        const n = t0 + dt * vel
        return n >= T_MAX ? 0 : n
      })
      id = requestAnimationFrame(frame)
    }
    id = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(id)
  }, [play, vel])

  const e = estado(t, b0)
  const n1 = e.i1 / e.i0          // I₁ / I₀ = sen ωt
  const n2 = e.i2 / e.i0          // I₂ / I₀ = −cos ωt
  const grados = ((t * 360) % 360 + 360) % 360
  const conCorrientes = paso >= 3

  const datos = useMemo(() => TIEMPOS.map(tt => {
    const s = estado(tt, b0)
    return { t: tt, phi1: s.cos, phi2: s.sin, i1n: s.sin, i1: s.i1 * 1000, i2: s.i2 * 1000 }
  }), [])

  return (
    <div className="cr-visual">
      {/* ── Controles ─────────────────────────────────────────────────────── */}
      <div className="fs-controls cr-controls">
        <div className="cr-controls-row">
          <button className="tab-btn active cr-play" onClick={() => setPlay(p => !p)}>
            {play ? '❚❚ Pausa' : '▶ Play'}
          </button>
          <div className="cr-vel" role="group" aria-label="Velocidad">
            {[1, 0.25].map(v => (
              <button key={v} className={`tab-btn${vel === v ? ' active' : ''}`} onClick={() => setVel(v)}>
                {v === 1 ? '1×' : '0,25×'}
              </button>
            ))}
          </div>
          <span className="cr-b0">B₀ = 0,1 T</span>
        </div>
        <div className="cr-b0-nota">
          B₀: valor de ejemplo, el enunciado no lo da. Los resultados escalan en proporción a B₀.
        </div>
        <div className="fs-slider-row">
          <span className="fs-z-label">t = <strong>{fmt(t)} s</strong></span>
          <input
            type="range" min={0} max={T_MAX} step={0.005}
            value={t}
            onChange={ev => { setPlay(false); setT(parseFloat(ev.target.value)) }}
            className="fs-slider"
            aria-label="Tiempo"
          />
          <span className="cr-theta">θ = <strong>{Math.round(grados) % 360}°</strong></span>
        </div>
      </div>

      {/* ── Dibujo ────────────────────────────────────────────────────────── */}
      <Dibujo e={e} paso={paso} n1={n1} n2={n2} />

      {/* ── Lecturas en vivo ──────────────────────────────────────────────── */}
      {paso === 1 && (
        <Lecturas>
          <Lectura titulo="B·cos θ (eje espira 1)" valor={`${fmtSigno(e.cos)} B₀`} color={COLOR_1} />
          <Lectura titulo="B·sen θ (eje espira 2)" valor={`${fmtSigno(e.sin)} B₀`} color={COLOR_2} />
        </Lecturas>
      )}
      {paso === 2 && (
        <Lecturas>
          <Lectura titulo="Φ₁" valor={`${fmtSigno(e.cos)} B₀·A`} color={COLOR_1} />
          <Lectura titulo="Φ₂" valor={`${fmtSigno(e.sin)} B₀·A`} color={COLOR_2} />
        </Lecturas>
      )}
      {conCorrientes && (
        <Lecturas>
          <Lectura titulo="fem ε₁" valor={`${fmtSigno(e.eps1 * 1000, 1)} mV`} color={COLOR_1} />
          <Lectura titulo="fem ε₂" valor={`${fmtSigno(e.eps2 * 1000, 1)} mV`} color={COLOR_2} />
          <Lectura titulo="I₁" valor={`${fmtSigno(e.i1 * 1000, 2)} mA`} color={COLOR_1} />
          <Lectura titulo="I₂" valor={`${fmtSigno(e.i2 * 1000, 2)} mA`} color={COLOR_2} />
        </Lecturas>
      )}

      {/* ── Gráficos ──────────────────────────────────────────────────────── */}
      {paso === 2 && (
        <Grafico titulo="Flujo Φ(t) [en unidades de B₀·A]" datos={datos} t={t}
                 dominio={[-1.15, 1.15]} ticksY={[-1, -0.5, 0, 0.5, 1]} unidad="B₀·A">
          <Line dataKey="phi1" name="Φ₁" stroke={COLOR_1} strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line dataKey="phi2" name="Φ₂" stroke={COLOR_2} strokeWidth={2} dot={false} isAnimationActive={false} />
        </Grafico>
      )}
      {paso === 3 && (
        <Grafico titulo="Espira 1: Φ₁ e I₁ normalizadas a su máximo" datos={datos} t={t}
                 dominio={[-1.15, 1.15]} ticksY={[-1, -0.5, 0, 0.5, 1]} unidad="× máx">
          <Line dataKey="phi1" name="Φ₁ / Φ_máx" stroke={COLOR_1} strokeWidth={2}
                strokeDasharray="6 4" dot={false} isAnimationActive={false} />
          <Line dataKey="i1n" name="I₁ / I_máx" stroke={COLOR_1} strokeWidth={2.5}
                dot={false} isAnimationActive={false} />
        </Grafico>
      )}
      {paso === 4 && <GraficoDesfase datos={datos} t={t} i0mA={e.i0 * 1000} />}
    </div>
  )
}

// ── Dibujo principal ─────────────────────────────────────────────────────────
function Dibujo({ e, paso, n1, n2 }) {
  const tip = { x: P.x + L_B * e.cos, y: P.y - L_B * e.sin }
  const conProyecciones = paso === 1 || paso === 2
  const conBarras = paso >= 2
  const conCorrientes = paso >= 3
  const grosor = n => (conCorrientes ? 1.5 + 3 * Math.abs(n) : 2)

  // Flecha curva de rotación (antihoraria): arco de −50° a 220°
  const a1 = (-50 * Math.PI) / 180, a2 = (220 * Math.PI) / 180
  const rotIni = [ROT.x + ROT.r * Math.cos(a1), ROT.y - ROT.r * Math.sin(a1)]
  const rotFin = [ROT.x + ROT.r * Math.cos(a2), ROT.y - ROT.r * Math.sin(a2)]

  return (
    <svg viewBox="0 0 420 340" className="cr-svg"
         aria-label="Espiras 1 y 2 en planos perpendiculares con el campo B rotando">
      <defs>
        <Punta id="cr-punta-b" color={COLOR_B} />
        <Punta id="cr-punta-rot" color="#333" />
        <Punta id="cr-punta-1" color={COLOR_1} />
        <Punta id="cr-punta-2" color={COLOR_2} />
      </defs>

      {/* Ejes de las espiras (la parte punteada es la prolongación) */}
      <line x1={E1.cx} y1={P.y} x2={P.x} y2={P.y} stroke="#333" strokeWidth={1} />
      <line x1={P.x} y1={P.y} x2={P.x + 120} y2={P.y} stroke="#bbb" strokeWidth={1} strokeDasharray="4 4" />
      <line x1={P.x} y1={E2.cy} x2={P.x} y2={P.y} stroke="#333" strokeWidth={1} />
      <line x1={P.x} y1={P.y} x2={P.x} y2={P.y - 120} stroke="#bbb" strokeWidth={1} strokeDasharray="4 4" />

      {/* Espiras */}
      <ellipse cx={E1.cx} cy={E1.cy} rx={E1.rx} ry={E1.ry} fill="none"
               stroke={COLOR_1} strokeWidth={grosor(n1)} />
      <ellipse cx={E2.cx} cy={E2.cy} rx={E2.rx} ry={E2.ry} fill="none"
               stroke={COLOR_2} strokeWidth={grosor(n2)} />
      <text x={E1.cx} y={E1.cy - E1.ry - 8} textAnchor="middle" fontSize={16} fontWeight="bold" fill={COLOR_1}>1</text>
      <text x={E2.cx - E2.rx - 12} y={E2.cy + 6} textAnchor="middle" fontSize={16} fontWeight="bold" fill={COLOR_2}>2</text>

      {conCorrientes && (
        <>
          <FlechasCorriente e={E1} n={n1} color={COLOR_1} />
          <FlechasCorriente e={E2} n={n2} color={COLOR_2} />
          <text x={E1.cx} y={E1.cy + E1.ry + 16} textAnchor="middle" fontSize={9.5} fill={COLOR_1}>
            {textoSentido('I₁', n1, 'vista desde la derecha')}
          </text>
          <text x={E2.cx} y={E2.cy + E2.ry + 16} textAnchor="middle" fontSize={9.5} fill={COLOR_2}>
            {textoSentido('I₂', n2, 'vista desde arriba')}
          </text>
        </>
      )}

      {/* Barras de flujo */}
      {conBarras && (
        <>
          <BarraFlujo x={50} cy={E1.cy} alto={60} valor={e.cos} color={COLOR_1} label="Φ₁" />
          <BarraFlujo x={395} cy={E2.cy} alto={42} valor={e.sin} color={COLOR_2} label="Φ₂" />
        </>
      )}

      {/* Proyecciones de B sobre los ejes */}
      {conProyecciones && (
        <g>
          <line x1={tip.x} y1={tip.y} x2={tip.x} y2={P.y} stroke="#999" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={tip.x} y1={tip.y} x2={P.x} y2={tip.y} stroke="#999" strokeWidth={1} strokeDasharray="3 3" />
          {Math.abs(e.cos) > 0.08 && (
            <line x1={P.x} y1={P.y} x2={tip.x} y2={P.y} stroke={COLOR_1} strokeWidth={3.5}
                  markerEnd="url(#cr-punta-1)" />
          )}
          {Math.abs(e.sin) > 0.08 && (
            <line x1={P.x} y1={P.y} x2={P.x} y2={tip.y} stroke={COLOR_2} strokeWidth={3.5}
                  markerEnd="url(#cr-punta-2)" />
          )}
          <text x={(P.x + tip.x) / 2} y={P.y + (e.sin >= 0 ? 16 : -8)} textAnchor="middle"
                fontSize={11} fontWeight="bold" fill={COLOR_1}>B cos θ</text>
          <text x={P.x + (e.cos >= 0 ? -6 : 6)} y={(P.y + tip.y) / 2 + 4}
                textAnchor={e.cos >= 0 ? 'end' : 'start'}
                fontSize={11} fontWeight="bold" fill={COLOR_2}>B sen θ</text>
        </g>
      )}

      {/* Campo B */}
      <line x1={P.x} y1={P.y} x2={tip.x} y2={tip.y} stroke={COLOR_B} strokeWidth={4.5}
            strokeLinecap="round" markerEnd="url(#cr-punta-b)" />
      <text x={P.x + (L_B + 18) * e.cos} y={P.y - (L_B + 18) * e.sin + 5} textAnchor="middle"
            fontSize={15} fontWeight="bold" fill={COLOR_B}>B</text>
      <circle cx={P.x} cy={P.y} r={3} fill="#333" />

      {/* Rotación antihoraria (sweep = 0 → antihorario en pantalla) */}
      <path d={`M${rotIni[0]},${rotIni[1]} A${ROT.r},${ROT.r} 0 1 0 ${rotFin[0]},${rotFin[1]}`}
            fill="none" stroke="#333" strokeWidth={1.5} markerEnd="url(#cr-punta-rot)" />
      <text x={ROT.x} y={ROT.y + 4} textAnchor="middle" fontSize={11} fontStyle="italic" fill="#333">ω</text>
    </svg>
  )
}

function Punta({ id, color }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="7" refY="5"
            markerWidth="4" markerHeight="4" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
  )
}

function textoSentido(nombre, n, vista) {
  if (Math.abs(n) < 0.03) return `${nombre} ≈ 0`
  return `${nombre} ${n > 0 ? 'antihoraria' : 'horaria'} ${vista}`
}

// Puntas de flecha sobre el óvalo; n > 0 → antihorario en pantalla
function FlechasCorriente({ e, n, color }) {
  const mag = Math.abs(n)
  if (mag < 0.03) return null
  const s = Math.sign(n)
  return [45, 135, 225, 315].map(deg => {
    const f = (deg * Math.PI) / 180
    const x = e.cx + e.rx * Math.cos(f)
    const y = e.cy - e.ry * Math.sin(f)
    // Tangente al recorrer la elipse en sentido antihorario (en pantalla)
    const ang = (Math.atan2(-e.ry * Math.cos(f) * s, -e.rx * Math.sin(f) * s) * 180) / Math.PI
    return (
      <path key={deg} d="M-6,-4.5 L6,0 L-6,4.5 z" fill={color} fillOpacity={0.25 + 0.75 * mag}
            transform={`translate(${x},${y}) rotate(${ang}) scale(${0.7 + 0.6 * mag})`} />
    )
  })
}

// Barra vertical: positiva hacia arriba, negativa hacia abajo (valor en [−1, 1])
function BarraFlujo({ x, cy, alto, valor, color, label }) {
  const h = alto * Math.abs(valor)
  return (
    <g>
      <rect x={x - 6} y={cy - alto} width={12} height={2 * alto} rx={3}
            fill="#f5f5f5" stroke="#ddd" strokeWidth={1} />
      <rect x={x - 6} y={valor >= 0 ? cy - h : cy} width={12} height={h} fill={color} fillOpacity={0.8} />
      <line x1={x - 9} y1={cy} x2={x + 9} y2={cy} stroke="#666" strokeWidth={1} />
      <text x={x} y={cy - alto - 6} textAnchor="middle" fontSize={11} fontWeight="bold" fill={color}>{label}</text>
    </g>
  )
}

// ── Gráficos ─────────────────────────────────────────────────────────────────
function Grafico({ titulo, datos, t, dominio, ticksY, ticksT = TICKS_T, unidad, children, extras }) {
  return (
    <div className="fs-chart-wrap">
      <div className="cc2-chart-title">{titulo}</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="t" type="number" domain={[0, T_MAX]} ticks={ticksT}
                 tickFormatter={v => fmt(v, v * 4 % 2 ? 2 : v % 1 ? 1 : 0)}
                 label={{ value: 't (s)', position: 'insideBottom', offset: -8 }} />
          <YAxis domain={dominio} ticks={ticksY} width={44}
                 tickFormatter={v => fmt(v, Number.isInteger(v) ? 0 : (v * 10) % 1 === 0 ? 1 : 2)} />
          <Tooltip
            formatter={(v, nombre) => [`${fmt(v, 2)} ${unidad}`, nombre]}
            labelFormatter={v => `t = ${fmt(v, 3)} s`}
          />
          <Legend verticalAlign="top" height={24} iconType="plainline" />
          <ReferenceLine y={0} stroke="#333" />
          {children}
          {extras}
          <ReferenceLine x={t} stroke="#c62828" strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function GraficoDesfase({ datos, t, i0mA }) {
  const yMarca = i0mA * 1.22
  const tope = Math.ceil(i0mA * 1.5 * 10) / 10
  const ticks = [-1, -0.5, 0, 0.5, 1].map(k => Math.round(k * i0mA * 100) / 100)
  return (
    <Grafico titulo="Corrientes inducidas I₁ e I₂ [mA]" datos={datos} t={t}
             dominio={[-tope, tope]} ticksY={ticks} ticksT={TICKS_T_FINOS} unidad="mA"
             extras={[
               <ReferenceLine key="v1" segment={[{ x: 0.25, y: i0mA }, { x: 0.25, y: yMarca }]}
                              stroke="#555" strokeDasharray="2 2" />,
               <ReferenceLine key="v2" segment={[{ x: 0.5, y: i0mA }, { x: 0.5, y: yMarca }]}
                              stroke="#555" strokeDasharray="2 2" />,
               <ReferenceLine key="h" segment={[{ x: 0.25, y: yMarca }, { x: 0.5, y: yMarca }]}
                              stroke="#333" strokeWidth={2}
                              label={{ value: 'desfase = 0,25 s = 90°', position: 'top', fontSize: 11, fill: '#333' }} />,
               <ReferenceDot key="d1" x={0.25} y={i0mA} r={4} fill={COLOR_1} stroke="#fff" />,
               <ReferenceDot key="d2" x={0.5} y={i0mA} r={4} fill={COLOR_2} stroke="#fff" />,
             ]}>
      <Line dataKey="i1" name="I₁" stroke={COLOR_1} strokeWidth={2} dot={false} isAnimationActive={false} />
      <Line dataKey="i2" name="I₂" stroke={COLOR_2} strokeWidth={2} dot={false} isAnimationActive={false} />
    </Grafico>
  )
}
