import { PARCIALES, PARCIAL_PROXIMO, PARTICIPANTES, RUTA_SIMULACRO } from '../navegacion'
import { navegar } from '../router'
import './Landing.css'

// Acento y primera sección de cada parcial
const TARJETAS = {
  1: { clase: 'lp-card--p1', entrada: '/parcial1/conductores' },
  2: { clase: 'lp-card--p2', entrada: '/parcial2/1a/enunciado' },
}

// Portada: título, datos del grupo y los parciales con links directos a cada sección
export default function Landing() {
  return (
    <div className="landing-pagina">
      <FondoCampos />

      <main className="landing">
        <header className="landing-encabezado">
          <h1 className="landing-titulo">Física II</h1>
          <p className="landing-datos">Grupo 3 · Comisión I22 · UTN FRLP · 2026</p>
          <p className="landing-integrantes">{PARTICIPANTES.join(' · ')}</p>
        </header>

        <div className="landing-parciales">
          {PARCIALES.map(p => <TarjetaParcial key={p.id} parcial={p} />)}

          <section className="lp-card lp-card--proximo" aria-disabled="true">
            <h2 className="lp-card-titulo">{PARCIAL_PROXIMO.label}</h2>
            <p className="lp-card-cubre">Próximamente</p>
          </section>
        </div>

        <footer className="landing-pie">Defensa del Parcial 2: 30/09/2026</footer>
      </main>
    </div>
  )
}

// Tarjeta clickeable completa (sin anidar <a> dentro de <a>): el bloque es un role="link"
// y los links internos frenan la propagación para no disparar el click del bloque.
function TarjetaParcial({ parcial: p }) {
  const { clase, entrada } = TARJETAS[p.id]
  const entrar = () => navegar(entrada)
  const frenar = e => e.stopPropagation()

  return (
    <section
      className={`lp-card lp-card--activa ${clase}`}
      role="link"
      tabIndex={0}
      aria-label={`Entrar a ${p.label}`}
      onClick={entrar}
      onKeyDown={e => { if (e.key === 'Enter' && e.target === e.currentTarget) entrar() }}
    >
      <h2 className="lp-card-titulo">{p.label}</h2>
      <p className="lp-card-cubre">{p.cubre}</p>

      <ul className="landing-links">
        {p.tabs.map(t => (
          <li key={t.id}>
            <a href={`#/${p.slug}/${t.id}`} onClick={frenar}>{t.label}</a>
            {t.desc && <span className="landing-desc">{t.desc}</span>}
          </li>
        ))}
      </ul>

      {p.id === 2 && (
        <a className="landing-destacado" href={`#${RUTA_SIMULACRO}`} onClick={frenar}>
          Simulacro de defensa →
        </a>
      )}

      <span className="lp-entrar" aria-hidden="true">Entrar →</span>
    </section>
  )
}

// ── Fondo decorativo: carga puntual con líneas de E (izquierda) y cable con círculos de B (derecha)
const CARGA = { x: 190, y: 660 }
const CABLE = { x: 1420, y: 360 }
const N_LINEAS = 16
const RADIOS_B = [62, 115, 175, 245, 325, 415]

function FondoCampos() {
  const punta = (x, y, grados, k) => (
    <path key={k} d="M-7,-5 L7,0 L-7,5 z" transform={`translate(${x},${y}) rotate(${grados})`} />
  )

  return (
    <svg className="landing-fondo" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {/* Las líneas de campo se desvanecen al alejarse de la carga */}
        <radialGradient id="lp-fade" gradientUnits="userSpaceOnUse" cx={CARGA.x} cy={CARGA.y} r={560}>
          <stop offset="0" stopColor="#1a237e" stopOpacity="1" />
          <stop offset="1" stopColor="#1a237e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="landing-fondo-dibujo">
        {/* Carga puntual */}
        <g stroke="url(#lp-fade)" strokeWidth="2.5" fill="none">
          {Array.from({ length: N_LINEAS }, (_, k) => {
            const a = (2 * Math.PI * k) / N_LINEAS
            return (
              <line key={k} x1={CARGA.x + 30 * Math.cos(a)} y1={CARGA.y + 30 * Math.sin(a)}
                    x2={CARGA.x + 560 * Math.cos(a)} y2={CARGA.y + 560 * Math.sin(a)} />
            )
          })}
        </g>
        <g fill="#1a237e" fillOpacity="0.8">
          {Array.from({ length: N_LINEAS }, (_, k) => {
            const a = (2 * Math.PI * k) / N_LINEAS
            return punta(CARGA.x + 170 * Math.cos(a), CARGA.y + 170 * Math.sin(a), (a * 180) / Math.PI, k)
          })}
        </g>
        <circle cx={CARGA.x} cy={CARGA.y} r="22" fill="none" stroke="#1a237e" strokeWidth="3" />
        <path d={`M${CARGA.x - 10},${CARGA.y} h20 M${CARGA.x},${CARGA.y - 10} v20`} stroke="#1a237e" strokeWidth="3" />

        {/* Cable visto de frente, corriente saliendo (⊙): B en círculos, sentido antihorario */}
        <g fill="none" stroke="#1a237e" strokeWidth="2.5">
          {RADIOS_B.map(r => <circle key={r} cx={CABLE.x} cy={CABLE.y} r={r} />)}
        </g>
        <g fill="#1a237e">
          {RADIOS_B.flatMap((r, i) => [0, 180].map(off => {
            const a = ((i * 37 + 20 + off) * Math.PI) / 180
            const x = CABLE.x + r * Math.cos(a)
            const y = CABLE.y - r * Math.sin(a)
            // Tangente antihoraria en pantalla: (−sen a, −cos a)
            const grados = (Math.atan2(-Math.cos(a), -Math.sin(a)) * 180) / Math.PI
            return punta(x, y, grados, `${r}-${off}`)
          }))}
        </g>
        <circle cx={CABLE.x} cy={CABLE.y} r="18" fill="none" stroke="#1a237e" strokeWidth="3" />
        <circle cx={CABLE.x} cy={CABLE.y} r="5" fill="#1a237e" />
      </g>
    </svg>
  )
}
