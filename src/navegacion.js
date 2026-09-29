// Estructura de la app: parciales, sus secciones y los integrantes del grupo.
// La usan el header, la navegación, las migas y la landing.

export const PARTICIPANTES = [
  'Geronimo Garrote',
  'Demarco Melina',
  'Rasio Valentín',
  'Anita Paez',
  'Gomez Mattoni Melisa',
]

export const PARCIALES = [
  {
    id: 1,
    slug: 'parcial1',
    label: 'Parcial 1 · Electrostática',
    corto: 'Parcial 1',
    cubre: 'Gauss, conductores, capacitores',
    tabs: [
      { id: 'conductores', label: 'Conductores Concéntricos', desc: 'Gauss con ρ(r) y cascarón conductor' },
      { id: 'fields',      label: 'Superposición de Campos',  desc: 'planos, esfera y anillo; trabajo sobre un electrón' },
      { id: 'capacitors',  label: 'Circuito de Capacitores',  desc: 'serie, paralelo y energía' },
      { id: 'flashcards',  label: 'Flashcards de Repaso',     desc: 'preguntas de la defensa' },
    ],
  },
  {
    id: 2,
    slug: 'parcial2',
    label: 'Parcial 2 · Electromagnetismo',
    corto: 'Parcial 2',
    cubre: 'Ampère, Faraday-Lenz, circuitos RC y RL',
    tabs: [
      { id: '1a',     label: '1-a) Cable con J(r)',  ejercicio: true, desc: 'Ampère con corriente no uniforme' },
      { id: '1b',     label: '1-b) Campo rotante',   ejercicio: true, desc: 'Faraday-Lenz y corrientes desfasadas' },
      { id: '2',      label: '2) Circuito RC-RL',    ejercicio: true, desc: 'transitorios, carga y descarga' },
      { id: 'teoria', label: 'Teoría general',       separado: true,  desc: 'Maxwell, Lorentz, dipolo, materia' },
    ],
  },
]

// Parcial que todavía no está: aparece deshabilitado en el header y en la landing
export const PARCIAL_PROXIMO = { id: 3, label: 'Parcial 3' }

// Pestañas internas de cada ejercicio del Parcial 2
export const SECCIONES_EJERCICIO = [
  { id: 'enunciado',  label: 'Enunciado' },
  { id: 'resolucion', label: 'Resolución' },
  { id: 'teoria',     label: 'Teoría y preguntas' },
]

export const RUTA_SIMULACRO = '/parcial2/teoria/simulacro'

/*
 * Interpreta una ruta y devuelve su forma canónica.
 *   { landing: true }
 *   { parcial, tab, seccion?, paso?, simulacro?, canonica }
 * Las rutas incompletas o inválidas se completan con la primera opción válida.
 */
export function interpretarRuta(ruta) {
  const partes = ruta.split('/').filter(Boolean)
  const parcial = PARCIALES.find(p => p.slug === partes[0])
  if (!parcial) return { landing: true, canonica: '/' }

  const tab = parcial.tabs.find(t => t.id === partes[1]) ?? parcial.tabs[0]
  const base = `/${parcial.slug}/${tab.id}`

  if (!tab.ejercicio) {
    const simulacro = tab.id === 'teoria' && partes[2] === 'simulacro'
    return { parcial, tab, simulacro, canonica: simulacro ? `${base}/simulacro` : base }
  }

  const seccion = SECCIONES_EJERCICIO.find(s => s.id === partes[2]) ?? SECCIONES_EJERCICIO[0]
  const paso = seccion.id === 'resolucion' && /^\d+$/.test(partes[3] ?? '') ? Number(partes[3]) : null
  return {
    parcial, tab, seccion, paso, base,
    canonica: `${base}/${seccion.id}${paso ? `/${paso}` : ''}`,
  }
}
