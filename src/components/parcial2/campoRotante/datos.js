// ── Datos del ejercicio 1b (unidades SI) ─────────────────────────────────────
export const OMEGA = 2 * Math.PI              // rad/s  → período T = 1 s
export const RADIO = 0.20                     // m
export const AREA = Math.PI * RADIO ** 2      // m²  ≈ 0,1257
export const R_E = 20                         // Ω
export const T_MAX = 2                        // s   (rango del slider y de los gráficos)
export const B0_DEFECTO = 0.1                 // T   (valor de ejemplo, el enunciado no lo da)

// Colores fijos de cada espira (dibujo y gráficos)
export const COLOR_1 = '#1565c0'
export const COLOR_2 = '#e65100'
export const COLOR_B = '#8e24aa'

// Ángulo de B: θ(t) = ω·t  (t = 0 → B hacia la derecha)
export const theta = t => OMEGA * t

// Todas las magnitudes en el instante t para un B₀ dado.
//   Φ₁ = B₀A cos ωt        Φ₂ = B₀A sen ωt
//   ε₁ = B₀Aω sen ωt       ε₂ = −B₀Aω cos ωt
//   I = ε / R_e
export function estado(t, b0) {
  const th = theta(t)
  const c = Math.cos(th), s = Math.sin(th)
  const eps0 = b0 * AREA * OMEGA
  return {
    th, cos: c, sin: s,
    phi1: b0 * AREA * c,   phi2: b0 * AREA * s,
    eps1: eps0 * s,        eps2: -eps0 * c,
    i1: (eps0 * s) / R_E,  i2: (-eps0 * c) / R_E,
    eps0, i0: eps0 / R_E,
  }
}
