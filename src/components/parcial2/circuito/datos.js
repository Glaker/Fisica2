// ── Datos del ejercicio 2 (unidades SI salvo aclaración) ─────────────────────
export const FEM = 5                      // V
export const R1 = 2, R2 = 2, R3 = 3, R4 = 3   // Ω
export const C1 = 3e-3, C2 = 3e-3         // F
export const C_EQ = (C1 * C2) / (C1 + C2) // F  (1,5 mF, en serie)
export const L = 4e-3                     // H

// Régimen con los interruptores cerrados
export const I_0 = FEM / (R1 + R4)        // A  t = 0⁺  → 1 A
export const I_INF = FEM / (R3 + R4)      // A  t → ∞   → 5/6 A
export const V_CAP = I_INF * R3           // V  (= V en R3, por R2 no circula corriente) → 2,5 V
export const Q_CAP = C_EQ * V_CAP         // C  → 3,75 mC
export const U_L = 0.5 * L * I_INF ** 2   // J  → ≈ 1,39 mJ

// Descarga (interruptores abiertos): malla C1–C2–R3–R2
export const TAU = (R2 + R3) * C_EQ       // s  → 7,5 ms
export const I_DESC = V_CAP / (R2 + R3)   // A  → 0,5 A

export const qDescarga = t => Q_CAP * Math.exp(-t / TAU)                  // C
export const iDescarga = t => I_DESC * Math.exp(-t / TAU)                // A
export const pR2 = t => R2 * iDescarga(t) ** 2                           // W  = 0,5·e^(−2t/τ)
export const eR2 = t => R2 * I_DESC ** 2 * (TAU / 2) * (1 - Math.exp(-2 * t / TAU))  // J → 1,875 mJ
