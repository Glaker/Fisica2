import { J_BORDE, fmt } from './datos'

const COLOR_J = '#1565c0'
// Opacidad ∝ (r/R)² para que el color siga a J = c·r²
const STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1]

// Corte transversal del cable coloreado según J, con la corriente saliendo de la pantalla (⊙)
export function CorteJ({ cx, cy, radio, gradId }) {
  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          {STOPS.map(o => (
            <stop key={o} offset={o} stopColor={COLOR_J} stopOpacity={o * o} />
          ))}
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radio} fill="#fff" />
      <circle cx={cx} cy={cy} r={radio} fill={`url(#${gradId})`} stroke="#0d47a1" strokeWidth={1.5} />
      <SaleDePantalla cx={cx} cy={cy} />
    </g>
  )
}

// Símbolo ⊙: corriente saliendo de la pantalla
export function SaleDePantalla({ cx, cy, size = 7 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={size} fill="#fff" stroke="#1a237e" strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={size * 0.3} fill="#1a237e" />
    </g>
  )
}

// Barra de colores + texto explicativo de J
export function LeyendaJ() {
  return (
    <div className="cj-leyenda">
      <div className="cj-leyenda-bar" />
      <div className="cj-leyenda-ticks">
        <span>centro: J = 0</span>
        <span>borde: J ≈ {fmt(J_BORDE / 1e4)}×10⁴ A/m²</span>
      </div>
      <p className="cj-leyenda-text">
        <strong>J = c·r²</strong>: la corriente se concentra hacia el borde
      </p>
    </div>
  )
}
