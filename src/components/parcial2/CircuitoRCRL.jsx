import EjercicioLayout from './EjercicioLayout'
import { PaletaContext } from '../Formula'
import CircuitoEnunciado from './circuito/CircuitoEnunciado'
import CircuitoVisual from './circuito/CircuitoVisual'
import './circuito/Circuito.css'
import * as teoria from './teoria/teoria2'

// Pasos de la resolución (ver formato en StepperResolucion.jsx).
// El Visual espera 7 pasos (índices 0 a 6).
const PASOS = [
  // ── 0 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Lectura del circuito',
    texto: 'Antes de calcular, identificamos los nodos (puntos donde se unen 3 o más ramas) y las ramas (caminos entre dos nodos). Hay 4 nodos (A, B, C, D) y 6 ramas.'
      + '\n\nLas herramientas son las Leyes de Kirchhoff: en cada nodo la {{i|corriente}} que entra es igual a la que sale, y en cada malla (camino cerrado) la suma de las caídas de tensión es cero.'
      + '\n\n{{C|C1}} y {{C|C2}} están **en serie**: forman una única rama entre C y D, sin ningún nodo entre ellos. Se pueden reemplazar por un solo {{C|capacitor}} equivalente.',
    formula: [
      '\\sum I_{\\text{nodo}} = 0',
      '\\sum \\Delta V_{\\text{malla}} = 0',
    ],
    simbolos: [
      { simbolo: '\\sum',                   significado: 'Suma de todos los términos' },
      { simbolo: 'I_{\\text{nodo}}',        significado: '{{i|Corrientes}} que entran (+) o salen (−) de un nodo [A]' },
      { simbolo: '\\Delta V_{\\text{malla}}', significado: 'Cambios de potencial al recorrer una malla completa [V]' },
    ],
    pregunta: {
      pregunta: '¿Por qué {{C|C1}} y {{C|C2}} están en serie?',
      respuesta: 'Porque entre ellos no hay ningún nodo: el cable que los une no tiene otra salida. Toda la {{Q|carga}} que llega a uno pasa al otro, así que los dos tienen siempre la misma {{Q|carga}}.',
    },
  },

  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Capacitor e inductor en los extremos del transitorio',
    texto: 'Justo al cerrar ($t = 0^+$) y mucho tiempo después ($t \\to \\infty$), {{C|capacitores}} e inductores se comportan de forma simple:'
      + '\n- **{{C|Capacitor}} descargado** en $t = 0^+$: su {{V|voltaje}} es 0 → se comporta como un cable.'
      + '\n- **{{C|Capacitor}} cargado** en $t \\to \\infty$: ya no circula {{i|corriente}} → se comporta como un circuito abierto.'
      + '\n- **{{L|Inductor}} sin {{i|corriente}}** en $t = 0^+$: la {{i|corriente}} no puede saltar desde 0 → se comporta como un circuito abierto.'
      + '\n- **{{L|Inductor}} con {{i|corriente}} constante** en $t \\to \\infty$: su {{V|voltaje}} es 0 → se comporta como un cable.',
    formula: [
      'V_C = \\frac{q}{C}',
      'V_L = L\\,\\frac{di}{dt}',
    ],
    simbolos: [
      { simbolo: 'V_C',             significado: '{{V|Voltaje}} del {{C|capacitor}} [V]' },
      { simbolo: 'q',               significado: '{{Q|Carga}} en sus placas [C]' },
      { simbolo: 'C',               significado: 'Capacidad [F]' },
      { simbolo: 'V_L',             significado: '{{V|Voltaje}} del {{L|inductor}} [V]' },
      { simbolo: 'L',               significado: 'Inductancia [H]' },
      { simbolo: '\\frac{di}{dt}',  significado: 'Rapidez con que cambia la {{i|corriente}} [A/s]' },
    ],
    origen: '$V_C = q/C$ es la definición de capacidad. Para cambiar $q$ tiene que circular {{i|corriente}} durante un tiempo, así que $V_C$ no puede saltar de golpe.'
      + '\n\n$V_L = L\\,di/dt$ sale de la Ley de Faraday: la {{i|corriente}} del {{L|inductor}} genera un flujo propio $\\Phi$ en cada una de sus $N$ vueltas, y la definición de $L$ es $N\\Phi = L\\,i$ (flujo concatenado). Si $i$ cambia, cambia el flujo y se induce una {{fem|fem}} que se opone (Lenz). Si $i$ saltara de golpe, $di/dt$ sería infinito y el {{V|voltaje}} también: por eso la {{i|corriente}} del {{L|inductor}} no puede saltar.',
    pregunta: {
      pregunta: '¿Por qué el {{V|voltaje}} de un {{C|capacitor}} no puede cambiar de golpe?',
      respuesta: 'Porque V = q/C y cambiar la {{Q|carga}} requiere que circule {{i|corriente}} durante un tiempo. Un salto instantáneo de V exigiría una {{i|corriente}} infinita.',
    },
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'a) Corrientes en t = 0⁺',
    texto: 'Reemplazamos los {{C|capacitores}} por un cable y el {{L|inductor}} por un circuito abierto.'
      + '\n\n- **{{R|R2}} y {{R|R3}} no llevan {{i|corriente}}.** El cable de los {{C|capacitores}} deja a C y D al mismo potencial. El camino C → {{R|R2}} → B → {{R|R3}} → D une dos puntos con la misma tensión, y B no tiene otra salida porque {{L|L}} está abierto.'
      + '\n- Queda una sola malla: fuente → A → {{R|R1}} → C → {{C|capacitores}} → D → {{R|R4}} → fuente.',
    formula: [
      '\\varepsilon \\hl{- I R_1 - I R_4} = 0',
      'I = \\frac{\\varepsilon}{R_1 + R_4} = \\frac{5}{2+3} = \\hl{1}\\ \\text{A}',
    ],
    simbolos: [
      { simbolo: '\\varepsilon', significado: '{{fem|fem}} de la fuente = 5 V' },
      { simbolo: 'I',            significado: '{{i|Corriente}} de la malla [A]' },
      { simbolo: 'I R',          significado: 'Caída de tensión en una {{R|resistencia}} (Ley de Ohm) [V]' },
    ],
    origen: 'Signos de Kirchhoff: atravesar la fuente de − a + suma $+\\varepsilon$; atravesar una {{R|resistencia}} en el sentido de la {{i|corriente}} resta $I R$.',
    pregunta: {
      pregunta: 'Si {{R|R2}} está conectada, ¿por qué no circula {{i|corriente}} por ella en t = 0?',
      respuesta: 'Porque para que circule {{i|corriente}} tiene que haber diferencia de potencial y un camino cerrado. {{R|R2}} y {{R|R3}} en serie unen C con D, que en t = 0⁺ están al mismo potencial (los {{C|capacitores}} descargados son un cable). Sin diferencia de potencial no hay {{i|corriente}}.',
    },
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'b) Corrientes en t → ∞',
    texto: 'Reemplazamos los {{C|capacitores}} por un circuito abierto y el {{L|inductor}} por un cable.'
      + '\n\n- **{{R|R1}} y {{R|R2}} no llevan {{i|corriente}}.** El nodo C solo conecta {{R|R1}}, {{R|R2}} y los {{C|capacitores}} (abiertos). {{R|R1}} y {{R|R2}} quedan en serie entre A y B, que están unidos por el cable del {{L|inductor}} y tienen el mismo potencial.'
      + '\n- Queda una sola malla: fuente → A → S2 → {{L|L}} → B → {{R|R3}} → D → {{R|R4}} → fuente.'
      + '\n\nVerificación: $\\varepsilon = I(R_3 + R_4)$ → $5 = \\frac{5}{6} \\cdot 6$ ✓',
    formula: [
      '\\varepsilon \\hl{- I R_3 - I R_4} = 0',
      'I = \\frac{\\varepsilon}{R_3 + R_4} = \\frac{5}{3+3} = \\eq{iinf}{\\frac{5}{6} \\approx 0{,}833}\\ \\text{A}',
    ],
    simbolos: [
      { simbolo: 'R_3,\\ R_4', significado: '{{R|Resistencias}} de la malla = 3 Ω cada una' },
    ],
    pregunta: {
      pregunta: '¿Por qué por {{R|R1}} no circula {{i|corriente}} si está conectada a la fuente?',
      respuesta: 'Porque sus dos extremos quedan al mismo potencial. Un extremo es A y el otro llega a B a través de {{R|R2}}; A y B están unidos por el {{L|inductor}}, que en t → ∞ es un cable. Además, C no tiene salida porque los {{C|capacitores}} están cargados.',
    },
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'c) Carga en los capacitores y d) energía en el inductor',
    texto: '**c)** Por {{R|R2}} no circula {{i|corriente}}, así que no hay caída de tensión en ella: C y B están al mismo potencial. Entonces los {{C|capacitores}} (entre C y D) tienen el mismo {{V|voltaje}} que {{R|R3}} (entre B y D): $V = I R_3 = 2{,}5$ V.'
      + '\n\nEn serie los dos tienen la misma {{Q|carga}}: $Q = 3{,}75$ mC cada uno, con 1,25 V cada uno.'
      + '\n\n**d)** La {{U|energía}} del {{L|inductor}} queda guardada en su campo magnético.',
    formula: [
      'V = I R_3 = \\eq{iinf}{\\frac{5}{6}}\\cdot 3 = \\eq{v}{2{,}5}\\ \\text{V}',
      'C_{eq} = \\frac{C_1 C_2}{C_1 + C_2} = \\frac{3 \\cdot 3}{3 + 3}\\ \\text{mF} = \\eq{ceq}{1{,}5}\\ \\text{mF}',
      'Q = \\eq{ceq}{C_{eq}}\\, \\eq{v}{V} = \\eq{ceq}{1{,}5\\times10^{-3}} \\cdot \\eq{v}{2{,}5} = \\eq{q0}{3{,}75}\\ \\text{mC}',
      'U_L = \\frac{1}{2} L I^2 = \\frac{1}{2}\\cdot 4\\times10^{-3}\\cdot\\left(\\eq{iinf}{\\frac{5}{6}}\\right)^2 \\approx \\hl{1{,}39}\\ \\text{mJ}',
    ],
    simbolos: [
      { simbolo: 'C_{eq}', significado: 'Capacidad equivalente de {{C|C1}} y {{C|C2}} en serie [F]' },
      { simbolo: 'Q',      significado: '{{Q|Carga}} de cada {{C|capacitor}} [C]' },
      { simbolo: 'U_L',    significado: '{{U|Energía}} almacenada en el {{L|inductor}} [J]' },
    ],
    origen: '**{{C|Capacitores}} en serie:** las placas unidas de {{C|C1}} y {{C|C2}} forman un conductor aislado y neutro. Si una toma $+Q$, la otra queda con $-Q$: los dos tienen la misma {{Q|carga}}. El {{V|voltaje}} total es $V = Q/C_1 + Q/C_2$, y el equivalente cumple $V = Q/C_{eq}$. Por eso $1/C_{eq} = 1/C_1 + 1/C_2$.'
      + '\n\n**{{U|Energía}} del {{L|inductor}}:** mientras la {{i|corriente}} crece, el {{L|inductor}} tiene un {{V|voltaje}} $v = L\\,di/dt$ que se opone. La fuente entrega $P = v\\,i = L\\,i\\,di/dt$ para vencerlo. Sumando en el tiempo: $U = \\int P\\,dt = \\int_0^I L\\,i\\,di = \\frac{1}{2}L I^2$.',
    pregunta: {
      pregunta: '¿Por qué los {{C|capacitores}} tienen 2,5 V y no los 5 V de la fuente?',
      respuesta: 'Porque no están conectados directamente a la fuente: están en paralelo con {{R|R3}} (a través de {{R|R2}}, que no tiene caída). La fuente reparte sus 5 V entre {{R|R3}} y {{R|R4}}, que son iguales, así que a {{R|R3}} y a los {{C|capacitores}} les tocan 2,5 V.',
    },
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'e) Carga después de abrir los interruptores',
    texto: '**Los {{C|capacitores}} terminan descargados: $Q \\to 0$.**'
      + '\n\nAl abrir S1 y S2, el nodo A queda aislado: la fuente, {{R|R1}}, {{R|R4}} y {{L|L}} quedan sin camino cerrado. Pero los {{C|capacitores}} siguen conectados en una malla cerrada con {{R|R2}} y {{R|R3}}, y se descargan a través de ellas.'
      + '\n\nEs un circuito RC de descarga con $R = R_2 + R_3 = 5\\ \\Omega$ y $C_{eq} = 1{,}5$ mF. Planteando Kirchhoff en esa malla, con $i = -dq/dt$ (la {{Q|carga}} baja), la solución es una exponencial decreciente.'
      + '\n\nSobre el {{L|inductor}}: al abrir S2 su {{i|corriente}} se corta de golpe. En la práctica salta una chispa en el interruptor y ahí se disipan los 1,39 mJ. No afecta a los {{C|capacitores}}, que están en otra malla.',
    formula: [
      '\\frac{q}{\\eq{ceq}{C_{eq}}} - i\\,(R_2 + R_3) = 0 \\;\\Rightarrow\\; \\hl{\\frac{dq}{dt} = -\\frac{q}{(R_2+R_3)\\,\\eq{ceq}{C_{eq}}}}',
      'q(t) = \\eq{q0}{Q_0}\\, \\eq{desc}{e^{-t/\\tau}}',
      '\\tau = (R_2+R_3)\\,\\eq{ceq}{C_{eq}} = 5 \\cdot \\eq{ceq}{1{,}5\\times10^{-3}} = \\eq{tau}{7{,}5}\\ \\text{ms}',
    ],
    simbolos: [
      { simbolo: 'q(t)',   significado: '{{Q|Carga}} en cada {{C|capacitor}} en el instante t [C]' },
      { simbolo: 'Q_0',    significado: '{{Q|Carga}} al abrir = 3,75 mC' },
      { simbolo: '\\tau',  significado: '{{tau|Constante de tiempo}}; en τ la {{Q|carga}} baja al 37 % [s]' },
      { simbolo: 'e',      significado: 'Número de Euler ≈ 2,718' },
    ],
    origen: '**Separación de variables:** con $\\tau = (R_2+R_3)C_{eq}$ queda $dq/q = -dt/\\tau$. Integrando la {{Q|carga}} desde $Q_0$ hasta $q$ y el tiempo desde 0 hasta $t$: $\\ln(q/Q_0) = -t/\\tau$. Aplicando exponencial: $q = Q_0\\,e^{-t/\\tau}$.'
      + '\n\n**Unidades de τ:** $\\Omega\\cdot F = \\frac{V}{A}\\cdot\\frac{C}{V} = \\frac{C}{A} = s$. Es un tiempo.',
    pregunta: {
      pregunta: '¿Por qué no queda nada de {{Q|carga}}, si la fuente ya no está conectada?',
      respuesta: 'Porque los {{C|capacitores}} quedan en una malla cerrada con {{R|R2}} y {{R|R3}}, que no pasa por ningún interruptor. Mientras tengan {{Q|carga}} hay {{V|voltaje}} y circula {{i|corriente}}, hasta que se descargan por completo. En unos 5τ ≈ 37,5 ms ya están prácticamente descargados.',
    },
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'f) Potencia y energía disipadas en R2',
    texto: 'El inciso pide describir cómo se calcularía. El procedimiento:'
      + '\n1) Obtener la {{i|corriente}} de descarga derivando $q(t)$.'
      + '\n2) Calcular la potencia en {{R|R2}} con la Ley de Joule, $P = i^2 R_2$. Varía en el tiempo.'
      + '\n3) Como la potencia no es constante, la {{U|energía}} no es $P \\cdot t$: hay que integrar la potencia desde 0 hasta 5 s.'
      + '\n\nComo 5 s son unas 667 constantes de tiempo, $e^{-10/\\tau}$ es prácticamente 0: en esos 5 s {{R|R2}} disipa toda la {{U|energía}} que le corresponde.'
      + '\n\n**Verificación:** los {{C|capacitores}} tenían $U_C = \\frac{1}{2}C_{eq}V^2 \\approx 4{,}69$ mJ. {{R|R2}} y {{R|R3}} están en serie (misma {{i|corriente}}), así que se reparten esa {{U|energía}} en proporción a su {{R|resistencia}}, 2 : 3. {{R|R2}} se lleva $\\frac{2}{5}\\cdot 4{,}69 \\approx 1{,}875$ mJ ✓',
    formula: [
      'i(t) = -\\frac{dq}{dt} = \\frac{\\eq{v}{V_0}}{R_2+R_3}\\,\\eq{desc}{e^{-t/\\tau}} = 0{,}5\\,\\eq{desc}{e^{-t/\\tau}}\\ \\text{A}',
      'P_{R_2}(t) = i^2 R_2 = \\hl{0{,}5\\,e^{-2t/\\tau}}\\ \\text{W}',
      'E_{R_2} = \\int_0^{5} P_{R_2}\\,dt = 0{,}5\\cdot\\frac{\\eq{tau}{\\tau}}{2}\\left(1 - e^{-10/\\tau}\\right) \\approx \\hl{1{,}875}\\ \\text{mJ}',
    ],
    simbolos: [
      { simbolo: 'i(t)',     significado: '{{i|Corriente}} de descarga [A]' },
      { simbolo: 'V_0',      significado: '{{V|Voltaje}} de los {{C|capacitores}} al abrir = 2,5 V' },
      { simbolo: 'P_{R_2}',  significado: 'Potencia disipada en {{R|R2}} [W]' },
      { simbolo: 'E_{R_2}',  significado: '{{U|Energía}} disipada en {{R|R2}} [J]' },
    ],
    origen: '**La {{i|corriente}}:** derivando, $-\\frac{d}{dt}\\left(Q_0 e^{-t/\\tau}\\right) = \\frac{Q_0}{\\tau}e^{-t/\\tau}$. Como $Q_0 = C_{eq}V_0$ y $\\tau = (R_2+R_3)C_{eq}$, queda $\\frac{Q_0}{\\tau} = \\frac{V_0}{R_2+R_3} = 0{,}5$ A: la {{i|corriente}} inicial es la que daría Ohm con el {{V|voltaje}} inicial.'
      + '\n\n**La integral:** la primitiva de $e^{kt}$ es $e^{kt}/k$. Con $k = -2/\\tau$, la primitiva de $e^{-2t/\\tau}$ es $-\\frac{\\tau}{2}e^{-2t/\\tau}$; evaluando entre 0 y 5 s queda $\\frac{\\tau}{2}(1 - e^{-10/\\tau})$.'
      + '\n\n**{{U|Energía}} de un {{C|capacitor}}:** cargarlo cuesta $dW = v\\,dq = \\frac{q}{C}dq$; integrando de 0 a $Q$: $U_C = \\frac{Q^2}{2C} = \\frac{1}{2}CV^2$.',
    pregunta: {
      pregunta: '¿Por qué {{R|R2}} disipa menos {{U|energía}} que {{R|R3}}?',
      respuesta: 'Porque están en serie: pasa la misma {{i|corriente}} por las dos, y la potencia i²R es proporcional a la {{R|resistencia}}. {{R|R2}} = 2 Ω y {{R|R3}} = 3 Ω se reparten la {{U|energía}} 2 : 3, así que {{R|R2}} se lleva 2/5 del total (1,875 mJ) y {{R|R3}} los 3/5 restantes (2,81 mJ).',
    },
  },
]

// Símbolo → color (ver .mc-* en Parcial2.css)
const PALETA = { 'ε': 'fem', I: 'i', i: 'i', R: 'R', C: 'C', L: 'L', V: 'V', q: 'Q', Q: 'Q', 'τ': 'tau', U: 'U', E: 'U' }

// Ecuaciones con color propio (el orden define el color). Ver \\eq{...} en las fórmulas.
const ECUACIONES = {
  iinf: { label: 'Corriente en t → ∞',        tex: 'I = \\frac{5}{6}\\ \\text{A}' },
  v:    { label: 'Voltaje de los capacitores', tex: 'V = 2{,}5\\ \\text{V}' },
  ceq:  { label: 'Capacidad equivalente',      tex: 'C_{eq} = 1{,}5\\ \\text{mF}' },
  q0:   { label: 'Carga inicial',              tex: 'Q_0 = 3{,}75\\ \\text{mC}' },
  tau:  { label: 'Constante de tiempo',        tex: '\\tau = 7{,}5\\ \\text{ms}' },
  desc: { label: 'Decaimiento exponencial',    tex: 'q(t) = Q_0\\, e^{-t/\\tau}' },
}

export default function CircuitoRCRL() {
  return (
    <PaletaContext.Provider value={PALETA}>
      <EjercicioLayout
        enunciado={<CircuitoEnunciado />}
        pasos={PASOS}
        ecuaciones={ECUACIONES}
        Visual={CircuitoVisual}
        teoria={{ secciones: teoria.SECCIONES, preguntas: teoria.PREGUNTAS }}
      />
    </PaletaContext.Provider>
  )
}
