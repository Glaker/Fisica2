import { createContext, useSyncExternalStore } from 'react'

// Navegación con el hash de la URL: #/, #/parcial1/<pestaña>, #/parcial2/1b/resolucion/3,
// #/parcial2/teoria, #/parcial2/teoria/simulacro, #/parcial2/1b/teoria/simulacro/curso.
// El botón "atrás" funciona, recargar no pierde la posición y se pueden pasar links directos.

const oyentes = new Set()

export function rutaActual() {
  return window.location.hash.replace(/^#/, '') || '/'
}

function suscribir(cb) {
  oyentes.add(cb)
  window.addEventListener('hashchange', cb)
  return () => {
    oyentes.delete(cb)
    window.removeEventListener('hashchange', cb)
  }
}

// reemplazar: cambia la URL sin agregar una entrada al historial (p. ej. al avanzar pasos)
export function navegar(ruta, { reemplazar = false } = {}) {
  if (ruta === rutaActual()) return
  if (reemplazar) {
    history.replaceState(history.state, '', '#' + ruta)
    oyentes.forEach(cb => cb())   // replaceState no dispara hashchange
  } else {
    window.location.hash = ruta
  }
}

export function useRuta() {
  return useSyncExternalStore(suscribir, rutaActual)
}

// Datos de la ruta que necesitan las páginas del Parcial 2 (ejercicio, pestaña interna, paso, simulacro)
export const RutaContext = createContext(null)
