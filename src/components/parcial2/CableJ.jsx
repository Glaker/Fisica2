import EjercicioLayout from './EjercicioLayout'
import CableJEnunciado from './cableJ/CableJEnunciado'
import CableJVisual from './cableJ/CableJVisual'
import './cableJ/CableJ.css'
import * as teoria from './teoria/teoria1a'

// Pasos de la resolución (ver formato en StepperResolucion.jsx).
// El Visual espera 6 pasos (índices 0 a 5).
const PASOS = [
  // ── 0 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'La situación: cómo está repartida la corriente',
    texto: 'La corriente viaja a lo largo del cable, pero no está repartida de forma pareja: con $J = c\\,r^2$, en el eje ($r = 0$) no circula corriente y en el borde ($r = R$) la densidad es máxima.'
      + '\n\nComo $J$ cambia con $r$, no se puede calcular la corriente como $J$ por el área: hay que sumar anillo por anillo, es decir, integrar. Es el mismo esquema que la $\\rho(r)$ del primer parcial, cambiando carga por corriente y Gauss por Ampère.',
    formula: 'J(r) = c\\,r^2',
    simbolos: [
      { simbolo: 'J(r)', significado: 'Densidad de corriente: cuánta corriente pasa por cada m² de la sección [A/m²]' },
      { simbolo: 'c',    significado: 'Constante del problema [A/m⁴]' },
      { simbolo: 'r',    significado: 'Distancia al eje del cable [m]' },
    ],
    pregunta: {
      pregunta: '¿Por qué no se puede calcular la corriente como I = J·A?',
      respuesta: 'Porque I = J·A solo vale si J es igual en toda la sección. Acá J cambia con r, entonces hay que dividir la sección en anillos finitos (donde J sí es constante) y sumarlos con una integral.',
    },
  },

  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Ley de Ampère y simetría',
    texto: 'La Ley de Ampère vale siempre, pero sirve para despejar $B$ solo si la simetría hace que $B$ sea constante sobre el camino elegido.'
      + '\n\nComo el cable es infinito y $J$ depende solo de $r$, $B$ es tangente a círculos centrados en el eje y tiene el mismo módulo en todo el círculo. Elegimos como camino amperiano un círculo de radio $r$: $B$ es paralelo a $d\\vec l$ y constante, así que sale de la integral y queda $B$ por el perímetro.'
      + '\n\nEl sentido de $B$ sale de la regla de la mano derecha: con la corriente saliendo de la pantalla, $B$ gira en sentido antihorario.',
    formula: [
      '\\oint \\vec B \\cdot d\\vec l = \\mu_0\\, I_{enc}',
      '\\oint \\vec B \\cdot d\\vec l = B \\cdot 2\\pi r',
    ],
    simbolos: [
      { simbolo: '\\oint',    significado: 'Integral sobre un camino cerrado (el camino amperiano)' },
      { simbolo: 'd\\vec l',  significado: 'Un pedacito del camino, con la dirección en que se recorre [m]' },
      { simbolo: 'I_{enc}',   significado: 'Corriente que atraviesa la superficie encerrada por el camino [A]' },
      { simbolo: '\\mu_0',    significado: 'Permeabilidad del vacío, 4π×10⁻⁷ T·m/A' },
      { simbolo: '2\\pi r',   significado: 'Largo (perímetro) del círculo de radio r [m]' },
    ],
    origen: 'Por qué B no tiene otras componentes. Radial no puede tener: si B saliera del eje, un cilindro cerrado alrededor del cable tendría flujo magnético neto distinto de cero, y eso contradice la Ley de Gauss del magnetismo ($\\oint \\vec B\\cdot d\\vec A = 0$, no existen "cargas magnéticas"). A lo largo del eje tampoco: por Biot-Savart $d\\vec B \\propto d\\vec l \\times \\hat r$, y como $d\\vec l$ apunta a lo largo del eje, el producto vectorial es siempre perpendicular al eje. La regla de la mano derecha es la forma práctica de resolver ese producto vectorial.',
    pregunta: {
      pregunta: '¿Por qué usaron Ampère y no Biot-Savart?',
      respuesta: 'Las dos leyes dan el mismo resultado. Biot-Savart obliga a sumar el aporte de cada elemento de corriente de todo el volumen del cable; Ampère aprovecha la simetría y lo resuelve con una integral simple. Sin simetría, Ampère sigue siendo cierta pero no permite despejar B.',
    },
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Adentro del cable (r < R)',
    texto: 'El camino encierra solo la corriente que circula más cerca del eje que $r$. Dividimos esa región en anillos delgados de radio $r\'$ y espesor $dr\'$: en cada anillo $J$ es constante, y su área es $dA = 2\\pi r\'\\,dr\'$. Sumamos todos los anillos desde el eje hasta $r$ y reemplazamos en Ampère.',
    formula: [
      'I_{enc}(r) = \\int_0^r c\\,r\'^2 \\cdot 2\\pi r\'\\,dr\' = \\frac{\\pi c\\,r^4}{2}',
      'B \\cdot 2\\pi r = \\mu_0 \\frac{\\pi c\\,r^4}{2} \\;\\Rightarrow\\; B_{int}(r) = \\frac{\\mu_0\\, c\\, r^3}{4}',
    ],
    simbolos: [
      { simbolo: 'r\'',  significado: 'Variable de integración: recorre los anillos desde el eje (0) hasta r [m]' },
      { simbolo: 'dr\'', significado: 'Espesor de cada anillo [m]' },
      { simbolo: 'dA',   significado: 'Área de cada anillo [m²]' },
    ],
    origen: '$dA = 2\\pi r\'\\,dr\'$: si se "desenrolla" un anillo muy delgado queda casi un rectángulo, de largo igual al perímetro ($2\\pi r\'$) y ancho igual al espesor ($dr\'$).'
      + '\n\nLa integral: $c$ y $2\\pi$ son constantes y salen afuera; queda $\\int_0^r r\'^3\\,dr\'$, que por la regla de la potencia ($\\int x^n dx = \\frac{x^{n+1}}{n+1}$) da $\\frac{r^4}{4}$.',
    pregunta: {
      pregunta: 'Si duplicás r sin salir del cable, ¿cuánto aumenta la corriente encerrada? ¿Y B?',
      respuesta: 'La corriente encerrada va como r⁴: aumenta 16 veces. B va como r³: aumenta 8 veces, porque en Ampère la corriente se divide por el perímetro 2πr. Se puede comprobar con el slider.',
    },
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Afuera del cable (r > R)',
    texto: 'Ahora el camino encierra todo el cable, así que la corriente encerrada es la total, $i$. Es la misma integral del paso anterior, pero hasta $R$.'
      + '\n\nAfuera, el cable se comporta como un hilo con toda la corriente concentrada en el eje: no importa cómo esté repartida adentro.',
    formula: [
      'i = \\int_0^R c\\,r^2 \\cdot 2\\pi r\\,dr = \\frac{\\pi c\\,R^4}{2}',
      'B \\cdot 2\\pi r = \\mu_0\\, i \\;\\Rightarrow\\; B_{ext}(r) = \\frac{\\mu_0\\, i}{2\\pi r}',
    ],
    simbolos: [
      { simbolo: 'i', significado: 'Corriente total del cable [A]' },
      { simbolo: 'R', significado: 'Radio del cable [m]' },
    ],
    pregunta: {
      pregunta: 'Si la corriente estuviera repartida de forma uniforme, ¿cambiaría B afuera del cable?',
      respuesta: 'No. Afuera solo importa la corriente total encerrada, no cómo se reparte. Cambiaría solo adentro: con J uniforme, B crecería proporcional a r en lugar de r³.',
    },
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'B en todo el espacio y verificación',
    texto: 'Despejando $c = \\frac{2i}{\\pi R^4}$ y reemplazando, queda todo en función de la corriente $i$.'
      + '\n\nVerificaciones:'
      + '\n- En $r = R$, las dos expresiones dan lo mismo: $B$ es continuo.'
      + '\n- En el eje ($r = 0$), $B = 0$ porque no hay corriente encerrada.'
      + '\n- El máximo está en el borde del cable: con los datos, 100 μT.',
    formula: [
      'B_{int}(r) = \\frac{\\mu_0\\, i\\, r^3}{2\\pi R^4} \\quad (r < R)',
      'B_{ext}(r) = \\frac{\\mu_0\\, i}{2\\pi r} \\quad (r \\ge R)',
      'B(R) = \\frac{\\mu_0\\, i}{2\\pi R} = \\frac{4\\pi\\times10^{-7}\\cdot 2{,}5}{2\\pi \\cdot 5\\times10^{-3}} = 1\\times10^{-4}\\ \\text{T} = 100\\ \\mu\\text{T}',
    ],
    simbolos: [
      { simbolo: 'B_{int}', significado: 'Campo adentro del cable [T]' },
      { simbolo: 'B_{ext}', significado: 'Campo afuera del cable [T]' },
    ],
    pregunta: {
      pregunta: '¿Por qué B es continuo en r = R?',
      respuesta: 'Porque no hay una corriente concentrada en la superficie del cable: la corriente encerrada crece de forma continua con r, sin saltos. Si hubiera una lámina de corriente en la superficie, B pegaría un salto justo en el borde.',
    },
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'a2: la constante c',
    texto: 'La corriente total es la integral de $J$ sobre toda la sección (paso 4). Despejamos $c$ y reemplazamos los datos: $i = 2{,}5$ A y $R = 5$ mm $= 5\\times10^{-3}$ m. Hay que pasar a metros antes de elevar a la cuarta.'
      + '\n\nDato para la defensa: en el borde, $J$ es el doble del promedio. La corriente está concentrada hacia afuera.',
    formula: [
      'c = \\frac{2\\,i}{\\pi R^4}',
      'R^4 = (5\\times10^{-3})^4 = 6{,}25\\times10^{-10}\\ \\text{m}^4',
      'c = \\frac{2 \\cdot 2{,}5}{\\pi \\cdot 6{,}25\\times10^{-10}} = \\frac{8\\times10^{9}}{\\pi} \\approx 2{,}55\\times10^{9}\\ \\text{A/m}^4',
    ],
    simbolos: [
      { simbolo: 'c', significado: 'Constante que ajusta la escala de J [A/m⁴]' },
    ],
    origen: 'Unidades: $J$ está en A/m² y $r^2$ en m², entonces $c$ tiene que estar en A/m⁴. Cierra.',
    pregunta: {
      pregunta: '¿Por qué J en el borde es el doble del promedio?',
      respuesta: 'El promedio es i/(πR²). Como i = πcR⁴/2, el promedio da cR²/2. En el borde J = cR², o sea el doble. Con J ∝ r², la mayor parte de la corriente circula cerca del borde.',
    },
  },
]

export default function CableJ() {
  return (
    <EjercicioLayout
      enunciado={<CableJEnunciado />}
      pasos={PASOS}
      Visual={CableJVisual}
      teoria={{ secciones: teoria.SECCIONES, preguntas: teoria.PREGUNTAS }}
    />
  )
}
