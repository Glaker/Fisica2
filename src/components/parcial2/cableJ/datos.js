// ── Datos del ejercicio 1a (unidades SI) ─────────────────────────────────────
export const I_TOTAL = 2.5                    // A
export const R = 0.005                        // m  (5 mm)
export const MU0 = 4e-7 * Math.PI             // T·m/A
export const C = 8e9 / Math.PI                // A/m⁴  ≈ 2,546×10⁹
export const B_MAX = MU0 * I_TOTAL / (2 * Math.PI * R)   // T  (= 100 μT, en r = R)
export const J_BORDE = C * R * R              // A/m²  ≈ 6,37×10⁴
export const J_PROM = I_TOTAL / (Math.PI * R * R)        // A/m²  ≈ 3,18×10⁴

// Corriente encerrada por un círculo de radio r
export function iEnc(r) {
  return r < R ? I_TOTAL * (r / R) ** 4 : I_TOTAL
}

// Módulo de B a distancia r del eje [T]
export function campoB(r) {
  if (r <= 0) return 0
  return r < R ? B_MAX * (r / R) ** 3 : B_MAX * (R / r)
}

// Densidad de corriente [A/m²] (solo dentro del cable)
export function densidadJ(r) {
  return C * r * r
}

export { fmt } from '../formato'
