// Teoría y preguntas del ejercicio 1b (campo rotante).
// Formato de cada sección y pregunta: ver TeoriaApunte.jsx.

export const SECCIONES = [
  {
    id: 'flujo',
    titulo: 'Flujo magnético',
    formula: '\\Phi = \\int \\vec B \\cdot d\\vec A',
    queDice: 'Mide cuánto campo magnético atraviesa una superficie: se suma, sobre cada pedacito de área, la componente de $B$ perpendicular a él. Si $B$ es uniforme, queda $\\Phi = B\\,A\\cos\\theta$, con $\\theta$ el ángulo entre $B$ y la normal. Unidad: weber, 1 Wb = 1 T·m².',
    deDondeViene: 'Es una definición, la misma idea que el flujo eléctrico de la Ley de Gauss.',
    cuandoSirve: 'Es la magnitud que aparece en la Ley de Faraday. El flujo puede cambiar por tres motivos: cambia $B$, cambia el área, o cambia el ángulo entre ellos. En el 1b cambia el ángulo.',
    enElParcial: { texto: 'Φ₁ = B₀A·cos(ωt) y Φ₂ = B₀A·sen(ωt), según la normal de cada espira.', paso: 3 },
  },
  {
    id: 'faraday',
    titulo: 'Ley de Faraday',
    formula: [
      '\\varepsilon = -\\frac{d\\Phi}{dt}',
      '\\oint \\vec E \\cdot d\\vec l = -\\frac{d\\Phi}{dt}',
    ],
    queDice: 'Un flujo magnético que cambia en el tiempo induce una fem en cualquier camino cerrado que lo rodee. No importa cuánto flujo hay, sino qué tan rápido cambia. Con $N$ vueltas, la fem se multiplica por $N$.',
    deDondeViene: 'Es experimental: Faraday (1831), y de forma independiente Henry. Es una de las cuatro ecuaciones de Maxwell. La segunda forma muestra qué pasa físicamente: el campo magnético variable crea un campo eléctrico que circula en caminos cerrados, y ese campo empuja las cargas del alambre.',
    cuandoSirve: 'Siempre. Es la base de generadores, transformadores e inductores.',
    enElParcial: { texto: 'Derivando el flujo de cada espira se obtuvieron ε₁ y ε₂.', paso: 4 },
    nota: 'Diferencia clave con el primer parcial: en electrostática $\\oint \\vec E\\cdot d\\vec l = 0$ (el campo es conservativo y existe el potencial). El campo eléctrico inducido no es conservativo: su circulación es la fem, distinta de cero.',
  },
  {
    id: 'lenz',
    titulo: 'Ley de Lenz',
    formula: '\\varepsilon = -\\frac{d\\Phi}{dt} \\quad \\text{(el signo menos)}',
    queDice: 'La corriente inducida circula en el sentido que genera un campo que se opone al **cambio** de flujo. Si el flujo crece, la corriente crea un campo en contra; si el flujo decrece, crea un campo a favor para "reponerlo". Se opone al cambio, no al campo.',
    deDondeViene: 'De la conservación de la energía. Si la corriente reforzara el cambio, ese cambio induciría más corriente, que lo reforzaría más, sin fin: se crearía energía de la nada. La energía que disipan las espiras la aporta lo que hace girar el campo.',
    cuandoSirve: 'Para determinar el sentido de la corriente inducida. Procedimiento: 1) ver hacia dónde apunta el flujo y si crece o decrece; 2) la corriente crea un campo que se opone a ese cambio; 3) con la regla de la mano derecha, pasar de ese campo al sentido de la corriente.',
    enElParcial: { texto: 'En t = 0 el flujo de la espira 2 empieza a crecer hacia arriba, así que la corriente crea un campo hacia abajo: sentido horario visto desde arriba.', paso: 4 },
  },
  {
    id: 'fem',
    titulo: 'Fuerza electromotriz (fem)',
    formula: '\\varepsilon = \\oint \\frac{\\vec F}{q}\\cdot d\\vec l',
    queDice: 'Es el trabajo por unidad de carga que se hace sobre una carga al dar una vuelta completa al circuito. Se mide en volts, pero **no es una fuerza**: el nombre es histórico.',
    deDondeViene: 'Es una definición. Su origen puede ser químico (una pila), magnético (inducción) o mecánico.',
    cuandoSirve: 'En un circuito, la fem es lo que mantiene circulando la corriente. Con resistencia $R$ y sin otras fem: $I = \\varepsilon/R$.',
    enElParcial: { texto: 'I₁ = ε₁/R e I₂ = ε₂/R, con R = 20 Ω.', paso: 4 },
    nota: 'Con un campo inducido no se puede hablar de "diferencia de potencial" entre dos puntos de la espira, porque el campo no es conservativo. Por eso se habla de fem.',
  },
  {
    id: 'induccion',
    titulo: 'Autoinducción e inducción mutua',
    formula: [
      'L = \\frac{N\\,\\Phi}{I}',
      'M = \\frac{N_2\\,\\Phi_{21}}{I_1}',
      'L_{\\text{solenoide}} = \\frac{\\mu_0 N^2 A}{\\ell}',
      'M = \\frac{\\mu_0 N_1 N_2 A}{\\ell}',
    ],
    queDice: 'Una corriente genera un campo y, por lo tanto, un flujo. Si ese flujo atraviesa el mismo circuito, es **autoinducción** ($L$): cuando la corriente cambia, el propio circuito se induce una fem que se opone, $\\varepsilon = -L\\,dI/dt$. Si atraviesa otro circuito, es **inducción mutua** ($M$): la corriente de uno induce fem en el otro. Unidad: henry (H).',
    deDondeViene: 'Es la Ley de Faraday aplicada al flujo que genera la propia corriente (o la del otro circuito). $L$ y $M$ dependen solo de la geometría y del material.',
    cuandoSirve: 'Inductores, transformadores. En la fórmula de $M$ aparecen $N_1$ y $N_2$: el flujo que genera el solenoide 1 depende de $N_1$, y la fem en el 2 se multiplica por sus $N_2$ vueltas (ojo: en el video de la clase 14 falta el $N_2$).',
    nota: 'En el 1b se despreció la autoinducción de cada espira y la inducción mutua entre ellas. Una espira de 20 cm de radio tiene $L \\approx 1\\ \\mu$H, entonces $\\omega L \\approx 10^{-5}\\ \\Omega$, despreciable frente a 20 Ω. Si no fuera despreciable, la corriente quedaría atrasada respecto de la fem.',
  },
  {
    id: 'alterna',
    titulo: 'Señales alternas y desfase',
    formula: [
      'x(t) = X_0\\sin(\\omega t + \\varphi)',
      'T = \\frac{2\\pi}{\\omega} \\qquad f = \\frac{1}{T}',
      'X_{ef} = \\frac{X_0}{\\sqrt 2}',
    ],
    queDice: 'Una señal alterna senoidal queda definida por su amplitud $X_0$ (valor máximo), su frecuencia angular $\\omega$ (o su período $T$, o su frecuencia $f$) y su fase $\\varphi$. Dos señales de la misma frecuencia están **desfasadas** si llegan a sus máximos en momentos distintos: el desfase es la diferencia de fases. Un desfase de 90° equivale a un cuarto de período. El valor eficaz $X_{ef}$ es el que produce la misma potencia media que una corriente continua de ese valor.',
    deDondeViene: 'Cualquier cosa que gira a velocidad constante produce senos y cosenos: la proyección de un vector que gira sobre un eje fijo.',
    cuandoSirve: 'Corriente alterna: la red eléctrica es de 50 Hz y 220 V eficaces (≈ 311 V de amplitud). Para inductores y capacitores en alterna se usan las reactancias $X_L = \\omega L$ y $X_C = 1/(\\omega C)$, que desfasan la corriente respecto de la tensión.',
    enElParcial: { texto: 'I₁ e I₂ tienen la misma amplitud y frecuencia (1 Hz) y están desfasadas 90° (0,25 s). Con B₀ = 0,1 T, la corriente eficaz de cada espira es ≈ 2,8 mA.', paso: 5 },
  },
  {
    id: 'generador',
    titulo: 'Generador y motor de inducción',
    formula: '\\varepsilon = N B A\\,\\omega\\,\\sin(\\omega t)',
    queDice: 'En un generador, una espira gira dentro de un campo fijo. En el 1b pasa lo contrario: el campo gira y la espira está quieta. Para Faraday es lo mismo, porque solo importa cómo cambia el flujo: se obtiene la misma fem. Con dos espiras a 90° se obtiene un **generador bifásico**: dos tensiones iguales desfasadas 90°.',
    deDondeViene: 'Del cálculo del 1b. Con la espira girando, la fem se explica por la fuerza de Lorentz sobre las cargas que se mueven con el alambre ($\\vec v\\times\\vec B$). Con el campo girando, por el campo eléctrico inducido. Las dos dan lo mismo: es la "regla del flujo".',
    cuandoSirve: 'El proceso inverso es el **motor de inducción**: dos bobinas a 90° alimentadas con corrientes desfasadas 90° crean un campo que gira, y ese campo arrastra al rotor. Es el motor más usado en la industria.',
    enElParcial: { texto: 'La potencia total disipada R(I₁² + I₂²) es constante, como en un sistema bifásico.', paso: 5 },
  },
]

export const PREGUNTAS = [
  {
    pregunta: '¿Qué dice la Ley de Faraday y qué hace falta para que haya fem inducida?',
    respuesta: 'Que un flujo magnético que cambia en el tiempo induce una fem, ε = −dΦ/dt. Hace falta que el flujo cambie: por cambio de B, del área o del ángulo. Un flujo grande pero constante no induce nada.',
    tema: 'Faraday',
  },
  {
    pregunta: '¿De dónde sale el signo menos?',
    respuesta: 'Es la Ley de Lenz: la corriente inducida se opone al cambio de flujo. Viene de la conservación de la energía: si lo reforzara, se crearía energía de la nada.',
    tema: 'Lenz',
  },
  {
    pregunta: '¿Por qué la corriente es máxima justo cuando el flujo es cero?',
    respuesta: 'Porque la fem depende de la rapidez con que cambia el flujo. Cuando el flujo pasa por cero, B está cruzando el plano de la espira y el flujo cambia lo más rápido posible. Cuando el flujo es máximo, en ese instante casi no cambia.',
    tema: 'Faraday',
  },
  {
    pregunta: '¿Por qué las corrientes están desfasadas 90°?',
    respuesta: 'Porque las normales de las espiras forman 90°. El campo tarda un cuarto de vuelta en pasar de apuntar según una normal a apuntar según la otra, y un cuarto de vuelta es 90° o 0,25 s.',
    tema: 'Desfase',
  },
  {
    pregunta: '¿Qué pasaría si el campo girara el doble de rápido?',
    respuesta: 'ω se duplica: el período baja a 0,5 s y, como ω aparece multiplicando en la fem (ε₀ = B₀Aω), la amplitud de la fem y de la corriente también se duplica. El desfase sigue siendo 90°.',
    tema: 'Faraday',
  },
  {
    pregunta: '¿Y si las espiras fueran paralelas?',
    respuesta: 'Tendrían la misma normal, el mismo flujo y la misma corriente: desfase 0°. El desfase copia el ángulo entre las normales.',
    tema: 'Desfase',
  },
  {
    pregunta: '¿Por qué despreciaron la autoinducción?',
    respuesta: 'Porque una espira de 20 cm tiene L ≈ 1 μH y a 1 Hz ωL ≈ 10⁻⁵ Ω, despreciable frente a 20 Ω. Entonces I = ε/R y la corriente queda en fase con la fem.',
    tema: 'Suposiciones',
  },
  {
    pregunta: '¿El campo eléctrico inducido es conservativo?',
    respuesta: 'No. Su circulación en un camino cerrado es la fem, distinta de cero. Por eso no se puede definir un potencial para él, a diferencia del campo electrostático del primer parcial.',
    tema: 'Faraday',
  },
  {
    pregunta: 'Si la espira fuera de plástico, ¿habría fem?',
    respuesta: 'Sí. La fem es la circulación del campo eléctrico inducido y existe igual. Lo que no habría es corriente, porque el plástico no tiene cargas libres.',
    tema: 'Faraday',
  },
  {
    pregunta: '¿Qué pasa con la fem si la espira tiene N vueltas?',
    respuesta: 'Se multiplica por N: cada vuelta ve el mismo flujo y las fem se suman en serie.',
    tema: 'Faraday',
  },
  {
    pregunta: '¿Qué es el valor eficaz de una corriente alterna?',
    respuesta: 'El valor de una corriente continua que disiparía la misma potencia media. Para una senoidal es la amplitud dividida por √2.',
    tema: 'Alterna',
  },
  {
    pregunta: '¿Qué relación tiene este ejercicio con un motor eléctrico?',
    respuesta: 'Es el proceso inverso del motor de inducción: dos bobinas a 90° con corrientes desfasadas 90° generan un campo rotante que arrastra al rotor. Acá el campo rotante genera dos corrientes desfasadas 90°.',
    tema: 'Aplicaciones',
  },
]
