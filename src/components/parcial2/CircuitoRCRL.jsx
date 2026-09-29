import EjercicioLayout from './EjercicioLayout'
import CircuitoEnunciado from './circuito/CircuitoEnunciado'
import CircuitoVisual from './circuito/CircuitoVisual'
import './circuito/Circuito.css'

// Pasos de la resolución (ver formato en StepperResolucion.jsx).
// El Visual espera 7 pasos (índices 0 a 6).
const PASOS = [
  // ── 0 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Lectura del circuito',
    texto: 'Antes de calcular, identificamos los nodos (puntos donde se unen 3 o más ramas) y las ramas (caminos entre dos nodos). Hay 4 nodos (A, B, C, D) y 6 ramas.'
      + '\n\nLas herramientas son las Leyes de Kirchhoff: en cada nodo la corriente que entra es igual a la que sale, y en cada malla (camino cerrado) la suma de las caídas de tensión es cero.'
      + '\n\nC1 y C2 están **en serie**: forman una única rama entre C y D, sin ningún nodo entre ellos. Se pueden reemplazar por un solo capacitor equivalente.',
    formula: [
      '\\sum I_{\\text{nodo}} = 0',
      '\\sum \\Delta V_{\\text{malla}} = 0',
    ],
    simbolos: [
      { simbolo: '\\sum',                   significado: 'Suma de todos los términos' },
      { simbolo: 'I_{\\text{nodo}}',        significado: 'Corrientes que entran (+) o salen (−) de un nodo [A]' },
      { simbolo: '\\Delta V_{\\text{malla}}', significado: 'Cambios de potencial al recorrer una malla completa [V]' },
    ],
    pregunta: {
      pregunta: '¿Por qué C1 y C2 están en serie?',
      respuesta: 'Porque entre ellos no hay ningún nodo: el cable que los une no tiene otra salida. Toda la carga que llega a uno pasa al otro, así que los dos tienen siempre la misma carga.',
    },
  },

  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'Capacitor e inductor en los extremos del transitorio',
    texto: 'Justo al cerrar ($t = 0^+$) y mucho tiempo después ($t \\to \\infty$), capacitores e inductores se comportan de forma simple:'
      + '\n- **Capacitor descargado** en $t = 0^+$: su voltaje es 0 → se comporta como un cable.'
      + '\n- **Capacitor cargado** en $t \\to \\infty$: ya no circula corriente → se comporta como un circuito abierto.'
      + '\n- **Inductor sin corriente** en $t = 0^+$: la corriente no puede saltar desde 0 → se comporta como un circuito abierto.'
      + '\n- **Inductor con corriente constante** en $t \\to \\infty$: su voltaje es 0 → se comporta como un cable.',
    formula: [
      'V_C = \\frac{q}{C}',
      'V_L = L\\,\\frac{di}{dt}',
    ],
    simbolos: [
      { simbolo: 'V_C',             significado: 'Voltaje del capacitor [V]' },
      { simbolo: 'q',               significado: 'Carga en sus placas [C]' },
      { simbolo: 'C',               significado: 'Capacidad [F]' },
      { simbolo: 'V_L',             significado: 'Voltaje del inductor [V]' },
      { simbolo: 'L',               significado: 'Inductancia [H]' },
      { simbolo: '\\frac{di}{dt}',  significado: 'Rapidez con que cambia la corriente [A/s]' },
    ],
    origen: '$V_C = q/C$ es la definición de capacidad. Para cambiar $q$ tiene que circular corriente durante un tiempo, así que $V_C$ no puede saltar de golpe.'
      + '\n\n$V_L = L\\,di/dt$ sale de la Ley de Faraday: la corriente del inductor genera un flujo propio $\\Phi = L\\,i$ (esa es la definición de $L$). Si $i$ cambia, cambia el flujo y se induce una fem que se opone (Lenz). Si $i$ saltara de golpe, $di/dt$ sería infinito y el voltaje también: por eso la corriente del inductor no puede saltar.',
    pregunta: {
      pregunta: '¿Por qué el voltaje de un capacitor no puede cambiar de golpe?',
      respuesta: 'Porque V = q/C y cambiar la carga requiere que circule corriente durante un tiempo. Un salto instantáneo de V exigiría una corriente infinita.',
    },
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'a) Corrientes en t = 0⁺',
    texto: 'Reemplazamos los capacitores por un cable y el inductor por un circuito abierto.'
      + '\n\n- **R2 y R3 no llevan corriente.** El cable de los capacitores deja a C y D al mismo potencial. El camino C → R2 → B → R3 → D une dos puntos con la misma tensión, y B no tiene otra salida porque L está abierto.'
      + '\n- Queda una sola malla: fuente → A → R1 → C → capacitores → D → R4 → fuente.',
    formula: [
      '\\varepsilon - I R_1 - I R_4 = 0',
      'I = \\frac{\\varepsilon}{R_1 + R_4} = \\frac{5}{2+3} = 1\\ \\text{A}',
    ],
    simbolos: [
      { simbolo: '\\varepsilon', significado: 'fem de la fuente = 5 V' },
      { simbolo: 'I',            significado: 'Corriente de la malla [A]' },
      { simbolo: 'I R',          significado: 'Caída de tensión en una resistencia (Ley de Ohm) [V]' },
    ],
    origen: 'Signos de Kirchhoff: atravesar la fuente de − a + suma $+\\varepsilon$; atravesar una resistencia en el sentido de la corriente resta $I R$.',
    pregunta: {
      pregunta: 'Si R2 está conectada, ¿por qué no circula corriente por ella en t = 0?',
      respuesta: 'Porque para que circule corriente tiene que haber diferencia de potencial y un camino cerrado. R2 y R3 en serie unen C con D, que en t = 0⁺ están al mismo potencial (los capacitores descargados son un cable). Sin diferencia de potencial no hay corriente.',
    },
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'b) Corrientes en t → ∞',
    texto: 'Reemplazamos los capacitores por un circuito abierto y el inductor por un cable.'
      + '\n\n- **R1 y R2 no llevan corriente.** El nodo C solo conecta R1, R2 y los capacitores (abiertos). R1 y R2 quedan en serie entre A y B, que están unidos por el cable del inductor y tienen el mismo potencial.'
      + '\n- Queda una sola malla: fuente → A → S2 → L → B → R3 → D → R4 → fuente.'
      + '\n\nVerificación: $\\varepsilon = I(R_3 + R_4)$ → $5 = \\frac{5}{6} \\cdot 6$ ✓',
    formula: [
      '\\varepsilon - I R_3 - I R_4 = 0',
      'I = \\frac{\\varepsilon}{R_3 + R_4} = \\frac{5}{3+3} = \\frac{5}{6} \\approx 0{,}833\\ \\text{A}',
    ],
    simbolos: [
      { simbolo: 'R_3,\\ R_4', significado: 'Resistencias de la malla = 3 Ω cada una' },
    ],
    pregunta: {
      pregunta: '¿Por qué por R1 no circula corriente si está conectada a la fuente?',
      respuesta: 'Porque sus dos extremos quedan al mismo potencial. Un extremo es A y el otro llega a B a través de R2; A y B están unidos por el inductor, que en t → ∞ es un cable. Además, C no tiene salida porque los capacitores están cargados.',
    },
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'c) Carga en los capacitores y d) energía en el inductor',
    texto: '**c)** Por R2 no circula corriente, así que no hay caída de tensión en ella: C y B están al mismo potencial. Entonces los capacitores (entre C y D) tienen el mismo voltaje que R3 (entre B y D): $V = I R_3 = 2{,}5$ V.'
      + '\n\nEn serie los dos tienen la misma carga: $Q = 3{,}75$ mC cada uno, con 1,25 V cada uno.'
      + '\n\n**d)** La energía del inductor queda guardada en su campo magnético.',
    formula: [
      'V = I R_3 = \\frac{5}{6}\\cdot 3 = 2{,}5\\ \\text{V}',
      'C_{eq} = \\frac{C_1 C_2}{C_1 + C_2} = \\frac{3 \\cdot 3}{3 + 3}\\ \\text{mF} = 1{,}5\\ \\text{mF}',
      'Q = C_{eq} V = 1{,}5\\times10^{-3} \\cdot 2{,}5 = 3{,}75\\ \\text{mC}',
      'U_L = \\frac{1}{2} L I^2 = \\frac{1}{2}\\cdot 4\\times10^{-3}\\cdot\\left(\\frac{5}{6}\\right)^2 \\approx 1{,}39\\ \\text{mJ}',
    ],
    simbolos: [
      { simbolo: 'C_{eq}', significado: 'Capacidad equivalente de C1 y C2 en serie [F]' },
      { simbolo: 'Q',      significado: 'Carga de cada capacitor [C]' },
      { simbolo: 'U_L',    significado: 'Energía almacenada en el inductor [J]' },
    ],
    origen: '**Capacitores en serie:** las placas unidas de C1 y C2 forman un conductor aislado y neutro. Si una toma $+Q$, la otra queda con $-Q$: los dos tienen la misma carga. El voltaje total es $V = Q/C_1 + Q/C_2$, y el equivalente cumple $V = Q/C_{eq}$. Por eso $1/C_{eq} = 1/C_1 + 1/C_2$.'
      + '\n\n**Energía del inductor:** mientras la corriente crece, el inductor tiene un voltaje $v = L\\,di/dt$ que se opone. La fuente entrega $P = v\\,i = L\\,i\\,di/dt$ para vencerlo. Sumando en el tiempo: $U = \\int P\\,dt = \\int_0^I L\\,i\\,di = \\frac{1}{2}L I^2$.',
    pregunta: {
      pregunta: '¿Por qué los capacitores tienen 2,5 V y no los 5 V de la fuente?',
      respuesta: 'Porque no están conectados directamente a la fuente: están en paralelo con R3 (a través de R2, que no tiene caída). La fuente reparte sus 5 V entre R3 y R4, que son iguales, así que a R3 y a los capacitores les tocan 2,5 V.',
    },
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'e) Carga después de abrir los interruptores',
    texto: '**Los capacitores terminan descargados: $Q \\to 0$.**'
      + '\n\nAl abrir S1 y S2, el nodo A queda aislado: la fuente, R1, R4 y L quedan sin camino cerrado. Pero los capacitores siguen conectados en una malla cerrada con R2 y R3, y se descargan a través de ellas.'
      + '\n\nEs un circuito RC de descarga con $R = R_2 + R_3 = 5\\ \\Omega$ y $C_{eq} = 1{,}5$ mF. Planteando Kirchhoff en esa malla, con $i = -dq/dt$ (la carga baja), la solución es una exponencial decreciente.'
      + '\n\nSobre el inductor: al abrir S2 su corriente se corta de golpe. En la práctica salta una chispa en el interruptor y ahí se disipan los 1,39 mJ. No afecta a los capacitores, que están en otra malla.',
    formula: [
      '\\frac{q}{C_{eq}} - i\\,(R_2 + R_3) = 0 \\;\\Rightarrow\\; \\frac{dq}{dt} = -\\frac{q}{(R_2+R_3)\\,C_{eq}}',
      'q(t) = Q_0\\, e^{-t/\\tau} \\qquad \\tau = (R_2+R_3)\\,C_{eq} = 5 \\cdot 1{,}5\\times10^{-3} = 7{,}5\\ \\text{ms}',
    ],
    simbolos: [
      { simbolo: 'q(t)',   significado: 'Carga en cada capacitor en el instante t [C]' },
      { simbolo: 'Q_0',    significado: 'Carga al abrir = 3,75 mC' },
      { simbolo: '\\tau',  significado: 'Constante de tiempo; en τ la carga baja al 37 % [s]' },
      { simbolo: 'e',      significado: 'Número de Euler ≈ 2,718' },
    ],
    origen: '**Separación de variables:** con $\\tau = (R_2+R_3)C_{eq}$ queda $dq/q = -dt/\\tau$. Integrando la carga desde $Q_0$ hasta $q$ y el tiempo desde 0 hasta $t$: $\\ln(q/Q_0) = -t/\\tau$. Aplicando exponencial: $q = Q_0\\,e^{-t/\\tau}$.'
      + '\n\n**Unidades de τ:** $\\Omega\\cdot F = \\frac{V}{A}\\cdot\\frac{C}{V} = \\frac{C}{A} = s$. Es un tiempo.',
    pregunta: {
      pregunta: '¿Por qué no queda nada de carga, si la fuente ya no está conectada?',
      respuesta: 'Porque los capacitores quedan en una malla cerrada con R2 y R3, que no pasa por ningún interruptor. Mientras tengan carga hay voltaje y circula corriente, hasta que se descargan por completo. En unos 5τ ≈ 37,5 ms ya están prácticamente descargados.',
    },
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    titulo: 'f) Potencia y energía disipadas en R2',
    texto: 'El inciso pide describir cómo se calcularía. El procedimiento:'
      + '\n- 1) Obtener la corriente de descarga derivando $q(t)$.'
      + '\n- 2) Calcular la potencia en R2 con la Ley de Joule, $P = i^2 R_2$. Varía en el tiempo.'
      + '\n- 3) Como la potencia no es constante, la energía no es $P \\cdot t$: hay que integrar la potencia desde 0 hasta 5 s.'
      + '\n\nComo 5 s son unas 667 constantes de tiempo, $e^{-10/\\tau}$ es prácticamente 0: en esos 5 s R2 disipa toda la energía que le corresponde.'
      + '\n\n**Verificación:** los capacitores tenían $U_C = \\frac{1}{2}C_{eq}V^2 \\approx 4{,}69$ mJ. R2 y R3 están en serie (misma corriente), así que se reparten esa energía en proporción a su resistencia, 2 : 3. R2 se lleva $\\frac{2}{5}\\cdot 4{,}69 \\approx 1{,}875$ mJ ✓',
    formula: [
      'i(t) = -\\frac{dq}{dt} = \\frac{V_0}{R_2+R_3}\\,e^{-t/\\tau} = 0{,}5\\,e^{-t/\\tau}\\ \\text{A}',
      'P_{R_2}(t) = i^2 R_2 = 0{,}5\\,e^{-2t/\\tau}\\ \\text{W}',
      'E_{R_2} = \\int_0^{5} P_{R_2}\\,dt = 0{,}5\\cdot\\frac{\\tau}{2}\\left(1 - e^{-10/\\tau}\\right) \\approx 1{,}875\\ \\text{mJ}',
    ],
    simbolos: [
      { simbolo: 'i(t)',     significado: 'Corriente de descarga [A]' },
      { simbolo: 'V_0',      significado: 'Voltaje de los capacitores al abrir = 2,5 V' },
      { simbolo: 'P_{R_2}',  significado: 'Potencia disipada en R2 [W]' },
      { simbolo: 'E_{R_2}',  significado: 'Energía disipada en R2 [J]' },
    ],
    origen: '**La corriente:** derivando, $-\\frac{d}{dt}\\left(Q_0 e^{-t/\\tau}\\right) = \\frac{Q_0}{\\tau}e^{-t/\\tau}$. Como $Q_0 = C_{eq}V_0$ y $\\tau = (R_2+R_3)C_{eq}$, queda $\\frac{Q_0}{\\tau} = \\frac{V_0}{R_2+R_3} = 0{,}5$ A: la corriente inicial es la que daría Ohm con el voltaje inicial.'
      + '\n\n**La integral:** la primitiva de $e^{kt}$ es $e^{kt}/k$. Con $k = -2/\\tau$, la primitiva de $e^{-2t/\\tau}$ es $-\\frac{\\tau}{2}e^{-2t/\\tau}$; evaluando entre 0 y 5 s queda $\\frac{\\tau}{2}(1 - e^{-10/\\tau})$.'
      + '\n\n**Energía de un capacitor:** cargarlo cuesta $dW = v\\,dq = \\frac{q}{C}dq$; integrando de 0 a $Q$: $U_C = \\frac{Q^2}{2C} = \\frac{1}{2}CV^2$.',
    pregunta: {
      pregunta: '¿Por qué R2 disipa menos energía que R3?',
      respuesta: 'Porque están en serie: pasa la misma corriente por las dos, y la potencia i²R es proporcional a la resistencia. R2 = 2 Ω y R3 = 3 Ω se reparten la energía 2 : 3, así que R2 se lleva 2/5 del total (1,875 mJ) y R3 los 3/5 restantes (2,81 mJ).',
    },
  },
]

export default function CircuitoRCRL() {
  return (
    <EjercicioLayout
      titulo="Circuito RC-RL — Ejercicio 2"
      enunciado={<CircuitoEnunciado />}
      pasos={PASOS}
      Visual={CircuitoVisual}
    />
  )
}
