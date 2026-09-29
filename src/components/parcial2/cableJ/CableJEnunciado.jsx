import Formula from '../../Formula'
import { Cita, Nota, Seccion, TablaSimbolos, TarjetasPide, Suposiciones } from '../EnunciadoPartes'
import { CorteJ, LeyendaJ } from './CorteJ'

const SIMBOLOS = [
  { tex: 'i',       que: 'Corriente total del cable',                                                       unidad: 'A' },
  { tex: 'R',       que: 'Radio del cable',                                                                 unidad: 'm' },
  { tex: 'r',       que: 'Distancia desde el eje del cable hasta el punto que miramos',                     unidad: 'm' },
  { tex: 'J(r)',    que: 'Densidad de corriente: corriente por unidad de área de la sección; depende de r', unidad: 'A/m²' },
  { tex: 'c',       que: 'Constante a determinar',                                                          unidad: 'A/m⁴' },
  { tex: 'B',       que: 'Campo de inducción magnética',                                                    unidad: 'T' },
  { tex: '\\mu_0',  que: 'Permeabilidad del vacío = 4π×10⁻⁷ T·m/A',                                         unidad: 'T·m/A' },
]

const SUPOSICIONES = [
  {
    id: 'infinito',
    chip: 'Cable infinito',
    texto: 'El enunciado dice "muy largo". Lo tratamos como infinito: así no hay efectos de borde y el cable se ve igual desde cualquier punto a lo largo de él (simetría).',
  },
  {
    id: 'estacionaria',
    chip: 'Corriente estacionaria',
    texto: 'La corriente no cambia en el tiempo. Es un problema de magnetostática y vale la Ley de Ampère sin corriente de desplazamiento.',
  },
  {
    id: 'direccion',
    chip: 'J a lo largo del eje y solo depende de r',
    texto: 'La corriente viaja paralela al cable, y el reparto es igual en cualquier dirección alrededor del eje: J no depende del ángulo ni de la posición a lo largo del cable.',
  },
  {
    id: 'mu0',
    chip: 'μ = μ₀',
    texto: 'El cable no es un material magnético, así que usamos la permeabilidad del vacío en todo el espacio.',
  },
]

const PIDE = [
  {
    titulo: 'a1',
    contenido: (
      <>
        <strong>B para cualquier r.</strong> Hay dos zonas: adentro del cable (r &lt; R) solo
        cuenta la corriente más cercana al eje; afuera (r &gt; R) cuenta toda.
      </>
    ),
  },
  {
    titulo: 'a2',
    contenido: <><strong>El valor numérico de c</strong> con los datos (i = 2,5 A, R = 5 mm).</>,
  },
]

export default function CableJEnunciado() {
  return (
    <div>
      {/* 1 ── Texto original */}
      <Cita>
        <p>
          Por un cable muy largo de radio R circula una corriente i. La densidad de corriente
          dentro del conductor es <Formula tex={'J(r) = c\\cdot r^2'} />.
        </p>
        <p><strong>a1)</strong> Encontrar la expresión del campo de inducción magnética B en todo el espacio.</p>
        <p><strong>a2)</strong> Calcular la constante c, si la corriente que circula por el cable es 2,5 A y el radio es R = 5 mm.</p>
      </Cita>
      <Nota>
        El inciso b (espiras y campo rotante) está en la pestaña <em>Campo rotante</em>; es un problema independiente.
      </Nota>

      {/* 2 ── Esquema */}
      <Seccion titulo="Esquema (elaboración propia; el enunciado no incluye figura para este inciso)">
        <div className="cj-esquema">
          <EsquemaLateral />
          <div className="cj-esquema-corte">
            <svg viewBox="0 0 160 150" className="cj-svg-corte" aria-label="Corte transversal del cable coloreado según J">
              <CorteJ cx={80} cy={68} radio={52} gradId="cj-grad-enunciado" />
              <text x={80} y={134} textAnchor="middle" fontSize={11} fill="#555">Corte transversal</text>
              <text x={80} y={147} textAnchor="middle" fontSize={9} fill="#888">⊙ = i sale de la pantalla</text>
            </svg>
            <LeyendaJ />
          </div>
        </div>
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

// Cable visto de costado, cortado con líneas onduladas en los extremos
function EsquemaLateral() {
  const x0 = 30, x1 = 330, yTop = 45, yBot = 105, yEje = 75
  const ondulada = x => `M${x},${yTop} q-8,7.5 0,15 t0,15 t0,15 t0,15`
  // Opacidad ∝ (distancia al eje)² — mismo criterio que el corte
  const stops = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

  return (
    <svg viewBox="0 0 360 150" className="cj-svg-lateral" aria-label="Cable visto de costado con corriente i a lo largo del eje">
      <defs>
        <linearGradient id="cj-grad-lateral" x1="0" y1="0" x2="0" y2="1">
          {stops.map(o => (
            <stop key={o} offset={o} stopColor="#1565c0" stopOpacity={((o - 0.5) / 0.5) ** 2 * 0.85} />
          ))}
        </linearGradient>
        <marker id="cj-flecha-enun" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#c62828" />
        </marker>
        <marker id="cj-cota-enun" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#333" />
        </marker>
      </defs>

      <rect x={x0} y={yTop} width={x1 - x0} height={yBot - yTop} fill="#fff" />
      <rect x={x0} y={yTop} width={x1 - x0} height={yBot - yTop} fill="url(#cj-grad-lateral)" />
      <line x1={x0} y1={yTop} x2={x1} y2={yTop} stroke="#0d47a1" strokeWidth={1.5} />
      <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke="#0d47a1" strokeWidth={1.5} />
      <path d={ondulada(x0)} fill="none" stroke="#0d47a1" strokeWidth={1.5} />
      <path d={ondulada(x1)} fill="none" stroke="#0d47a1" strokeWidth={1.5} />

      {/* Eje */}
      <line x1={10} y1={yEje} x2={350} y2={yEje} stroke="#999" strokeWidth={0.8} strokeDasharray="6 4" />

      {/* Corriente */}
      <line x1={60} y1={yEje} x2={230} y2={yEje} stroke="#c62828" strokeWidth={2.5}
            markerEnd="url(#cj-flecha-enun)" />
      <text x={145} y={yEje - 7} textAnchor="middle" fontSize={15} fontWeight="bold"
            fontStyle="italic" fill="#c62828">i</text>

      {/* Cota del radio */}
      <line x1={275} y1={yEje} x2={275} y2={yTop + 1} stroke="#333" strokeWidth={1}
            markerEnd="url(#cj-cota-enun)" />
      <circle cx={275} cy={yEje} r={2} fill="#333" />
      <text x={282} y={(yEje + yTop) / 2 + 4} fontSize={13} fontStyle="italic" fill="#333">R</text>

      <text x={180} y={135} textAnchor="middle" fontSize={11} fill="#555">
        Vista lateral (el cable sigue en ambos sentidos)
      </text>
    </svg>
  )
}
