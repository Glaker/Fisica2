import { useEffect, useState } from 'react'
import './Presentacion.css'

/*
 * Herramientas para exponer en pantalla:
 *   P — modo presentación (letra más grande, sin encabezado ni menú); Esc lo cierra
 *   L — puntero láser que sigue al mouse
 * Se ignoran las teclas si el foco está en un campo de texto.
 */
export default function Presentacion() {
  const [pres, setPres] = useState(false)
  const [laser, setLaser] = useState(false)
  const [pos, setPos] = useState(null)

  useEffect(() => {
    const alTeclear = e => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const t = e.target
      if (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return
      const k = e.key.toLowerCase()
      if (k === 'p') setPres(v => !v)
      else if (k === 'l') setLaser(v => !v)
      else if (k === 'escape') setPres(false)
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [])

  // El modo presentación cambia el tamaño del contenido: los steppers vuelven a medir su alto fijo
  useEffect(() => {
    document.documentElement.classList.toggle('modo-pres', pres)
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('stp-remedir')))
    return () => cancelAnimationFrame(id)
  }, [pres])

  useEffect(() => () => document.documentElement.classList.remove('modo-pres'), [])

  useEffect(() => {
    if (!laser) { setPos(null); return }
    const mover = e => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', mover)
    return () => window.removeEventListener('mousemove', mover)
  }, [laser])

  return (
    <>
      {laser && pos && <div className="laser" style={{ left: pos.x, top: pos.y }} aria-hidden="true" />}
      {pres && (
        <button className="pres-salir" onClick={() => setPres(false)}>
          Modo presentación · <kbd>P</kbd> o <kbd>Esc</kbd> para salir
        </button>
      )}
    </>
  )
}
