import EjercicioLayout from './EjercicioLayout'
import CampoRotanteEnunciado from './campoRotante/CampoRotanteEnunciado'
import CampoRotanteVisual from './campoRotante/CampoRotanteVisual'
import './campoRotante/CampoRotante.css'

// Pasos de la resolución (ver formato en StepperResolucion.jsx).
// El Visual espera 5 pasos (índices 0 a 4).
const PASOS = [
  // ── 0 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'El campo que gira, en componentes',
    texto: 'El enunciado da una ayuda: escribir el vector en componentes que roten. Tomamos $x$ horizontal e $y$ vertical en el plano de la hoja. Un vector de módulo $B_0$ que forma un ángulo $\\theta$ con el eje $x$ tiene componentes $B_0\\cos\\theta$ y $B_0\\sin\\theta$.'
      + '\n\nComo gira a velocidad angular constante, el ángulo crece de forma pareja con el tiempo: $\\theta = \\omega t$. Con $\\omega = 2\\pi$ rad/s da una vuelta por segundo.',
    formula: [
      '\\vec B(t) = B_0 \\left[\\cos(\\omega t)\\,\\hat x + \\sin(\\omega t)\\,\\hat y\\right]',
      '\\theta(t) = \\omega\\, t',
    ],
    simbolos: [
      { simbolo: 'B_0',                 significado: 'Módulo del campo, constante [T]' },
      { simbolo: '\\omega',             significado: 'Velocidad angular = 2π rad/s' },
      { simbolo: 't',                   significado: 'Tiempo [s]' },
      { simbolo: '\\theta',             significado: 'Ángulo que forma B con el eje x [rad]' },
      { simbolo: '\\hat x,\\ \\hat y',  significado: 'Vectores de módulo 1 en las direcciones horizontal y vertical' },
    ],
    origen: 'Las componentes salen de trigonometría: el vector es la hipotenusa de un triángulo rectángulo, y sus proyecciones sobre los ejes son el cateto adyacente ($B_0\\cos\\theta$) y el opuesto ($B_0\\sin\\theta$).'
      + '\n\nEl módulo se mantiene constante porque $\\cos^2\\theta + \\sin^2\\theta = 1$, como pide el enunciado.',
    pregunta: {
      pregunta: '¿Qué cambia si en t = 0 el campo está a 45°, como en la figura?',
      respuesta: 'Se usa θ = ωt + 45°. Las dos corrientes se corren en el tiempo por igual, así que el desfase entre ellas sigue siendo 90°. Tomar B horizontal en t = 0 solo simplifica las cuentas.',
    },
  },

  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Qué parte de B atraviesa cada espira',
    texto: 'A cada espira solo la atraviesa la componente de $B$ perpendicular a su plano, es decir, la componente en la dirección de su normal $\\hat n$. La componente paralela al plano pasa "de canto" y no la atraviesa.'
      + '\n\n- Espira 1: su normal es horizontal ($\\hat n_1 = \\hat x$), así que ve $B_0\\cos(\\omega t)$.'
      + '\n- Espira 2: su normal es vertical ($\\hat n_2 = \\hat y$), así que ve $B_0\\sin(\\omega t)$.',
    formula: [
      '\\vec B \\cdot \\hat n_1 = B_0 \\cos(\\omega t)',
      '\\vec B \\cdot \\hat n_2 = B_0 \\sin(\\omega t)',
    ],
    simbolos: [
      { simbolo: '\\hat n',              significado: 'Vector normal a la espira (perpendicular a su plano, módulo 1)' },
      { simbolo: '\\vec B \\cdot \\hat n', significado: 'Producto escalar: da la componente de B en la dirección de n' },
    ],
    origen: 'El producto escalar de dos vectores es la suma de los productos componente a componente. Con $\\hat n_1 = (1, 0)$: $\\vec B\\cdot\\hat n_1 = B_0\\cos(\\omega t)\\cdot 1 + B_0\\sin(\\omega t)\\cdot 0$. Igual para $\\hat n_2 = (0, 1)$.',
    pregunta: {
      pregunta: '¿Por qué la componente paralela al plano de la espira no aporta?',
      respuesta: 'Porque sus líneas de campo pasan de costado, sin atravesar la superficie que encierra el anillo. El flujo cuenta solo lo que atraviesa la superficie, y eso lo mide la componente perpendicular.',
    },
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Flujo magnético en cada espira',
    texto: 'El flujo mide cuánto campo atraviesa la espira. Como $B$ es uniforme (igual en toda el área), sale de la integral y el flujo queda la componente perpendicular por el área.'
      + '\n\nCada flujo oscila como una onda, con período de 1 s. Son la misma onda corrida un cuarto de vuelta: coseno y seno.',
    formula: [
      '\\Phi = \\int \\vec B \\cdot d\\vec A = (\\vec B \\cdot \\hat n)\\, A',
      'A = \\pi a^2 = \\pi (0{,}20)^2 = 0{,}04\\pi \\approx 0{,}126\\ \\text{m}^2',
      '\\Phi_1(t) = B_0 A \\cos(\\omega t) \\qquad \\Phi_2(t) = B_0 A \\sin(\\omega t)',
    ],
    simbolos: [
      { simbolo: '\\Phi',     significado: 'Flujo magnético [Wb = T·m²]' },
      { simbolo: 'd\\vec A',  significado: 'Pedacito de área, con dirección normal a la superficie [m²]' },
      { simbolo: 'A',         significado: 'Área de la espira [m²]' },
      { simbolo: 'a',         significado: 'Radio de la espira = 0,20 m' },
    ],
    origen: 'El flujo es una definición, igual que el flujo eléctrico de Gauss: se suma, sobre cada pedacito de área, la componente de $B$ perpendicular a él. Con $B$ uniforme, $\\vec B\\cdot\\hat n$ es igual en todos los pedacitos y la suma da ese valor por el área total.',
    pregunta: {
      pregunta: '¿En qué momentos es máximo el flujo de la espira 1?',
      respuesta: 'Cuando B apunta a lo largo de su eje (horizontal): t = 0 y t = 0,5 s, con signos opuestos. Ahí B la atraviesa de frente. Cuando B está vertical, pasa de canto y el flujo es 0.',
    },
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Ley de Faraday-Lenz: fem y corrientes inducidas',
    texto: 'Por la Ley de Faraday, un flujo que cambia en el tiempo induce una fem. El signo menos es la Ley de Lenz: la corriente inducida circula de forma de oponerse al cambio de flujo. La corriente sale de la Ley de Ohm, $I = \\varepsilon/R$.'
      + '\n\nClave: la fem no depende de cuánto flujo hay, sino de qué tan rápido cambia. Por eso cada corriente es máxima cuando su flujo vale 0 (ahí la onda del flujo tiene la mayor pendiente) y vale 0 cuando el flujo es máximo.'
      + '\n\nVerificación con Lenz en $t = 0$: $B$ está horizontal, así que el flujo de la espira 2 es 0, pero empieza a crecer hacia arriba. La corriente inducida crea un campo hacia abajo para oponerse: sentido horario visto desde arriba, que coincide con $I_2(0) < 0$.',
    formula: [
      '\\varepsilon = -\\frac{d\\Phi}{dt}',
      '\\varepsilon_1(t) = B_0 A \\omega \\sin(\\omega t) \\qquad \\varepsilon_2(t) = -B_0 A \\omega \\cos(\\omega t)',
      'I_1(t) = \\frac{B_0 A \\omega}{R}\\sin(\\omega t) \\qquad I_2(t) = -\\frac{B_0 A \\omega}{R}\\cos(\\omega t)',
    ],
    simbolos: [
      { simbolo: '\\varepsilon',       significado: 'fem inducida [V]' },
      { simbolo: '\\frac{d\\Phi}{dt}', significado: 'Rapidez con que cambia el flujo [Wb/s = V]' },
      { simbolo: 'I',                  significado: 'Corriente inducida [A]' },
      { simbolo: 'R',                  significado: 'Resistencia de cada espira = 20 Ω' },
    ],
    origen: 'Las derivadas. $B_0$ y $A$ son constantes y salen afuera. Por regla de la cadena, $\\frac{d}{dt}\\cos(\\omega t) = -\\omega\\sin(\\omega t)$ y $\\frac{d}{dt}\\sin(\\omega t) = \\omega\\cos(\\omega t)$. El $\\omega$ que aparece adelante viene de derivar lo de adentro ($\\omega t$).'
      + '\n\nSentido positivo de cada corriente: regla de la mano derecha con su normal (pulgar según $\\hat n$, los dedos dan el sentido +). Visto desde la punta de $\\hat n$, el sentido + es antihorario.',
    pregunta: {
      pregunta: '¿Por qué la corriente es máxima justo cuando el flujo es cero?',
      respuesta: 'Porque Faraday depende de la variación del flujo, no de su valor. Cuando el flujo pasa por 0, B está cruzando el plano de la espira y el flujo cambia lo más rápido posible. Cuando el flujo es máximo, B está en la dirección del eje y en ese instante el flujo casi no cambia.',
    },
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Comportamiento de las corrientes y desfase',
    texto: 'Las dos corrientes tienen la misma amplitud y la misma frecuencia (1 Hz), porque las espiras son iguales y ven el mismo campo. Escribiendo $I_2$ como seno se ve el corrimiento: $I_2$ atrasa $\\pi/2$ respecto de $I_1$.'
      + '\n\n**Sí, están desfasadas 90°** (0,25 s, un cuarto de período). El desfase copia la geometría: las normales forman 90° y el campo tarda un cuarto de vuelta en pasar de una a la otra.'
      + '\n\nOtros comentarios:'
      + '\n- Son corrientes alternas: cada una cambia de sentido cada 0,5 s.'
      + '\n- La potencia total disipada es constante: $R(I_1^2 + I_2^2) = \\varepsilon_0^2/R$, porque $\\sin^2 + \\cos^2 = 1$.'
      + '\n- Es un generador bifásico. El proceso inverso (dos bobinas a 90° con corrientes desfasadas 90°) crea un campo rotante: es el principio del motor de inducción.',
    formula: [
      'I_2(t) = -I_0\\cos(\\omega t) = I_0 \\sin\\!\\left(\\omega t - \\frac{\\pi}{2}\\right)',
      '\\varepsilon_0 = B_0\\, \\pi a^2\\, \\omega = 0{,}08\\pi^2 B_0 \\approx 0{,}79\\, B_0\\ \\text{V}',
      'I_0 = \\frac{\\varepsilon_0}{R} \\approx 0{,}039\\, B_0\\ \\text{A}',
      'T = \\frac{2\\pi}{\\omega} = 1\\ \\text{s} \\qquad f = 1\\ \\text{Hz} \\qquad \\Delta t = \\frac{T}{4} = 0{,}25\\ \\text{s}',
    ],
    simbolos: [
      { simbolo: '\\varepsilon_0', significado: 'Amplitud (valor máximo) de la fem [V]' },
      { simbolo: 'I_0',            significado: 'Amplitud de la corriente [A]' },
      { simbolo: 'T',              significado: 'Período: tiempo de una oscilación completa [s]' },
      { simbolo: 'f',              significado: 'Frecuencia: oscilaciones por segundo [Hz]' },
      { simbolo: '\\Delta t',      significado: 'Corrimiento en el tiempo entre las dos corrientes [s]' },
    ],
    origen: 'La identidad $\\sin(x - \\pi/2) = -\\cos(x)$ permite escribir las dos corrientes con la misma función (seno) y leer el desfase directo: $\\pi/2$ rad = 90°. En tiempo: 90° es un cuarto de vuelta, y un cuarto de $T = 1$ s son 0,25 s.'
      + '\n\nCon el valor de ejemplo $B_0 = 0{,}1$ T: $\\varepsilon_0 \\approx 79$ mV e $I_0 \\approx 3{,}9$ mA.',
    pregunta: {
      pregunta: 'Si las espiras formaran 45° en lugar de 90°, ¿cuánto sería el desfase? ¿Y si B no girara?',
      respuesta: 'Con 45° el desfase sería 45° (0,125 s): copia el ángulo entre las normales. Si B no girara, el flujo sería constante y no habría fem ni corriente: Faraday necesita que el flujo cambie.',
    },
  },
]

export default function CampoRotante() {
  return (
    <EjercicioLayout
      titulo="Campo rotante — Ejercicio 1b"
      enunciado={<CampoRotanteEnunciado />}
      pasos={PASOS}
      Visual={CampoRotanteVisual}
    />
  )
}
