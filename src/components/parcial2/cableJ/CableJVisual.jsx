import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceArea, ReferenceDot,
} from 'recharts'
import Formula from '../../Formula'
import { Lectura, Lecturas } from '../Lectura'
import { CorteJ, SaleDePantalla, LeyendaJ } from './CorteJ'
import { I_TOTAL, R, J_PROM, iEnc, campoB, densidadJ, fmt } from './datos'

// ── Geometría del SVG ────────────────────────────────────────────────────────
const CX = 150, CY = 150
const R_MM = R * 1000               // 5 mm
const R_PX = 44                     // el círculo de 3R (132 px) entra en el lienzo
const R_MAX_MM = 3 * R_MM           // rango del slider: 0 a 3R
const toPx = rMm => (rMm / R_MM) * R_PX

const COLOR_B = '#2e7d32'
const COLOR_ENC = '#ff9800'

// Valores iniciales del slider al entrar a los pasos 2 y 3
const R_INICIAL = { 2: 0.6 * R_MM, 3: 2 * R_MM }

const DATOS_B = Array.from({ length: 301 }, (_, k) => {
  const r = (k * R_MAX_MM) / 300
  return { r, B: campoB(r / 1000) * 1e6 }
})

const DATOS_J = Array.from({ length: 101 }, (_, k) => {
  const r = (k * R_MM) / 100
  return { r, J: densidadJ(r / 1000) / 1e4 }
})

/*
 * Pasos:
 *   0 — corte coloreado según J
 *   1 — camino amperiano fijo en 2R con B tangente
 *   2 — slider de r (arranca en 0,6R), I_enc en vivo
 *   3 — slider (arranca en 2R), todo el cable encerrado
 *   4 — gráfico de B(r) con punto que sigue al slider
 *   5 — gráfico de J(r) y valor de c
 */
export default function CableJVisual({ paso }) {
  const [rMm, setRMm] = useState(() => R_INICIAL[paso] ?? R_INICIAL[2])
  const [pasoPrevio, setPasoPrevio] = useState(paso)

  // Al entrar a los pasos 2 y 3 se reposiciona el slider (en el mismo render, sin parpadeo)
  if (paso !== pasoPrevio) {
    setPasoPrevio(paso)
    if (R_INICIAL[paso] != null) setRMm(R_INICIAL[paso])
  }

  const conSlider = paso >= 2 && paso <= 4
  const rAmp = paso === 1 ? 2 * R_MM : conSlider ? rMm : null
  const rM = rMm / 1000
  const ienc = iEnc(rM)
  const todoElCable = rMm >= R_MM

  return (
    <div className="cj-visual">
      <svg viewBox="0 0 300 300" className="cj-svg-visual"
           aria-label="Corte transversal del cable con la corriente saliendo de la pantalla">
        <defs>
          <marker id="cj-flecha-b" viewBox="0 0 10 10" refX="8" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={COLOR_B} />
          </marker>
        </defs>

        <CorteJ cx={CX} cy={CY} radio={R_PX} gradId="cj-grad-visual" />

        {/* Región encerrada por el camino amperiano */}
        {conSlider && rMm > 0 && (
          <>
            <circle cx={CX} cy={CY} r={toPx(Math.min(rMm, R_MM))}
                    fill={COLOR_ENC} fillOpacity={0.35} />
            <SaleDePantalla cx={CX} cy={CY} />
          </>
        )}

        {/* Cota del radio del cable */}
        <CotaRadio rPx={R_PX} angulo={-40} label="R" color="#0d47a1" />

        {rAmp != null && rAmp > 0 && (
          <CaminoAmperiano rPx={toPx(rAmp)} label={paso === 1 ? '2R' : 'r'} />
        )}
      </svg>

      {paso === 0 && <LeyendaJ />}

      {paso === 1 && (
        <p className="cj-caption">
          <strong>Camino amperiano:</strong> B es tangente y tiene el mismo módulo en todo el círculo
        </p>
      )}

      {conSlider && (
        <div className="fs-controls cj-controls">
          <div className="fs-slider-row">
            <span className="fs-z-label">
              r = <strong>{fmt(rMm)} mm</strong>
            </span>
            <input
              type="range" min={0} max={R_MAX_MM} step={0.05}
              value={rMm}
              onChange={e => setRMm(parseFloat(e.target.value))}
              className="fs-slider"
              aria-label="Radio del camino amperiano"
            />
          </div>

          <Lecturas>
            <Lectura titulo="r" valor={`${fmt(rMm)} mm`} extra={`${fmt(rMm / R_MM)} R`} />
            <Lectura titulo="I_enc" valor={`${fmt(ienc, 3)} A`} extra={`${fmt((ienc / I_TOTAL) * 100, 1)} % de i`} />
            {paso === 4 && (
              <Lectura titulo="B" valor={`${fmt(campoB(rM) * 1e6, 1)} μT`} destacado />
            )}
          </Lecturas>

          {todoElCable && (
            <div className="cj-todo-cable">I_enc = i = 2,5 A (todo el cable)</div>
          )}
        </div>
      )}

      {paso === 4 && <GraficoB rMm={rMm} />}
      {paso === 5 && <GraficoJ />}
    </div>
  )
}

// Círculo punteado con flechas de B tangentes en sentido antihorario
function CaminoAmperiano({ rPx, label }) {
  const N = 8
  // Semiancho angular de cada flecha: ~11 px de arco, como mucho 14°
  const delta = Math.min((14 * Math.PI) / 180, 11 / rPx)
  const punto = a => [CX + rPx * Math.cos(a), CY - rPx * Math.sin(a)]
  const aLabel = (135 * Math.PI) / 180
  const [lx, ly] = punto(aLabel)

  return (
    <g>
      <circle cx={CX} cy={CY} r={rPx} fill="none" stroke={COLOR_B}
              strokeWidth={1.6} strokeDasharray="5 4" />

      {rPx > 14 && Array.from({ length: N }, (_, k) => {
        const a = (2 * Math.PI * (k + 0.5)) / N
        const [x1, y1] = punto(a - delta)
        const [x2, y2] = punto(a + delta)
        // sweep = 0 → antihorario en pantalla
        return (
          <path key={k} d={`M${x1},${y1} A${rPx},${rPx} 0 0 0 ${x2},${y2}`}
                fill="none" stroke={COLOR_B} strokeWidth={2.4}
                markerEnd="url(#cj-flecha-b)" />
        )
      })}

      {/* Radio del camino */}
      <line x1={CX} y1={CY} x2={lx} y2={ly} stroke={COLOR_B} strokeWidth={1} strokeDasharray="3 3" />
      <text x={lx - 6} y={ly - 6} textAnchor="end" fontSize={13} fontStyle="italic"
            fontWeight="bold" fill={COLOR_B}>{label}</text>

      {rPx > 14 && (
        <text x={CX + rPx * Math.cos(Math.PI / 4) + 8} y={CY - rPx * Math.sin(Math.PI / 4) - 4}
              fontSize={13} fontWeight="bold" fill={COLOR_B}>B</text>
      )}
    </g>
  )
}

function CotaRadio({ rPx, angulo, label, color }) {
  const a = (angulo * Math.PI) / 180
  const x = CX + rPx * Math.cos(a), y = CY - rPx * Math.sin(a)
  return (
    <g>
      <line x1={CX} y1={CY} x2={x} y2={y} stroke={color} strokeWidth={1} />
      <text x={x + 5} y={y + 12} fontSize={12} fontStyle="italic" fill={color}>{label}</text>
    </g>
  )
}

function GraficoB({ rMm }) {
  return (
    <div className="fs-chart-wrap">
      <div className="cc2-chart-title">B(r) [μT]</div>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={DATOS_B} margin={{ top: 18, right: 20, left: 0, bottom: 18 }}>
          <ReferenceArea x1={0} x2={R_MM} fill="#e3f2fd" fillOpacity={0.8}
                         label={{ value: '∝ r³', position: 'center', fill: '#1565c0', fontSize: 13 }} />
          <ReferenceArea x1={R_MM} x2={R_MAX_MM} fill="#e8f5e9" fillOpacity={0.8}
                         label={{ value: '∝ 1/r', position: 'center', fill: COLOR_B, fontSize: 13 }} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="r" type="number" domain={[0, R_MAX_MM]} ticks={[0, 2.5, 5, 7.5, 10, 12.5, 15]}
                 tickFormatter={v => fmt(v, v % 1 ? 1 : 0)}
                 label={{ value: 'r (mm)', position: 'insideBottom', offset: -8 }} />
          <YAxis domain={[0, 110]} ticks={[0, 25, 50, 75, 100]} width={40} />
          <Tooltip
            formatter={v => [`${fmt(v, 1)} μT`, 'B']}
            labelFormatter={v => `r = ${fmt(v)} mm`}
          />
          <ReferenceLine x={R_MM} stroke="#555" strokeDasharray="4 3"
                         label={{ value: 'borde del cable', position: 'top', fontSize: 10, fill: '#555' }} />
          <Line dataKey="B" stroke={COLOR_B} strokeWidth={2} dot={false} isAnimationActive={false} />
          <ReferenceDot x={rMm} y={campoB(rMm / 1000) * 1e6} r={5}
                        fill="#c62828" stroke="#fff" strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function GraficoJ() {
  const jProm = J_PROM / 1e4
  return (
    <>
      <div className="fs-chart-wrap">
        <div className="cc2-chart-title">J(r) dentro del cable [×10⁴ A/m²]</div>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={DATOS_J} margin={{ top: 10, right: 20, left: 0, bottom: 18 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="r" type="number" domain={[0, R_MM]} ticks={[0, 1, 2, 3, 4, 5]}
                   label={{ value: 'r (mm)', position: 'insideBottom', offset: -8 }} />
            <YAxis domain={[0, 7]} ticks={[0, 1, 2, 3, 4, 5, 6, 7]} width={32} />
            <Tooltip
              formatter={v => [`${fmt(v)}×10⁴ A/m²`, 'J']}
              labelFormatter={v => `r = ${fmt(v)} mm`}
            />
            <ReferenceLine y={jProm} stroke="#e65100" strokeDasharray="5 4"
                           label={{ value: `J promedio ≈ ${fmt(jProm)}×10⁴ A/m²`, position: 'insideTopLeft',
                                    fontSize: 10, fill: '#e65100' }} />
            <Line dataKey="J" stroke="#1565c0" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="fs-card cj-c-box">
        <div className="fs-card-title">Constante c</div>
        <Formula block tex={'c = \\frac{8\\times10^{9}}{\\pi} \\approx 2{,}55\\times10^{9}\\ \\mathrm{A/m^4}'} />
      </div>
    </>
  )
}
