// Redibujo del circuito del enunciado, con la misma disposición.
//
// Nodos:  A (izquierda, entre S2 y S1)   B (arriba: L, R2, R3)
//         C (centro: R1, R2, C1)         D (todo el cable vertical derecho)
// Ramas (sentido de referencia = orden de los puntos):
//   1: A→B (S2, L)   2: A→C (R1)   3: B→C (R2)
//   4: B→D (R3)      5: C→D (C1, C2)   6: D→A (R4, ε, S1)

// ── Geometría ────────────────────────────────────────────────────────────────
const XI = 40, XD = 480, YS = 50, YM = 190, YI = 320
export const NODOS = {
  A: { p: [XI, YM],  letra: [22, YM] },
  B: { p: [250, YS], letra: [250, 30] },
  C: { p: [250, YM], letra: [234, 208] },
  D: { p: [XD, YM],  letra: [498, YM] },
}
const [A, B, C, D] = ['A', 'B', 'C', 'D'].map(n => NODOS[n].p)

export const RAMAS = {
  1: { pts: [A, [XI, YS], B],             etiqueta: [150, 82],  numero: [80, YS] },
  2: { pts: [A, C],                       etiqueta: [130, 174], numero: [205, YM] },
  3: { pts: [B, C],                       etiqueta: [262, 124], numero: [250, 170], ancla: 'start' },
  4: { pts: [B, [XD, YS], D],             etiqueta: [365, 80],  numero: [290, YS] },
  5: { pts: [C, D],                       etiqueta: [370, 172], numero: [290, YM] },
  6: { pts: [D, [XD, YI], [XI, YI], A],   etiqueta: [345, 304], numero: [260, YI] },
}

// Zonas de los componentes que se "reemplazan" en el paso 1
export const ZONA_CAPS = { x1: 314, x2: 426, y: YM }
export const ZONA_L = { x1: 112, x2: 188, y: YS }

const COLOR = {
  neutra: '#37474f',
  activa: '#1565c0',
  inactiva: '#c5c5c5',
}
const COLOR_PUNTO = '#ffb300'
const SEPARACION_PUNTOS = 26

// ── Utilidades de polilínea ──────────────────────────────────────────────────
function largo(pts) {
  let L = 0
  for (let k = 1; k < pts.length; k++) L += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])
  return L
}

function puntoEn(pts, s) {
  for (let k = 1; k < pts.length; k++) {
    const [x0, y0] = pts[k - 1], [x1, y1] = pts[k]
    const l = Math.hypot(x1 - x0, y1 - y0)
    if (s <= l) return [x0 + ((x1 - x0) * s) / l, y0 + ((y1 - y0) * s) / l]
    s -= l
  }
  return pts[pts.length - 1]
}

// ── Componente principal ─────────────────────────────────────────────────────
/*
 * ramas: { [n]: { modo: 'neutra'|'activa'|'inactiva', etiqueta?: string, s?: número } }
 *   s = desplazamiento de los puntitos en px, con signo respecto del sentido de referencia.
 */
export default function CircuitoSVG({
  ramas, cerrados, resaltarNodos = false, numerarRamas = false,
  extremo = null, extrasRegimen = false, resaltarR2 = false,
}) {
  const col = n => COLOR[ramas[n]?.modo ?? 'neutra']

  return (
    <svg viewBox="0 0 520 365" className="ci-svg" aria-label="Circuito del ejercicio 2">
      <rect x={0} y={0} width={520} height={365} rx={10} fill="#fff" />

      {/* Recuadro: V en los capacitores = V en R3 */}
      {extrasRegimen && (
        <rect x={236} y={36} width={258} height={172} rx={10} fill="#f3e5f5" fillOpacity={0.35}
              stroke="#8e24aa" strokeWidth={1.5} strokeDasharray="6 4" />
      )}

      {/* Cables */}
      {Object.entries(RAMAS).map(([n, { pts }]) => (
        <polyline key={n} points={pts.map(p => p.join(',')).join(' ')} fill="none"
                  stroke={col(n)} strokeWidth={ramas[n]?.modo === 'activa' ? 3.5 : 2}
                  strokeLinejoin="round" />
      ))}

      {/* Componentes */}
      <Interruptor x={XI} y1={95} y2={140} cerrado={cerrados} color={col(1)} nombre="S₂" />
      <Inductor x1={ZONA_L.x1 + 3} x2={ZONA_L.x2 - 3} y={YS} color={col(1)} />
      <Texto x={150} y={30} color={col(1)}>L</Texto>

      <Resistor x1={90} x2={170} y={YM} color={col(2)} />
      <Texto x={130} y={216} color={col(2)}>R₁</Texto>

      <Resistor x1={90} x2={150} y={250} vertical color={col(3)} resaltado={resaltarR2} />
      <Texto x={236} y={124} color={col(3)} ancla="end">R₂</Texto>

      <Resistor x1={320} x2={410} y={YS} color={col(4)} />
      <Texto x={365} y={32} color={col(4)}>R₃</Texto>

      <Capacitor x={330} y={YM} color={col(5)} />
      <Capacitor x={410} y={YM} color={col(5)} />
      <Texto x={330} y={218} color={col(5)}>C₁</Texto>
      <Texto x={410} y={218} color={col(5)}>C₂</Texto>

      <Interruptor x={XI} y1={235} y2={280} cerrado={cerrados} color={col(6)} nombre="S₁" />
      <Fuente x={190} y={YI} color={col(6)} />
      <Resistor x1={300} x2={390} y={YI} color={col(6)} />
      <Texto x={345} y={348} color={col(6)}>R₄</Texto>

      {/* Paso 1: comportamiento de C y L en los extremos */}
      {extremo && <Extremos extremo={extremo} />}

      {/* Puntitos de corriente */}
      {Object.entries(RAMAS).map(([n, { pts }]) => {
        const r = ramas[n]
        if (r?.modo !== 'activa' || r.s == null) return null
        const L = largo(pts)
        const cant = Math.floor(L / SEPARACION_PUNTOS)
        const paso = L / cant
        const desfase = ((r.s % paso) + paso) % paso
        return Array.from({ length: cant }, (_, k) => {
          const [x, y] = puntoEn(pts, (k * paso + desfase) % L)
          return <circle key={`${n}-${k}`} cx={x} cy={y} r={3.2} fill={COLOR_PUNTO} stroke="#6d4c00" strokeWidth={0.8} />
        })
      })}

      {/* Nodos */}
      {Object.entries(NODOS).map(([nombre, { p, letra }]) => (
        <g key={nombre}>
          <circle cx={p[0]} cy={p[1]} r={resaltarNodos ? 5.5 : 3.5} fill={resaltarNodos ? '#1a237e' : '#333'} />
          <circle cx={letra[0]} cy={letra[1]} r={9} fill={resaltarNodos ? '#e8eaf6' : '#fff'}
                  stroke="#1a237e" strokeWidth={resaltarNodos ? 1.8 : 1.2} />
          <text x={letra[0]} y={letra[1] + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1a237e">
            {nombre}
          </text>
        </g>
      ))}

      {/* Números de rama (paso 0) */}
      {numerarRamas && Object.entries(RAMAS).map(([n, { numero }]) => (
        <g key={n}>
          <rect x={numero[0] - 9} y={numero[1] - 9} width={18} height={18} rx={4} fill="#1a237e" />
          <text x={numero[0]} y={numero[1] + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#fff">{n}</text>
        </g>
      ))}

      {/* Etiquetas de corriente */}
      {Object.entries(RAMAS).map(([n, { etiqueta, ancla }]) => {
        const r = ramas[n]
        if (!r?.etiqueta) return null
        return (
          <Texto key={n} x={etiqueta[0]} y={etiqueta[1]} ancla={ancla}
                 color={r.modo === 'activa' ? COLOR.activa : '#9e9e9e'} tam={10.5} halo>
            {r.etiqueta}
          </Texto>
        )
      })}

      {/* Paso 4: carga y energía */}
      {extrasRegimen && (
        <>
          <Texto x={370} y={240} color="#8e24aa" tam={10} halo>V = 2,5 V, Q = 3,75 mC (cada uno 1,25 V)</Texto>
          <Texto x={150} y={98} color="#8e24aa" tam={10} halo>U_L ≈ 1,39 mJ</Texto>
        </>
      )}
    </svg>
  )
}

// ── Símbolos ─────────────────────────────────────────────────────────────────
function Texto({ x, y, color, children, ancla = 'middle', tam = 12, halo = false }) {
  return (
    <text x={x} y={y} textAnchor={ancla} fontSize={tam} fontWeight={halo ? 700 : 600} fill={color}
          stroke={halo ? '#fff' : undefined} strokeWidth={halo ? 3 : undefined} paintOrder="stroke">
      {children}
    </text>
  )
}

// Horizontal por defecto: x1..x2 sobre y. Vertical: x1..x2 son las y, `y` es la x.
function Resistor({ x1, x2, y, color, vertical = false, resaltado = false }) {
  const n = 6, a = 7, w = (x2 - x1) / n
  const pts = [[x1, 0]]
  for (let k = 0; k < n; k++) pts.push([x1 + w * (k + 0.5), k % 2 ? a : -a])
  pts.push([x2, 0])
  const mapa = vertical ? ([u, v]) => [y + v, u] : ([u, v]) => [u, y + v]
  const [bx, by] = mapa([x1, -a - 3])
  const [ex, ey] = mapa([x2, a + 3])
  return (
    <g>
      <rect x={Math.min(bx, ex)} y={Math.min(by, ey)} width={Math.abs(ex - bx)} height={Math.abs(ey - by)}
            fill={resaltado ? '#fff3e0' : '#fff'} stroke={resaltado ? '#ff9800' : 'none'}
            strokeWidth={1.5} strokeDasharray={resaltado ? '4 3' : undefined} rx={resaltado ? 4 : 0} />
      <polyline points={pts.map(mapa).map(p => p.join(',')).join(' ')} fill="none"
                stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </g>
  )
}

function Inductor({ x1, x2, y, color }) {
  const n = 4, r = (x2 - x1) / (2 * n)
  let d = `M${x1},${y}`
  for (let k = 0; k < n; k++) d += ` a${r},${r} 0 0 1 ${2 * r},0`
  return (
    <g>
      <rect x={x1 - 1} y={y - r - 3} width={x2 - x1 + 2} height={r + 6} fill="#fff" />
      <path d={d} fill="none" stroke={color} strokeWidth={2} />
    </g>
  )
}

function Capacitor({ x, y, color }) {
  return (
    <g>
      <rect x={x - 4} y={y - 14} width={8} height={28} fill="#fff" />
      <line x1={x - 4} y1={y - 13} x2={x - 4} y2={y + 13} stroke={color} strokeWidth={2.5} />
      <line x1={x + 4} y1={y - 13} x2={x + 4} y2={y + 13} stroke={color} strokeWidth={2.5} />
    </g>
  )
}

// Borne + (placa larga) hacia la izquierda, hacia S1
function Fuente({ x, y, color }) {
  return (
    <g>
      <rect x={x - 6} y={y - 16} width={12} height={32} fill="#fff" />
      <line x1={x - 4} y1={y - 14} x2={x - 4} y2={y + 14} stroke={color} strokeWidth={2} />
      <line x1={x + 4} y1={y - 8} x2={x + 4} y2={y + 8} stroke={color} strokeWidth={4} />
      <Texto x={x - 13} y={y - 12} color={color} tam={13}>+</Texto>
      <Texto x={x + 13} y={y - 12} color={color} tam={13}>−</Texto>
      <Texto x={x} y={y + 30} color={color} tam={13}>ε</Texto>
    </g>
  )
}

// Vertical: y1 borne de arriba, y2 borne de abajo
function Interruptor({ x, y1, y2, cerrado, color, nombre }) {
  return (
    <g>
      <rect x={x - 3} y={y1} width={6} height={y2 - y1} fill="#fff" />
      <line x1={x} y1={y2} x2={cerrado ? x : x + 17} y2={cerrado ? y1 : y1 + 6}
            stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={x} cy={y1} r={3} fill="#fff" stroke={color} strokeWidth={1.5} />
      <circle cx={x} cy={y2} r={3} fill="#fff" stroke={color} strokeWidth={1.5} />
      <Texto x={x - 10} y={(y1 + y2) / 2 + 4} color={color} ancla="end">{nombre}</Texto>
    </g>
  )
}

// Paso 1: los capacitores y el inductor como cable o como circuito abierto
function Extremos({ extremo }) {
  const capsCable = extremo === '0'
  return (
    <g>
      <Reemplazo zona={ZONA_CAPS} cable={capsCable} textoY={242}
                 texto={capsCable ? 'capacitor descargado = cable' : 'capacitor cargado = abierto'} />
      <Reemplazo zona={ZONA_L} cable={!capsCable} textoY={84}
                 texto={capsCable ? 'inductor sin corriente = abierto' : 'inductor con corriente constante = cable'} />
    </g>
  )
}

function Reemplazo({ zona, cable, texto, textoY }) {
  const { x1, x2, y } = zona
  const color = cable ? '#2e7d32' : '#c62828'
  const xm = (x1 + x2) / 2
  return (
    <g>
      <rect x={x1} y={y - 18} width={x2 - x1} height={36} rx={6} fill="#fff" fillOpacity={0.7}
            stroke={color} strokeWidth={1.2} strokeDasharray="3 3" />
      {cable ? (
        <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={3} strokeDasharray="7 4" />
      ) : (
        <>
          <line x1={xm - 12} y1={y - 8} x2={xm - 12} y2={y + 8} stroke={color} strokeWidth={2.5} />
          <line x1={xm + 12} y1={y - 8} x2={xm + 12} y2={y + 8} stroke={color} strokeWidth={2.5} />
          <path d={`M${xm - 5},${y - 5} L${xm + 5},${y + 5} M${xm + 5},${y - 5} L${xm - 5},${y + 5}`}
                stroke={color} strokeWidth={2} />
        </>
      )}
      <Texto x={xm} y={textoY} color={color} tam={10.5} halo>{texto}</Texto>
    </g>
  )
}
