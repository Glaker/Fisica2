import { Cita, Nota, Seccion, TablaSimbolos, TarjetasPide, Suposiciones } from '../EnunciadoPartes'

const SIMBOLOS = [
  { tex: 'B_0',          que: 'Módulo del campo, constante',                                unidad: 'T' },
  { tex: '\\omega',      que: 'Velocidad angular del campo = 2π rad/s (1 vuelta por segundo)', unidad: 'rad/s' },
  { tex: 't',            que: 'Tiempo',                                                     unidad: 's' },
  { tex: 'a',            que: 'Radio de cada espira = 0,20 m',                              unidad: 'm' },
  { tex: 'A',            que: 'Área de cada espira = πa²',                                  unidad: 'm²' },
  { tex: 'R',            que: 'Resistencia de cada espira = 20 Ω',                          unidad: 'Ω' },
  { tex: '\\Phi',        que: 'Flujo magnético: cuánto campo atraviesa la espira',          unidad: 'Wb = T·m²' },
  { tex: '\\varepsilon', que: 'fem inducida',                                               unidad: 'V' },
  { tex: 'I',            que: 'Corriente inducida',                                         unidad: 'A' },
]

const PIDE = [
  { titulo: 'fem inducidas',            contenido: <>ε₁ y ε₂ en función del tiempo.</> },
  { titulo: 'Corrientes inducidas',     contenido: <>I₁ e I₂ en función del tiempo.</> },
  { titulo: 'Comportamiento y desfase', contenido: <>Comparar las dos corrientes: ¿cómo se comportan? ¿Están desfasadas?</> },
]

const SUPOSICIONES = [
  {
    id: 'uniforme',
    chip: 'B uniforme',
    texto: 'B tiene el mismo valor en toda el área de cada espira.',
  },
  {
    id: 'b0',
    chip: 'Falta B₀',
    texto: 'El enunciado no da el módulo de B; los resultados quedan en función de B₀.',
  },
  {
    id: 'vuelta',
    chip: 'Espiras de una vuelta',
    texto: 'Cada espira tiene una sola vuelta: N = 1.',
  },
  {
    id: 'autoinduccion',
    chip: 'Sin autoinducción',
    texto: 'Se desprecia el campo que generan las propias corrientes inducidas. La autoinductancia de una espira de 20 cm es del orden de 1 μH; ωL ≈ 10⁻⁵ Ω, despreciable frente a 20 Ω. Por eso I = ε/R, en fase con la fem.',
  },
  {
    id: 'plano',
    chip: 'B gira en el plano de la hoja',
    texto: 'B gira dentro del plano de la hoja; la normal de la espira 1 es horizontal y la de la espira 2 vertical.',
  },
  {
    id: 'angulo',
    chip: 'Ángulo inicial',
    texto: 'Tomamos B horizontal en t = 0. En la figura está a 45°, pero eso solo corre las dos corrientes por igual: el desfase entre ellas no cambia.',
  },
]

export default function CampoRotanteEnunciado() {
  return (
    <div>
      {/* 1 ── Texto original */}
      <Cita>
        <p>
          <strong>b)</strong> Calcular las fem inducidas y las corrientes inducidas en las espiras por un
          campo magnético de módulo constante, que rota en sentido antihorario alrededor de un eje
          perpendicular al plano de la hoja (ver figura). La frecuencia de rotación del campo es
          ω = 2π/s. Las espiras tienen radios iguales de a = 20 cm y también resistencias iguales de
          R = 20 Ω. Dichas espiras están en planos que forman 90°. ¿Qué puede comentar del
          comportamiento de las corrientes? ¿Están desfasadas?
        </p>
        <p>Ayuda: Escribir un vector en componentes que rote.</p>
        <p>Explique las suposiciones que realiza para hacer los cálculos.</p>
      </Cita>
      <Nota>Es un problema independiente del 1a: no hay ningún cable pasando por las espiras.</Nota>

      {/* 2 ── Figura original */}
      <Seccion titulo="Figura">
        <figure className="p2-figura">
          <img src={`${import.meta.env.BASE_URL}parcial2/figura_1b.png`}alt="Espiras 1 y 2 en planos perpendiculares con el campo B rotando" />
          <figcaption>Figura del enunciado</figcaption>
        </figure>
      </Seccion>

      {/* 3 ── Cómo leer la figura */}
      <Seccion titulo="Cómo leer la figura">
        <ul className="p2-lista">
          <li>
            Los óvalos 1 y 2 son las espiras (anillos de alambre) dibujadas en perspectiva: la 1 está
            parada mirando al centro de la figura, la 2 está acostada mirando hacia arriba.
          </li>
          <li>
            Las líneas finas son los ejes de las espiras (líneas imaginarias perpendiculares a cada
            anillo). No son cables.
          </li>
          <li>La flecha violeta es B en un instante; su largo (módulo) es constante.</li>
          <li>
            La flecha curva indica que B gira en sentido antihorario alrededor de un eje perpendicular
            a la hoja.
          </li>
        </ul>
      </Seccion>

      {/* 4 ── Qué es cada cosa */}
      <Seccion titulo="Qué es cada cosa">
        <TablaSimbolos filas={SIMBOLOS} />
      </Seccion>

      {/* 5 ── Qué pide */}
      <Seccion titulo="Qué pide">
        <TarjetasPide tarjetas={PIDE} />
      </Seccion>

      {/* 6 ── Suposiciones */}
      <Seccion titulo="Suposiciones">
        <Suposiciones items={SUPOSICIONES} />
      </Seccion>
    </div>
  )
}
