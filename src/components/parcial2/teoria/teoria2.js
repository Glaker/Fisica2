// Teoría y preguntas del ejercicio 2 (circuito RC-RL).
// Formato de cada sección y pregunta: ver TeoriaApunte.jsx.

export const SECCIONES = [
  {
    id: 'kirchhoff',
    titulo: 'Leyes de Kirchhoff',
    formula: [
      '\\sum I_{\\text{nodo}} = 0',
      '\\sum \\Delta V_{\\text{malla}} = 0',
    ],
    queDice: '**Nodos:** la suma de las corrientes que entran a un nodo es igual a la de las que salen. **Mallas:** al recorrer un camino cerrado, la suma de las subidas y caídas de tensión es cero. Convención de signos: atravesar una resistencia en el sentido de la corriente es $-IR$; atravesar una fuente de − a + es $+\\varepsilon$.',
    deDondeViene: '**Nodos:** conservación de la carga, que no se crea ni se acumula en un nodo. **Mallas:** conservación de la energía: una carga que da una vuelta y vuelve al mismo punto vuelve al mismo potencial.',
    cuandoSirve: 'En cualquier circuito. Con $n$ nodos se plantean $n-1$ ecuaciones de nodos independientes, y el resto de las ecuaciones sale de las mallas.',
    enElParcial: { texto: 'Con 4 nodos y 6 ramas, en t = 0⁺ y en t → ∞ el circuito quedaba reducido a una sola malla.', paso: 1 },
    nota: 'Con inductores, estrictamente el campo no es conservativo. La regla de mallas se sigue usando tratando la fem del inductor, $-L\\,di/dt$, como una caída de tensión más.',
  },
  {
    id: 'ohm-joule',
    titulo: 'Ley de Ohm y Ley de Joule',
    formula: [
      'V = I\\,R',
      '\\vec J = \\sigma\\,\\vec E',
      'P = V I = I^2 R = \\frac{V^2}{R}',
    ],
    queDice: '**Ohm:** en un material óhmico la corriente es proporcional a la tensión; la constante es la resistencia $R$ [Ω]. Su forma de fondo es local: $\\vec J = \\sigma\\vec E$, donde $\\sigma$ es la conductividad. **Joule:** la potencia que se disipa como calor en una resistencia.',
    deDondeViene: '**Ohm** es empírica: vale para metales a temperatura constante, no para todo material (un diodo no la cumple). **Joule:** una carga $dq$ que baja un potencial $V$ pierde energía $dq\\,V$, que se transfiere a la red del material en choques. Por unidad de tiempo, $P = V\\,dq/dt = V I$.',
    cuandoSirve: 'Resistencias en cualquier circuito. La resistencia de un conductor es $R = \\rho L/A$ (resistividad, largo, sección).',
    enElParcial: { texto: 'Ohm en cada caída de tensión y Joule para la potencia en R2 durante la descarga.', paso: 7 },
  },
  {
    id: 'capacitor',
    titulo: 'Capacitor',
    formula: [
      'C = \\frac{Q}{V}',
      'U_C = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C}',
      '\\text{Serie: } \\frac{1}{C_{eq}} = \\sum \\frac{1}{C_i}',
      '\\text{Paralelo: } C_{eq} = \\sum C_i',
    ],
    queDice: 'Dos conductores separados que guardan cargas $+Q$ y $-Q$. La capacidad $C$ [F] dice cuánta carga guarda por cada volt y depende solo de la geometría: para uno plano, $C = \\varepsilon_0 A/d$. Guarda energía en el campo eléctrico entre sus placas.',
    deDondeViene: '$C = Q/V$ es la definición. **Energía:** cargarlo es llevar carga de a poco contra el voltaje que ya tiene, $dW = (q/C)\\,dq$; integrando de 0 a $Q$ sale $Q^2/2C$. **Serie:** las placas unidas forman un conductor aislado y neutro, así que todos tienen la misma carga y los voltajes se suman. **Paralelo:** mismo voltaje, las cargas se suman.',
    cuandoSirve: 'Todo lo del primer parcial. En circuitos, lo importante es que su voltaje no puede saltar de golpe: para cambiar $V$ hay que mover carga, y eso lleva tiempo.',
    enElParcial: { texto: 'C1 y C2 en serie: C_eq = 1,5 mF, Q = 3,75 mC y U_C ≈ 4,69 mJ.', paso: 5 },
    nota: 'El ½ de la energía aparece porque al principio el voltaje es cero y crece mientras se carga: no cuesta lo mismo la primera carga que la última.',
  },
  {
    id: 'inductor',
    titulo: 'Inductor',
    formula: [
      'v_L = L\\,\\frac{di}{dt}',
      'U_L = \\frac{1}{2} L I^2',
    ],
    queDice: 'Una bobina. Cuando su corriente cambia, se induce en ella una fem que se opone al cambio. Su "inercia" es la inductancia $L$ [H]: le cuesta cambiar la corriente, no la corriente en sí. Guarda energía en su campo magnético.',
    deDondeViene: 'De la Ley de Faraday aplicada al flujo propio: $\\Phi = L\\,i$, entonces $\\varepsilon = -d\\Phi/dt = -L\\,di/dt$ (ver teoría del 1b). **Energía:** mientras la corriente crece, la fuente entrega $P = v\\,i = L\\,i\\,di/dt$ para vencer esa fem; integrando de 0 a $I$ sale $\\frac12 L I^2$.',
    cuandoSirve: 'En circuitos, lo importante es que su corriente no puede saltar de golpe: eso exigiría $di/dt$ infinito y un voltaje infinito.',
    enElParcial: { texto: 'U_L = ½·4 mH·(5/6 A)² ≈ 1,39 mJ.', paso: 5 },
    nota: 'Si se corta de golpe la corriente de un inductor (abrir un interruptor), el voltaje sube hasta que salta una chispa. Por eso en el inciso e la energía del inductor se disipa en el interruptor.',
  },
  {
    id: 'extremos',
    titulo: 'Comportamiento en t = 0⁺ y t → ∞',
    queDice: '- **t = 0⁺, capacitor descargado:** $V = 0$ → cable.'
      + '\n- **t = 0⁺, inductor sin corriente:** $i = 0$ → circuito abierto.'
      + '\n- **t → ∞, capacitor:** cargado, ya no circula corriente → circuito abierto.'
      + '\n- **t → ∞, inductor:** corriente constante, $di/dt = 0$ → $v_L = 0$ → cable.',
    deDondeViene: 'De las dos propiedades anteriores: el voltaje del capacitor y la corriente del inductor no pueden saltar. Justo después de cerrar mantienen el valor que tenían antes, y mucho tiempo después todo es constante (régimen estacionario).',
    cuandoSirve: 'Para calcular corrientes al cerrar o mucho tiempo después sin resolver ecuaciones diferenciales. "Mucho tiempo" significa muchas constantes de tiempo: en la práctica, más de $5\\tau$.',
    enElParcial: { texto: 'Incisos a y b: en cada caso el circuito se redujo a una sola malla.', paso: 2 },
  },
  {
    id: 'rc',
    titulo: 'Circuito RC: carga y descarga',
    formula: [
      '\\text{Descarga: } q(t) = Q_0\\,e^{-t/\\tau}',
      '\\text{Carga: } q(t) = Q_f\\left(1 - e^{-t/\\tau}\\right)',
      '\\tau = R\\,C',
    ],
    queDice: 'Al cargarse o descargarse a través de una resistencia, la carga cambia de forma exponencial. La constante de tiempo $\\tau$ [s] marca el ritmo: en un $\\tau$ la descarga baja al 37 % (o la carga llega al 63 %), y en unos $5\\tau$ se considera terminada (queda menos del 1 %).',
    deDondeViene: 'De Kirchhoff en la malla: $q/C - iR = 0$ con $i = -dq/dt$ da $dq/dt = -q/(RC)$. Separando variables e integrando, $\\ln(q/Q_0) = -t/RC$. Unidades: Ω·F = (V/A)·(C/V) = s.',
    cuandoSirve: 'Cualquier capacitor que se carga o descarga a través de resistencias. $R$ es la resistencia equivalente que "ve" el capacitor.',
    enElParcial: { texto: 'Descarga por R2 + R3 = 5 Ω con C_eq = 1,5 mF: τ = 7,5 ms.', paso: 6 },
  },
  {
    id: 'rl',
    titulo: 'Circuito RL',
    formula: [
      'i(t) = \\frac{\\varepsilon}{R}\\left(1 - e^{-t/\\tau}\\right)',
      '\\tau = \\frac{L}{R}',
    ],
    queDice: 'Al conectar una fuente a una resistencia y un inductor, la corriente no aparece de golpe: crece exponencialmente hasta $\\varepsilon/R$, con constante de tiempo $\\tau = L/R$.',
    deDondeViene: 'De Kirchhoff: $\\varepsilon - iR - L\\,di/dt = 0$. Es la misma ecuación diferencial que la del RC, con la corriente en lugar de la carga.',
    cuandoSirve: 'Cualquier inductor que se conecta o se desconecta. Con los valores del parcial, $\\tau_L$ es del orden de milisegundos.',
    enElParcial: { texto: 'Explica por qué la corriente por L es 0 en t = 0⁺ y 5/6 A en t → ∞.', paso: 2 },
    nota: 'En el ejercicio 2 hay un capacitor y un inductor en el mismo circuito, así que el transitorio completo al cerrar es más complejo (un sistema de ecuaciones diferenciales). No hace falta resolverlo: el enunciado solo pide los extremos, t = 0⁺ y t → ∞.',
  },
]

export const PREGUNTAS = [
  {
    pregunta: '¿Por qué un capacitor descargado se comporta como un cable al cerrar el circuito?',
    respuesta: 'Porque V = q/C y en t = 0⁺ todavía no tiene carga: su voltaje es cero. Un elemento con corriente y voltaje cero se comporta como un cable.',
    tema: 'Transitorios',
  },
  {
    pregunta: '¿Por qué el inductor se comporta como circuito abierto en t = 0⁺?',
    respuesta: 'Porque su corriente no puede saltar: exigiría di/dt infinito y un voltaje infinito. Si antes era cero, justo después sigue siendo cero, como un circuito abierto.',
    tema: 'Transitorios',
  },
  {
    pregunta: '¿Qué significa "un tiempo muy largo"?',
    respuesta: 'Muchas constantes de tiempo. Después de 5τ la exponencial bajó a menos del 1 %: el circuito está en régimen estacionario. Acá las τ son de milisegundos, así que "muy largo" es una fracción de segundo.',
    tema: 'Transitorios',
  },
  {
    pregunta: '¿Qué es τ y cuánto vale en la descarga?',
    respuesta: 'La constante de tiempo: en un τ la carga baja al 37 %. En la descarga τ = (R2 + R3)·C_eq = 5 Ω · 1,5 mF = 7,5 ms.',
    tema: 'RC',
  },
  {
    pregunta: '¿Por qué C1 y C2 tienen la misma carga?',
    respuesta: 'Porque están en serie: las placas que los unen forman un conductor aislado y neutro. Si una toma +Q, la otra queda con −Q.',
    tema: 'Capacitores',
  },
  {
    pregunta: '¿Por qué la energía del capacitor es ½QV y no QV?',
    respuesta: 'Porque el voltaje va creciendo mientras se carga: al principio es cero y al final es V. En promedio, cada carga se lleva contra V/2.',
    tema: 'Capacitores',
  },
  {
    pregunta: '¿Dónde está almacenada la energía del capacitor? ¿Y la del inductor?',
    respuesta: 'La del capacitor, en el campo eléctrico entre sus placas. La del inductor, en el campo magnético dentro de la bobina.',
    tema: 'Energía',
  },
  {
    pregunta: '¿Qué pasa con la energía del inductor al abrir S2?',
    respuesta: 'La corriente se corta de golpe, di/dt es enorme y el voltaje en el inductor sube hasta que salta una chispa en el interruptor. Ahí se disipan los 1,39 mJ. No afecta a los capacitores, que están en otra malla.',
    tema: 'Energía',
  },
  {
    pregunta: '¿Por qué no calcularon el transitorio completo al cerrar?',
    respuesta: 'Porque hay dos elementos que almacenan energía y el transitorio es un sistema de ecuaciones diferenciales. El enunciado solo pide t = 0⁺ y t → ∞, y ahí alcanza con el comportamiento límite de cada elemento.',
    tema: 'Transitorios',
  },
  {
    pregunta: '¿Por qué los capacitores tienen 2,5 V y no 5 V?',
    respuesta: 'Porque están en paralelo con R3 (a través de R2, que no tiene caída). La fuente reparte sus 5 V entre R3 y R4, que son iguales.',
    tema: 'Circuito',
  },
  {
    pregunta: '¿Por qué la energía disipada no se calcula como P·t?',
    respuesta: 'Porque la potencia no es constante: baja exponencialmente. Hay que integrar P(t) en el tiempo.',
    tema: 'Energía',
  },
  {
    pregunta: '¿Por qué R2 disipa 2/5 de la energía de los capacitores?',
    respuesta: 'Porque R2 y R3 están en serie: por las dos pasa la misma corriente, y la potencia i²R es proporcional a la resistencia. Se reparten 2 : 3.',
    tema: 'Energía',
  },
  {
    pregunta: 'Si la fuente estuviera al revés, ¿cambian los resultados?',
    respuesta: 'Cambian los sentidos de todas las corrientes, pero no los módulos, las cargas ni las energías.',
    tema: 'Circuito',
  },
]
