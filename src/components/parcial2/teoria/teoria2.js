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
    queDice: '**Nodos:** la suma de las {{i|corrientes}} que entran a un nodo es igual a la de las que salen. **Mallas:** al recorrer un camino cerrado, la suma de las subidas y caídas de tensión es cero. Convención de signos: atravesar una {{R|resistencia}} en el sentido de la {{i|corriente}} es $-IR$; atravesar una fuente de − a + es $+\\varepsilon$.',
    deDondeViene: '**Nodos:** conservación de la {{Q|carga}}, que no se crea ni se acumula en un nodo. **Mallas:** conservación de la {{U|energía}}: una {{Q|carga}} que da una vuelta y vuelve al mismo punto vuelve al mismo potencial.',
    cuandoSirve: 'En cualquier circuito. Con $n$ nodos se plantean $n-1$ ecuaciones de nodos independientes, y el resto de las ecuaciones sale de las mallas.',
    enElParcial: { texto: 'Con 4 nodos y 6 ramas, en t = 0⁺ y en t → ∞ el circuito quedaba reducido a una sola malla.', paso: 1 },
    nota: 'Con inductores, estrictamente el campo no es conservativo. La regla de mallas se sigue usando tratando la {{fem|fem}} del {{L|inductor}}, $-L\\,di/dt$, como una caída de tensión más.',
  },
  {
    id: 'ohm-joule',
    titulo: 'Ley de Ohm y Ley de Joule',
    formula: [
      'V = I\\,R',
      '\\vec J = \\sigma\\,\\vec E',
      'P = V I = I^2 R = \\frac{V^2}{R}',
    ],
    queDice: '**Ohm:** en un material óhmico la {{i|corriente}} es proporcional a la tensión; la constante es la {{R|resistencia}} $R$ [Ω]. Su forma de fondo es local: $\\vec J = \\sigma\\vec E$, donde $\\sigma$ es la conductividad. **Joule:** la potencia que se disipa como calor en una {{R|resistencia}}.',
    deDondeViene: '**Ohm** es empírica: vale para metales a temperatura constante, no para todo material (un diodo no la cumple). **Joule:** una {{Q|carga}} $dq$ que baja un potencial $V$ pierde {{U|energía}} $dq\\,V$, que se transfiere a la red del material en choques. Por unidad de tiempo, $P = V\\,dq/dt = V I$.',
    cuandoSirve: '{{R|Resistencias}} en cualquier circuito. La {{R|resistencia}} de un conductor es $R = \\rho L/A$ (resistividad, largo, sección).',
    enElParcial: { texto: 'Ohm en cada caída de tensión y Joule para la potencia en {{R|R2}} durante la descarga.', paso: 7 },
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
    queDice: 'Dos conductores separados que guardan cargas $+Q$ y $-Q$. La capacidad $C$ [F] dice cuánta {{Q|carga}} guarda por cada volt y depende solo de la geometría: para uno plano, $C = \\varepsilon_0 A/d$. Guarda {{U|energía}} en el campo eléctrico entre sus placas.',
    deDondeViene: '$C = Q/V$ es la definición. **{{U|Energía}}:** cargarlo es llevar {{Q|carga}} de a poco contra el {{V|voltaje}} que ya tiene, $dW = (q/C)\\,dq$; integrando de 0 a $Q$ sale $Q^2/2C$. **Serie:** las placas unidas forman un conductor aislado y neutro, así que todos tienen la misma {{Q|carga}} y los voltajes se suman. **Paralelo:** mismo {{V|voltaje}}, las cargas se suman.',
    cuandoSirve: 'Todo lo del primer parcial. En circuitos, lo importante es que su {{V|voltaje}} no puede saltar de golpe: para cambiar $V$ hay que mover {{Q|carga}}, y eso lleva tiempo.',
    enElParcial: { texto: '{{C|C1}} y {{C|C2}} en serie: C_eq = 1,5 mF, Q = 3,75 mC y U_C ≈ 4,69 mJ.', paso: 5 },
    nota: 'El ½ de la {{U|energía}} aparece porque al principio el {{V|voltaje}} es cero y crece mientras se {{Q|carga}}: no cuesta lo mismo la primera {{Q|carga}} que la última.',
  },
  {
    id: 'inductor',
    titulo: 'Inductor',
    formula: [
      'v_L = L\\,\\frac{di}{dt}',
      'U_L = \\frac{1}{2} L I^2',
    ],
    queDice: 'Una bobina. Cuando su {{i|corriente}} cambia, se induce en ella una {{fem|fem}} que se opone al cambio. Su "inercia" es la inductancia $L$ [H]: le cuesta cambiar la {{i|corriente}}, no la {{i|corriente}} en sí. Guarda {{U|energía}} en su campo magnético.',
    deDondeViene: 'De la Ley de Faraday aplicada al flujo propio: $N\\Phi = L\\,i$, entonces $\\varepsilon = -N\\,d\\Phi/dt = -L\\,di/dt$ (ver teoría del 1b). **{{U|Energía}}:** mientras la {{i|corriente}} crece, la fuente entrega $P = v\\,i = L\\,i\\,di/dt$ para vencer esa {{fem|fem}}; integrando de 0 a $I$ sale $\\frac12 L I^2$.',
    cuandoSirve: 'En circuitos, lo importante es que su {{i|corriente}} no puede saltar de golpe: eso exigiría $di/dt$ infinito y un {{V|voltaje}} infinito.',
    enElParcial: { texto: 'U_L = ½·4 mH·(5/6 A)² ≈ 1,39 mJ.', paso: 5 },
    nota: 'Si se corta de golpe la {{i|corriente}} de un {{L|inductor}} (abrir un interruptor), el {{V|voltaje}} sube hasta que salta una chispa. Por eso en el inciso e la {{U|energía}} del {{L|inductor}} se disipa en el interruptor.',
  },
  {
    id: 'extremos',
    titulo: 'Comportamiento en t = 0⁺ y t → ∞',
    queDice: '- **t = 0⁺, {{C|capacitor}} descargado:** $V = 0$ → cable.'
      + '\n- **t = 0⁺, {{L|inductor}} sin {{i|corriente}}:** $i = 0$ → circuito abierto.'
      + '\n- **t → ∞, {{C|capacitor}}:** cargado, ya no circula {{i|corriente}} → circuito abierto.'
      + '\n- **t → ∞, {{L|inductor}}:** {{i|corriente}} constante, $di/dt = 0$ → $v_L = 0$ → cable.',
    deDondeViene: 'De las dos propiedades anteriores: el {{V|voltaje}} del {{C|capacitor}} y la {{i|corriente}} del {{L|inductor}} no pueden saltar. Justo después de cerrar mantienen el valor que tenían antes, y mucho tiempo después todo es constante (régimen estacionario).',
    cuandoSirve: 'Para calcular {{i|corrientes}} al cerrar o mucho tiempo después sin resolver ecuaciones diferenciales. "Mucho tiempo" significa muchas constantes de tiempo: en la práctica, más de $5\\tau$.',
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
    queDice: 'Al cargarse o descargarse a través de una {{R|resistencia}}, la {{Q|carga}} cambia de forma exponencial. La {{tau|constante de tiempo}} $\\tau$ [s] marca el ritmo: en un $\\tau$ la descarga baja al 37 % (o la {{Q|carga}} llega al 63 %), y en unos $5\\tau$ se considera terminada (queda menos del 1 %).',
    deDondeViene: 'De Kirchhoff en la malla: $q/C - iR = 0$ con $i = -dq/dt$ da $dq/dt = -q/(RC)$. Separando variables e integrando, $\\ln(q/Q_0) = -t/RC$. Unidades: Ω·F = (V/A)·(C/V) = s.',
    cuandoSirve: 'Cualquier {{C|capacitor}} que se {{Q|carga}} o descarga a través de {{R|resistencias}}. $R$ es la {{R|resistencia}} equivalente que "ve" el {{C|capacitor}}.',
    enElParcial: { texto: 'Descarga por {{R|R2}} + {{R|R3}} = 5 Ω con C_eq = 1,5 mF: τ = 7,5 ms.', paso: 6 },
  },
  {
    id: 'rl',
    titulo: 'Circuito RL',
    formula: [
      'i(t) = \\frac{\\varepsilon}{R}\\left(1 - e^{-t/\\tau}\\right)',
      '\\tau = \\frac{L}{R}',
    ],
    queDice: 'Al conectar una fuente a una {{R|resistencia}} y un {{L|inductor}}, la {{i|corriente}} no aparece de golpe: crece exponencialmente hasta $\\varepsilon/R$, con {{tau|constante de tiempo}} $\\tau = L/R$.',
    deDondeViene: 'De Kirchhoff: $\\varepsilon - iR - L\\,di/dt = 0$. Es la misma ecuación diferencial que la del RC, con la {{i|corriente}} en lugar de la {{Q|carga}}.',
    cuandoSirve: 'Cualquier {{L|inductor}} que se conecta o se desconecta. Con los valores del parcial, $\\tau_L$ es del orden de milisegundos.',
    enElParcial: { texto: 'Explica por qué la {{i|corriente}} por {{L|L}} es 0 en t = 0⁺ y 5/6 A en t → ∞.', paso: 2 },
    nota: 'En el ejercicio 2 hay un {{C|capacitor}} y un {{L|inductor}} en el mismo circuito, así que el transitorio completo al cerrar es más complejo (un sistema de ecuaciones diferenciales). No hace falta resolverlo: el enunciado solo pide los extremos, t = 0⁺ y t → ∞.',
  },
]

export const PREGUNTAS = [
  {
    pregunta: '¿Por qué un {{C|capacitor}} descargado se comporta como un cable al cerrar el circuito?',
    respuesta: 'Porque V = q/C y en t = 0⁺ todavía no tiene {{Q|carga}}: su {{V|voltaje}} es cero. Un elemento con {{i|corriente}} y {{V|voltaje}} cero se comporta como un cable.',
    tema: 'Transitorios',
  },
  {
    pregunta: '¿Por qué el {{L|inductor}} se comporta como circuito abierto en t = 0⁺?',
    respuesta: 'Porque su {{i|corriente}} no puede saltar: exigiría di/dt infinito y un {{V|voltaje}} infinito. Si antes era cero, justo después sigue siendo cero, como un circuito abierto.',
    tema: 'Transitorios',
  },
  {
    pregunta: '¿Qué significa "un tiempo muy largo"?',
    respuesta: 'Muchas constantes de tiempo. Después de 5τ la exponencial bajó a menos del 1 %: el circuito está en régimen estacionario. Acá las τ son de milisegundos, así que "muy largo" es una fracción de segundo.',
    tema: 'Transitorios',
  },
  {
    pregunta: '¿Qué es τ y cuánto vale en la descarga?',
    respuesta: 'La {{tau|constante de tiempo}}: en un τ la {{Q|carga}} baja al 37 %. En la descarga τ = ({{R|R2}} + {{R|R3}})·C_eq = 5 Ω · 1,5 mF = 7,5 ms.',
    tema: 'RC',
  },
  {
    pregunta: '¿Por qué {{C|C1}} y {{C|C2}} tienen la misma {{Q|carga}}?',
    respuesta: 'Porque están en serie: las placas que los unen forman un conductor aislado y neutro. Si una toma +Q, la otra queda con −Q.',
    tema: 'Capacitores',
  },
  {
    pregunta: '¿Por qué la {{U|energía}} del {{C|capacitor}} es ½QV y no QV?',
    respuesta: 'Porque el {{V|voltaje}} va creciendo mientras se {{Q|carga}}: al principio es cero y al final es V. En promedio, cada {{Q|carga}} se lleva contra V/2.',
    tema: 'Capacitores',
  },
  {
    pregunta: '¿Dónde está almacenada la {{U|energía}} del {{C|capacitor}}? ¿Y la del {{L|inductor}}?',
    respuesta: 'La del {{C|capacitor}}, en el campo eléctrico entre sus placas. La del {{L|inductor}}, en el campo magnético dentro de la bobina.',
    tema: 'Energía',
  },
  {
    pregunta: '¿Qué pasa con la {{U|energía}} del {{L|inductor}} al abrir S2?',
    respuesta: 'La {{i|corriente}} se corta de golpe, di/dt es enorme y el {{V|voltaje}} en el {{L|inductor}} sube hasta que salta una chispa en el interruptor. Ahí se disipan los 1,39 mJ. No afecta a los {{C|capacitores}}, que están en otra malla.',
    tema: 'Energía',
  },
  {
    pregunta: '¿Por qué no calcularon el transitorio completo al cerrar?',
    respuesta: 'Porque hay dos elementos que almacenan {{U|energía}} y el transitorio es un sistema de ecuaciones diferenciales. El enunciado solo pide t = 0⁺ y t → ∞, y ahí alcanza con el comportamiento límite de cada elemento.',
    tema: 'Transitorios',
  },
  {
    pregunta: '¿Por qué los {{C|capacitores}} tienen 2,5 V y no 5 V?',
    respuesta: 'Porque están en paralelo con {{R|R3}} (a través de {{R|R2}}, que no tiene caída). La fuente reparte sus 5 V entre {{R|R3}} y {{R|R4}}, que son iguales.',
    tema: 'Circuito',
  },
  {
    pregunta: '¿Por qué la {{U|energía}} disipada no se calcula como P·t?',
    respuesta: 'Porque la potencia no es constante: baja exponencialmente. Hay que integrar P(t) en el tiempo.',
    tema: 'Energía',
  },
  {
    pregunta: '¿Por qué {{R|R2}} disipa 2/5 de la {{U|energía}} de los {{C|capacitores}}?',
    respuesta: 'Porque {{R|R2}} y {{R|R3}} están en serie: por las dos pasa la misma {{i|corriente}}, y la potencia i²R es proporcional a la {{R|resistencia}}. Se reparten 2 : 3.',
    tema: 'Energía',
  },
  {
    pregunta: 'Si la fuente estuviera al revés, ¿cambian los resultados?',
    respuesta: 'Cambian los sentidos de todas las {{i|corrientes}}, pero no los módulos, las cargas ni las energías.',
    tema: 'Circuito',
  },
]
