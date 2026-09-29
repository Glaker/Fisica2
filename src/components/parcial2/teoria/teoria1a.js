// Teoría y preguntas del ejercicio 1a (cable con J(r)).
// Formato de cada sección y pregunta: ver TeoriaApunte.jsx.

export const SECCIONES = [
  {
    id: 'campo-magnetico',
    titulo: 'Campo magnético',
    formula: '\\vec F = q\\,\\vec v \\times \\vec B',
    queDice: 'El campo magnético $\\vec B$ es lo que generan las cargas en movimiento (corrientes e imanes) y se detecta por la fuerza que ejerce sobre otras cargas en movimiento. Esa fuerza es la de Lorentz: es perpendicular a la velocidad y al campo. De hecho, esta fórmula es la que define $B$ y su unidad: 1 T = 1 N/(A·m).',
    deDondeViene: 'Es experimental. Ørsted (1820) observó que una corriente desvía una brújula: fue la primera evidencia de que la electricidad y el magnetismo están relacionados.',
    cuandoSirve: 'Siempre que haya cargas en movimiento. Una carga quieta no siente fuerza magnética.',
    nota: 'Las líneas de $B$ son siempre cerradas: no empiezan ni terminan en ningún lado (ver sección 4). Las del campo eléctrico, en cambio, nacen en cargas positivas y mueren en negativas.',
  },
  {
    id: 'corriente',
    titulo: 'Corriente y densidad de corriente',
    formula: [
      'I = \\int \\vec J \\cdot d\\vec A',
      '\\vec J = n\\,q\\,\\vec v_d',
    ],
    queDice: '$I$ es la carga que atraviesa una sección por segundo [A]. $\\vec J$ dice cómo está repartida esa corriente punto a punto [A/m²]. Para obtener la corriente por una superficie hay que sumar $J$ sobre cada pedacito de área. En la forma microscópica, $n$ es la cantidad de portadores por m³, $q$ su carga y $v_d$ su velocidad de deriva.',
    deDondeViene: '$I = dq/dt$ es la definición de corriente. La integral es la misma idea que el flujo de Gauss: cuánto de algo atraviesa una superficie.',
    cuandoSirve: '$I = J\\cdot A$ vale solo si $J$ es uniforme y perpendicular a la sección. Si $J$ cambia punto a punto, como en el 1a, hay que integrar.',
    enElParcial: { texto: 'Con $J = c\\,r^2$ se integró por anillos para obtener la corriente encerrada.', paso: 3 },
  },
  {
    id: 'biot-savart',
    titulo: 'Ley de Biot-Savart',
    formula: 'd\\vec B = \\frac{\\mu_0}{4\\pi}\\,\\frac{I\\,d\\vec l \\times \\hat r}{r^2}',
    queDice: 'Da el aporte $d\\vec B$ de cada tramito de corriente $I\\,d\\vec l$ en un punto a distancia $r$. El campo total es la suma (integral) de todos los aportes. $\\hat r$ es el vector unitario que va del tramito al punto. El producto vectorial hace que $B$ sea perpendicular a la corriente y a $\\hat r$: de ahí sale la regla de la mano derecha.',
    deDondeViene: 'Es experimental (Biot y Savart, 1820, después del experimento de Ørsted). Es para el magnetismo lo que la Ley de Coulomb es para la electrostática: el campo de una fuente puntual, que después se suma.',
    cuandoSirve: 'Siempre, para corrientes estacionarias y cualquier geometría. El problema es que la integral suele ser difícil. Por ejemplo, para un hilo recto infinito da $B = \\mu_0 I/(2\\pi r)$, el mismo resultado que Ampère pero con mucha más cuenta.',
    enElParcial: { texto: 'Se usó para justificar la dirección de $B$ (tangente a los círculos) y la regla de la mano derecha.', paso: 2 },
  },
  {
    id: 'gauss-magnetismo',
    titulo: 'Ley de Gauss del magnetismo',
    formula: '\\oint \\vec B \\cdot d\\vec A = 0',
    queDice: 'El flujo magnético a través de cualquier superficie cerrada es cero: entra tanto campo como sale. Significa que no existen "cargas magnéticas" (monopolos): no hay un lugar de donde salgan líneas de $B$ sin volver.',
    deDondeViene: 'Es una de las cuatro ecuaciones de Maxwell. Nunca se observó un monopolo magnético: si cortás un imán, obtenés dos imanes, cada uno con norte y sur.',
    cuandoSirve: 'Siempre. Se usa sobre todo para descartar componentes del campo por simetría.',
    enElParcial: { texto: 'Descarta que $B$ tenga componente radial alrededor del cable: si la tuviera, un cilindro alrededor del cable tendría flujo neto distinto de cero.', paso: 2 },
  },
  {
    id: 'ampere',
    titulo: 'Ley de Ampère',
    formula: '\\oint \\vec B \\cdot d\\vec l = \\mu_0\\, I_{enc}',
    queDice: 'La circulación de $B$ (sumar $B$ a lo largo de un camino cerrado) es igual a $\\mu_0$ por la corriente que atraviesa cualquier superficie apoyada en ese camino. Signo: la corriente cuenta positiva si va en el sentido del pulgar cuando los dedos siguen el sentido de recorrido (mano derecha).',
    deDondeViene: 'Para corrientes estacionarias se puede deducir de Biot-Savart: aplicándole el rotor se obtiene $\\nabla\\times\\vec B = \\mu_0\\vec J$, y con el teorema de Stokes se pasa a la forma integral. Es una de las ecuaciones de Maxwell, en su versión sin corriente de desplazamiento (ver Teoría general).',
    cuandoSirve: 'Es siempre cierta, pero solo permite **despejar** $B$ cuando la simetría hace que $B$ sea constante y paralelo al camino: hilo o cilindro infinito, solenoide, toroide, plano infinito de corriente. Sin simetría, hay que usar Biot-Savart.',
    enElParcial: { texto: 'Camino amperiano circular de radio $r$ alrededor del eje del cable, adentro y afuera.', paso: 2 },
    nota: 'Es el análogo magnético de Gauss: superficie gaussiana ↔ camino amperiano, $Q_{enc}$ ↔ $I_{enc}$, $1/\\varepsilon_0$ ↔ $\\mu_0$. En el primer parcial la carga estaba repartida con $\\rho(r)$; acá la corriente está repartida con $J(r)$.',
  },
  {
    id: 'mu0',
    titulo: 'Permeabilidad del vacío μ₀',
    formula: '\\mu_0 = 4\\pi\\times10^{-7}\\ \\text{T·m/A}',
    queDice: 'Es la constante que mide qué tanto campo magnético genera una corriente en el vacío. Aparece en Biot-Savart y en Ampère.',
    deDondeViene: 'Es una constante de la naturaleza. Está relacionada con la del campo eléctrico por $c = 1/\\sqrt{\\mu_0\\varepsilon_0}$, la velocidad de la luz: fue una de las pistas de Maxwell de que la luz es una onda electromagnética.',
    cuandoSirve: 'En el vacío o en materiales no magnéticos (cobre, aluminio, aire). En materiales magnéticos se reemplaza por $\\mu = \\mu_r\\,\\mu_0$ (ver Teoría general).',
    enElParcial: { texto: 'Supusimos $\\mu = \\mu_0$: el cable no es un material magnético.', paso: 1 },
  },
]

export const PREGUNTAS = [
  {
    pregunta: '¿Qué diferencia hay entre Biot-Savart y Ampère?',
    respuesta: 'Biot-Savart da el aporte de cada tramo de corriente y hay que sumarlos; sirve para cualquier geometría pero la integral suele ser difícil. Ampère relaciona la circulación de B con la corriente encerrada; siempre es cierta, pero solo permite despejar B con simetría. Para corrientes estacionarias, Ampère se deduce de Biot-Savart.',
    tema: 'Ampère',
  },
  {
    pregunta: '¿La Ley de Ampère vale para cualquier camino cerrado?',
    respuesta: 'Sí, vale para cualquier camino. Lo que cambia es si sirve para calcular B: solo cuando por simetría B es constante y paralelo al camino, y así sale de la integral.',
    tema: 'Ampère',
  },
  {
    pregunta: '¿Por qué eligieron un círculo como camino amperiano?',
    respuesta: 'Porque, por la simetría del cable infinito, B es tangente a círculos centrados en el eje y tiene el mismo módulo en todo el círculo. Entonces B·dl = B·dl en todo el camino y la integral queda B por el perímetro 2πr.',
    tema: 'Ampère',
  },
  {
    pregunta: '¿Por qué B no tiene componente radial?',
    respuesta: 'Por la Ley de Gauss del magnetismo: si B saliera radialmente del cable, un cilindro cerrado alrededor tendría flujo neto distinto de cero, y eso es imposible porque no hay monopolos magnéticos.',
    tema: 'Simetría',
  },
  {
    pregunta: '¿Por qué B es cero en el eje del cable?',
    respuesta: 'Porque un camino de radio cero no encierra corriente. Además, por simetría, en el eje ninguna dirección tangente es privilegiada, así que B no puede apuntar a ningún lado.',
    tema: 'Resultado',
  },
  {
    pregunta: '¿Cómo sería B adentro si J fuera uniforme?',
    respuesta: 'La corriente encerrada crecería como r² en lugar de r⁴, y B quedaría B = μ₀ i r/(2πR²): lineal con r. Afuera no cambia nada, porque solo importa la corriente total.',
    tema: 'Resultado',
  },
  {
    pregunta: '¿Por qué B es continuo en r = R?',
    respuesta: 'Porque no hay una lámina de corriente en la superficie del cable: la corriente encerrada crece de forma continua con r. B solo salta donde hay corriente superficial, igual que E solo salta donde hay carga superficial.',
    tema: 'Resultado',
  },
  {
    pregunta: '¿Qué cambiaría si el cable fuera de hierro?',
    respuesta: 'El hierro es ferromagnético: habría que reemplazar μ₀ por μ = μᵣμ₀ adentro del cable, y B adentro sería mucho mayor. Afuera, en el aire, B sigue siendo μ₀ i/(2πr).',
    tema: 'Materia',
  },
  {
    pregunta: '¿Qué relación tiene este ejercicio con el primer parcial?',
    respuesta: 'Es el mismo esquema: una fuente repartida de forma no uniforme (antes ρ(r), ahora J(r)), una ley integral con simetría (antes Gauss, ahora Ampère), integrar para obtener la fuente encerrada y resolver por zonas.',
    tema: 'Ampère',
  },
  {
    pregunta: '¿Qué unidades tiene c y por qué?',
    respuesta: 'A/m⁴. J está en A/m² y r² en m², entonces c tiene que tener A/m⁴ para que c·r² dé A/m².',
    tema: 'Resultado',
  },
]
