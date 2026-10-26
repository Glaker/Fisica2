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
      { id: 'flashcards',  label: 'Flashcards de Repaso',     desc: 'preguntas de repaso' },
    ],
  },
  {
    id: 2,
    slug: 'parcial2',
    label: 'Parcial 2 · Electromagnetismo',
    corto: 'Parcial 2',
    cubre: 'Ampère, Faraday-Lenz, circuitos RC y RL',
    tabs: [
      { id: '1a',     label: '1-a) Cable con J(r)',  ejercicio: true, origen: '1-a', desc: 'Ampère con corriente no uniforme' },
      { id: '1b',     label: '1-b) Campo rotante',   ejercicio: true, origen: '1-b', desc: 'Faraday-Lenz y corrientes desfasadas' },
      { id: '2',      label: '2) Circuito RC-RL',    ejercicio: true, origen: '2', desc: 'transitorios, carga y descarga' },
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

// Vistas de las preguntas de una teoría: lista, configuración del simulacro y simulacro en curso.
// Cuelgan de la ruta de la teoría: .../teoria, .../teoria/simulacro, .../teoria/simulacro/curso
const SUFIJOS_VISTA = { lista: '', config: '/simulacro', curso: '/simulacro/curso' }

export const rutaPreguntas = (rutaTeoria, vista) => rutaTeoria + SUFIJOS_VISTA[vista]

function vistaPreguntas(partes) {
  if (partes[0] !== 'simulacro') return 'lista'
  return partes[1] === 'curso' ? 'curso' : 'config'
}

/*
 * Interpreta una ruta y devuelve su forma canónica.
 *   { landing: true }
 *   { parcial, tab, seccion?, paso?, rutaTeoria?, vista?, simulacro?, canonica }
 *   rutaTeoria / vista: solo en páginas con teoría ('lista' | 'config' | 'curso')
 * Las rutas incompletas o inválidas se completan con la primera opción válida.
 */
export function interpretarRuta(ruta) {
  const partes = ruta.split('/').filter(Boolean)
  const parcial = PARCIALES.find(p => p.slug === partes[0])
  if (!parcial) return { landing: true, canonica: '/' }

  const tab = parcial.tabs.find(t => t.id === partes[1]) ?? parcial.tabs[0]
  const base = `/${parcial.slug}/${tab.id}`

  if (!tab.ejercicio) {
    if (tab.id !== 'teoria') return { parcial, tab, canonica: base }
    const vista = vistaPreguntas(partes.slice(2))
    return {
      parcial, tab, rutaTeoria: base, vista, simulacro: vista !== 'lista',
      canonica: rutaPreguntas(base, vista),
    }
  }

  const seccion = SECCIONES_EJERCICIO.find(s => s.id === partes[2]) ?? SECCIONES_EJERCICIO[0]
  if (seccion.id === 'teoria') {
    const rutaTeoria = `${base}/teoria`
    const vista = vistaPreguntas(partes.slice(3))
    return {
      parcial, tab, seccion, base, rutaTeoria, vista, simulacro: vista !== 'lista',
      canonica: rutaPreguntas(rutaTeoria, vista),
    }
  }
  const paso = seccion.id === 'resolucion' && /^\d+$/.test(partes[3] ?? '') ? Number(partes[3]) : null
  return {
    parcial, tab, seccion, paso, base,
    canonica: `${base}/${seccion.id}${paso ? `/${paso}` : ''}`,
  }
}
