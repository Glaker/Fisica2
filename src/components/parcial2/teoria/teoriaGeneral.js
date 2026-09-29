// Teoría general del parcial (no pertenece a un ejercicio: "enElParcial" va sin paso).
// Formato de cada sección y pregunta: ver TeoriaApunte.jsx.

export const SECCIONES = [
  {
    id: 'maxwell',
    titulo: 'Ecuaciones de Maxwell',
    // Alineadas en el "=", con el nombre de cada ley en una columna aparte (&&) en gris
    formula: '\\begin{aligned}'
      + '\\oint \\vec E\\cdot d\\vec A &= \\frac{Q_{enc}}{\\varepsilon_0} && \\quad\\textcolor{#9aa0b4}{\\text{Gauss}} \\\\[4pt]'
      + '\\oint \\vec B\\cdot d\\vec A &= 0 && \\quad\\textcolor{#9aa0b4}{\\text{Gauss magnética}} \\\\[4pt]'
      + '\\oint \\vec E\\cdot d\\vec l &= -\\frac{d\\Phi_B}{dt} && \\quad\\textcolor{#9aa0b4}{\\text{Faraday}} \\\\[4pt]'
      + '\\oint \\vec B\\cdot d\\vec l &= \\mu_0\\left(I_{enc} + \\varepsilon_0\\frac{d\\Phi_E}{dt}\\right) && \\quad\\textcolor{#9aa0b4}{\\text{Ampère-Maxwell}}'
      + '\\end{aligned}',
    queDice: 'Son las cuatro leyes que describen todo el electromagnetismo clásico:'
      + '\n- **Gauss (eléctrica):** las cargas son fuentes del campo eléctrico; el flujo de $E$ por una superficie cerrada es la carga encerrada sobre $\\varepsilon_0$.'
      + '\n- **Gauss (magnética):** no existen cargas magnéticas; el flujo de $B$ por una superficie cerrada es cero y sus líneas son cerradas.'
      + '\n- **Faraday:** un campo magnético que cambia crea un campo eléctrico que circula.'
      + '\n- **Ampère-Maxwell:** las corrientes y los campos eléctricos que cambian crean un campo magnético que circula.',
    deDondeViene: 'Tres son leyes experimentales anteriores (Gauss-Coulomb, Faraday, Ampère). Maxwell (1865) las reunió y agregó el término $\\varepsilon_0\\,d\\Phi_E/dt$ a la de Ampère (ver sección 2). No se deducen de nada más básico: son el punto de partida de la teoría.',
    cuandoSirve: 'Siempre, en el vacío. En materiales se usan versiones con $\\varepsilon$ y $\\mu$ del material.',
    enElParcial: { texto: 'Primer parcial: Gauss eléctrica. 1a: Ampère (sin el término de Maxwell) y Gauss magnética para la simetría. 1b: Faraday. Ejercicio 2: Faraday en el inductor y Gauss en el capacitor.' },
    nota: 'Juntando Faraday y Ampère-Maxwell sale que los campos pueden propagarse solos como ondas, a la velocidad $c = 1/\\sqrt{\\mu_0\\varepsilon_0} \\approx 3\\times10^8$ m/s. Así Maxwell descubrió que la luz es una onda electromagnética.',
  },
  {
    id: 'desplazamiento',
    titulo: 'Corriente de desplazamiento',
    formula: 'I_d = \\varepsilon_0\\,\\frac{d\\Phi_E}{dt}',
    queDice: 'Es el término que Maxwell agregó a la Ley de Ampère. No es un movimiento de cargas: es un campo eléctrico que cambia en el tiempo, y genera campo magnético igual que una corriente.',
    deDondeViene: 'De una contradicción en la Ley de Ampère original. Mientras un capacitor se carga, tomemos un camino que rodea el cable. Si la superficie apoyada en el camino corta el cable, encierra corriente; si pasa entre las placas, no encierra ninguna. La ley daría dos valores distintos de $B$ para el mismo camino. Entre las placas, el campo eléctrico crece, y $\\varepsilon_0\\,d\\Phi_E/dt$ resulta exactamente igual a la corriente del cable: con este término, las dos superficies dan lo mismo.',
    cuandoSirve: 'Cuando hay campos eléctricos variables: capacitores cargándose, ondas electromagnéticas. Con corrientes estacionarias vale cero y queda la Ampère original.',
    enElParcial: { texto: 'En el 1a la corriente es estacionaria y no hay E variable: se usó la Ampère original. En el ejercicio 2, mientras los capacitores se cargan o se descargan, entre sus placas hay corriente de desplazamiento igual a la corriente de la rama.' },
  },
  {
    id: 'lorentz',
    titulo: 'Fuerza de Lorentz',
    formula: [
      '\\vec F = q\\left(\\vec E + \\vec v\\times\\vec B\\right)',
      '\\vec F = I\\,\\vec L\\times\\vec B',
      '\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}',
    ],
    queDice: 'Es la fuerza total sobre una carga en campos eléctrico y magnético. La parte magnética es perpendicular a la velocidad, así que **no hace trabajo**: cambia la dirección de la carga, pero no su rapidez. En un campo uniforme, una carga que entra perpendicular hace un círculo de radio $r = mv/(|q|B)$. Sobre un cable con corriente la fuerza es $I\\vec L\\times\\vec B$. Dos cables paralelos se atraen si sus corrientes van en el mismo sentido y se repelen si van en sentidos opuestos.',
    deDondeViene: 'Es experimental. La parte magnética es la que define $B$. La fuerza entre cables sale de combinar el campo de un cable ($\\mu_0 I/2\\pi d$, por Ampère) con la fuerza sobre el otro.',
    cuandoSirve: 'Motores, espectrómetros de masa, ciclotrones, deflexión de haces en tubos de rayos catódicos.',
    enElParcial: { texto: 'En un generador con la espira girando, la fem se explica por v×B sobre las cargas del alambre (ver teoría del 1b).' },
  },
  {
    id: 'dipolo',
    titulo: 'Dipolo magnético',
    formula: [
      '\\vec\\mu = N I A\\,\\hat n',
      '\\vec\\tau = \\vec\\mu\\times\\vec B',
      'U = -\\vec\\mu\\cdot\\vec B',
    ],
    queDice: 'Una espira con corriente se comporta como un imán chico: tiene un momento dipolar magnético $\\vec\\mu$ [A·m²], perpendicular a la espira según la regla de la mano derecha. En un campo uniforme la fuerza neta es cero, pero hay un torque que tiende a alinear $\\vec\\mu$ con $\\vec B$. La energía es mínima cuando están alineados.',
    deDondeViene: 'De la fuerza de Lorentz sobre cada lado de la espira: las fuerzas se cancelan, pero no están sobre la misma línea y forman un par.',
    cuandoSirve: 'Motores de corriente continua, brújulas, el origen del magnetismo de los materiales (los electrones se comportan como dipolos).',
    enElParcial: { texto: 'En el 1b, las espiras con corriente dentro del campo rotante sienten un torque: es el principio del motor de inducción.' },
  },
  {
    id: 'espira',
    titulo: 'Campo de una espira circular',
    formula: [
      'B_{\\text{eje}}(z) = \\frac{\\mu_0 I a^2}{2\\left(a^2 + z^2\\right)^{3/2}}',
      'B_{\\text{centro}} = \\frac{\\mu_0 I}{2a}',
    ],
    queDice: 'El campo de una espira de radio $a$ sobre su eje, a distancia $z$ del centro, apunta a lo largo del eje. Lejos de la espira ($z \\gg a$) decae como $1/z^3$: es el campo de un dipolo.',
    deDondeViene: 'De Biot-Savart. Por simetría, las componentes perpendiculares al eje de los tramos opuestos se cancelan y solo quedan las componentes a lo largo del eje.',
    cuandoSirve: 'Es el ejemplo típico de Biot-Savart: acá Ampère no sirve porque no hay un camino donde $B$ sea constante.',
  },
  {
    id: 'solenoide',
    titulo: 'Solenoide y toroide',
    formula: [
      'B_{\\text{solenoide}} = \\mu_0\\,n\\,I',
      'B_{\\text{toroide}} = \\frac{\\mu_0 N I}{2\\pi r}',
    ],
    queDice: 'Adentro de un solenoide largo el campo es uniforme y paralelo al eje; $n$ es la cantidad de vueltas por metro. Afuera es prácticamente cero. En un toroide el campo queda encerrado adentro y decae como $1/r$.',
    deDondeViene: 'De la Ley de Ampère. En el solenoide se usa un rectángulo con un lado adentro y otro afuera; en el toroide, un círculo dentro del núcleo.',
    cuandoSirve: 'Electroimanes, inductores. La inductancia de un solenoide, $L = \\mu_0 N^2 A/\\ell$, sale de este campo.',
  },
  {
    id: 'materia',
    titulo: 'Magnetismo en la materia',
    formula: [
      '\\mu = \\mu_r\\,\\mu_0',
      '\\mu_r = 1 + \\chi_m',
    ],
    queDice: 'Los materiales responden a un campo magnético porque sus átomos se comportan como dipolos. Tres tipos:'
      + '\n- **Diamagnéticos** ($\\chi_m$ negativo y muy chico): se oponen levemente al campo y son repelidos. Cobre, agua, bismuto.'
      + '\n- **Paramagnéticos** ($\\chi_m$ positivo y chico): sus dipolos se alinean un poco con el campo y son atraídos débilmente. Aluminio, oxígeno.'
      + '\n- **Ferromagnéticos** ($\\mu_r$ de cientos a miles): sus dipolos se alinean en regiones (dominios) y multiplican el campo; pueden quedar magnetizados. Hierro, níquel, cobalto.',
    deDondeViene: 'Del comportamiento de los electrones en los átomos: su movimiento orbital y su espín los hacen dipolos magnéticos.',
    cuandoSirve: 'Núcleos de transformadores y electroimanes (ferromagnéticos, para multiplicar $B$). Por encima de la temperatura de Curie un ferromagnético pasa a ser paramagnético. La **histéresis** es que la magnetización depende de la historia: al sacar el campo queda una magnetización remanente, y así se hacen los imanes permanentes.',
    enElParcial: { texto: 'En los tres ejercicios se supuso μ = μ₀: materiales no magnéticos.' },
  },
]

export const PREGUNTAS = [
  {
    pregunta: 'Enunciá las cuatro ecuaciones de Maxwell y qué significa cada una.',
    respuesta: 'Gauss eléctrica: las cargas generan E. Gauss magnética: no hay monopolos, las líneas de B son cerradas. Faraday: un B variable genera un E que circula. Ampère-Maxwell: las corrientes y los E variables generan un B que circula.',
    tema: 'Maxwell',
  },
  {
    pregunta: '¿Qué ecuaciones de Maxwell usaron en este parcial y dónde?',
    respuesta: 'Ampère en el 1a, con Gauss magnética para justificar la simetría. Faraday en el 1b y en el inductor del ejercicio 2. Gauss eléctrica está detrás del capacitor, y fue la base del primer parcial.',
    tema: 'Maxwell',
  },
  {
    pregunta: '¿Qué es la corriente de desplazamiento y por qué hizo falta?',
    respuesta: 'Es ε₀·dΦ_E/dt: un campo eléctrico variable que genera campo magnético como si fuera una corriente. Hizo falta porque, con un capacitor cargándose, la Ampère original daba resultados distintos según la superficie elegida. Con este término queda consistente y predice las ondas electromagnéticas.',
    tema: 'Maxwell',
  },
  {
    pregunta: '¿Existen los monopolos magnéticos?',
    respuesta: 'Nunca se observaron. La Ley de Gauss del magnetismo lo expresa: el flujo de B por cualquier superficie cerrada es cero. Si cortás un imán, obtenés dos imanes con norte y sur.',
    tema: 'Maxwell',
  },
  {
    pregunta: '¿La fuerza magnética puede cambiar la rapidez de una carga?',
    respuesta: 'No. Es perpendicular a la velocidad, así que no hace trabajo: solo cambia la dirección. Por eso una carga en un B uniforme hace un círculo con rapidez constante.',
    tema: 'Lorentz',
  },
  {
    pregunta: '¿Dos cables paralelos con corrientes en el mismo sentido se atraen o se repelen?',
    respuesta: 'Se atraen. El campo de cada uno, sobre el otro, produce una fuerza I L×B hacia el primero. Con corrientes opuestas se repelen.',
    tema: 'Lorentz',
  },
  {
    pregunta: '¿Qué le pasa a una espira con corriente en un campo uniforme?',
    respuesta: 'La fuerza neta es cero, pero siente un torque τ = μ×B que tiende a alinear su momento dipolar con B. Es el principio del motor de corriente continua.',
    tema: 'Dipolo',
  },
  {
    pregunta: '¿Por qué para una espira circular se usa Biot-Savart y no Ampère?',
    respuesta: 'Porque no hay un camino cerrado donde B sea constante y paralelo: la simetría no alcanza para sacar B de la integral. Ampère sigue siendo cierta, pero no permite despejar B.',
    tema: 'Biot-Savart',
  },
  {
    pregunta: '¿Cuánto vale B dentro de un solenoide largo y por qué afuera es casi cero?',
    respuesta: 'B = μ₀nI, uniforme. Afuera los campos de las vueltas se cancelan casi por completo; con Ampère, en un rectángulo con un lado afuera, ese lado no aporta.',
    tema: 'Ampère',
  },
  {
    pregunta: '¿Qué diferencia hay entre diamagnéticos, paramagnéticos y ferromagnéticos?',
    respuesta: 'Los diamagnéticos se oponen levemente al campo (χ < 0), los paramagnéticos se alinean débilmente (χ > 0 chico) y los ferromagnéticos se alinean en dominios y multiplican mucho el campo (μᵣ de cientos a miles).',
    tema: 'Materia',
  },
  {
    pregunta: '¿Qué es la histéresis?',
    respuesta: 'Que la magnetización de un ferromagnético depende de su historia: al sacar el campo externo queda una magnetización remanente. Así se hacen los imanes permanentes.',
    tema: 'Materia',
  },
  {
    pregunta: '¿Qué relación hay entre μ₀, ε₀ y la luz?',
    respuesta: 'La velocidad de las ondas electromagnéticas que predicen las ecuaciones de Maxwell es c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s. Coincidía con la velocidad de la luz medida: así se supo que la luz es una onda electromagnética.',
    tema: 'Maxwell',
  },
]
