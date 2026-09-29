import { Cita, Seccion, TablaSimbolos, TarjetasPide, Suposiciones } from '../EnunciadoPartes'

const SIMBOLOS = [
  { tex: '\\varepsilon',         que: 'fem de la fuente',                                   unidad: 'V' },
  { tex: 'R_1 \\ldots R_4',      que: 'Resistencias',                                       unidad: 'Ω' },
  { tex: 'C_1,\\ C_2',           que: 'Capacitores',                                        unidad: 'F' },
  { tex: 'C_{eq}',               que: 'Capacidad equivalente de C₁ y C₂ en serie',           unidad: 'F' },
  { tex: 'L',                    que: 'Inductancia',                                        unidad: 'H' },
  { tex: 'S_1,\\ S_2',           que: 'Interruptores',                                      unidad: '—' },
  { tex: 'q,\\ Q',               que: 'Carga en un capacitor',                              unidad: 'C' },
  { tex: '\\tau',                que: 'Constante de tiempo',                                unidad: 's' },
  { tex: 'U',                    que: 'Energía almacenada',                                 unidad: 'J' },
  { tex: 'P',                    que: 'Potencia',                                           unidad: 'W' },
]

const PIDE = [
  { titulo: 'a', contenido: <>Corrientes justo al cerrar los interruptores (t = 0).</> },
  { titulo: 'b', contenido: <>Corrientes después de mucho tiempo con los interruptores cerrados.</> },
  { titulo: 'c', contenido: <>Carga en el capacitor en las condiciones del inciso b.</> },
  { titulo: 'd', contenido: <>Energía almacenada en el inductor en las condiciones del inciso b.</> },
  { titulo: 'e', contenido: <>Carga en los capacitores mucho tiempo después de abrir los interruptores.</> },
  { titulo: 'f', contenido: <>Cómo calcular la potencia y la energía disipadas en R₂ en los primeros 5 s.</> },
]

const SUPOSICIONES = [
  {
    id: 'polaridad',
    chip: 'Polaridad de la fuente',
    texto: 'En la figura, el trazo largo del símbolo de la fuente (por convención, el borne +) está a la izquierda, hacia S1. Si fuera al revés, se invierten los sentidos de las corrientes pero no cambian los módulos, las cargas ni las energías.',
  },
  {
    id: 'descargados',
    chip: 'Capacitores descargados al inicio',
    texto: 'La malla C1–C2–R3–R2 no pasa por ningún interruptor; cualquier carga previa se habría descargado por ahí durante el largo tiempo con los interruptores abiertos.',
  },
  {
    id: 'inductor',
    chip: 'Sin corriente inicial en L',
    texto: 'Con S2 abierto la rama del inductor está cortada.',
  },
  {
    id: 'ideales',
    chip: 'Componentes ideales',
    texto: 'Cables sin resistencia, fuente sin resistencia interna, inductor sin resistencia propia, capacitores sin fugas.',
  },
  {
    id: 'chispa',
    chip: 'Chispa al abrir S2',
    texto: 'Al abrir, la corriente del inductor se corta de golpe; idealmente di/dt sería infinito. En la práctica salta una chispa en el interruptor y ahí se disipa la energía del inductor. No afecta a los capacitores, que están en otra malla.',
  },
]

export default function CircuitoEnunciado() {
  return (
    <div>
      {/* 1 ── Texto original */}
      <Cita>
        <p>
          <strong>2)</strong> En el siguiente circuito ambos interruptores se encuentran abiertos durante un largo tiempo.
        </p>
        <p><strong>I)</strong> En cierto instante ambos interruptores se cierran simultáneamente. Determinar:</p>
        <p>a) Las corrientes por las ramas del circuito en el instante t = 0 s.</p>
        <p>b) Las corrientes por las ramas del circuito cuando ha pasado un tiempo muy largo.</p>
        <p>c) La carga en el capacitor en las condiciones del inciso b).</p>
        <p>d) La energía almacenada en el inductor en las condiciones del inciso b).</p>
        <p><strong>II)</strong> Después de un largo tiempo ambos interruptores se desconectan.</p>
        <p>e) Determinar la carga en los capacitores después de transcurrido un largo tiempo.</p>
        <p>
          f) Describa cómo calcularía la potencia disipada y la energía disipada en los primeros
          5 segundos, en la resistencia R2.
        </p>
        <p>R1 = R2 = 2 Ω, R3 = R4 = 3 Ω, C1 = C2 = 3 mF, L = 4 mH, ε = 5 V</p>
      </Cita>

      {/* 2 ── Figura original */}
      <Seccion titulo="Figura">
        <figure className="p2-figura">
          <img src={`${import.meta.env.BASE_URL}parcial2/figura_2_circuito.png`}
               alt="Circuito con fuente ε, resistencias R1 a R4, capacitores C1 y C2, inductor L e interruptores S1 y S2" />
          <figcaption>Figura del enunciado</figcaption>
        </figure>
      </Seccion>

      {/* 3 ── Qué es cada cosa */}
      <Seccion titulo="Qué es cada cosa">
        <TablaSimbolos filas={SIMBOLOS} />
      </Seccion>

      {/* 4 ── Qué pide */}
      <Seccion titulo="Qué pide">
        <TarjetasPide tarjetas={PIDE} />
      </Seccion>

      {/* 5 ── Suposiciones */}
      <Seccion titulo="Suposiciones">
        <Suposiciones items={SUPOSICIONES} />
      </Seccion>
    </div>
  )
}
