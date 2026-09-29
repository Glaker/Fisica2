import { useState, useCallback } from 'react'

// Estado de cada pregunta, compartido entre todas las páginas.
// Se identifica por un hash del texto de la pregunta, así no depende del orden.
// Sin entrada = sin ver.
const CLAVE_STORAGE = 'fisica2:p2:preguntas'

// Orden de peor a mejor (el de los botones del simulacro y sus atajos 1, 2, 3)
export const ESTADOS = [
  { id: 'no-sabida', boton: 'No la sabía', nombre: 'no la sabía' },
  { id: 'a-medias',  boton: 'A medias',    nombre: 'a medias' },
  { id: 'sabida',    boton: 'La sabía',    nombre: 'sabida' },
]
export const SIN_VER = 'sin-ver'

// Valores de la versión anterior (dos estados)
const MIGRACION = { repasar: 'no-sabida' }
const VALIDOS = new Set(ESTADOS.map(e => e.id))

export function hash(texto) {
  let h = 5381
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

function guardar(estados) {
  try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estados)) } catch { /* sin storage */ }
}

function leerEstados() {
  let crudo
  try {
    crudo = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) ?? {}
  } catch {
    return {}
  }
  const estados = {}
  let migrado = false
  for (const [id, valor] of Object.entries(crudo)) {
    const nuevo = MIGRACION[valor] ?? valor
    if (nuevo !== valor) migrado = true
    if (VALIDOS.has(nuevo)) estados[id] = nuevo
    else migrado = true
  }
  if (migrado) guardar(estados)
  return estados
}

// marcar(id, valor, { alternar }): con alternar, tocar el estado que ya tiene lo desmarca
export function useEstados() {
  const [estados, setEstados] = useState(leerEstados)
  const marcar = useCallback((id, valor, { alternar = false } = {}) => {
    setEstados(prev => {
      const nuevo = { ...prev }
      if (alternar && prev[id] === valor) delete nuevo[id]
      else nuevo[id] = valor
      guardar(nuevo)
      return nuevo
    })
  }, [])
  return [estados, marcar]
}

// Cuántas preguntas hay en cada estado. estadoDe(p) → id de estado o undefined (sin ver)
export function contar(items, estadoDe) {
  const cuentas = { 'sabida': 0, 'a-medias': 0, 'no-sabida': 0, [SIN_VER]: 0 }
  for (const p of items) cuentas[estadoDe(p) ?? SIN_VER]++
  return cuentas
}

// ¿La pregunta entra en el filtro? ('todas' | 'repasar' = a medias + no la sabía | 'sin-ver')
export function pasaFiltro(filtro, estado) {
  if (filtro === 'repasar') return estado === 'a-medias' || estado === 'no-sabida'
  if (filtro === SIN_VER) return !estado
  return true
}

export const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`

// Barra fina segmentada: sabidas, a medias, no sabidas y sin ver (en ese orden)
const ORDEN_BARRA = ['sabida', 'a-medias', 'no-sabida', SIN_VER]

export function BarraEstados({ cuentas, className = '' }) {
  const total = ORDEN_BARRA.reduce((s, k) => s + cuentas[k], 0)
  return (
    <div className={`ap-barra ${className}`} aria-hidden="true">
      {total > 0 && ORDEN_BARRA.map(k => cuentas[k] > 0 && (
        <span key={k} className={`ap-barra-seg ap-color--${k}`}
              style={{ flexGrow: cuentas[k] }} />
      ))}
    </div>
  )
}

export function Punto({ estado }) {
  return <span className={`ap-punto ap-color--${estado ?? SIN_VER}`} aria-hidden="true" />
}

export function mezclar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
