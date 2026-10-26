import { useEffect, useRef, useState } from 'react'
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
  // Oculta el contenido para ver solo el fondo animado
  const [soloFondo, setSoloFondo] = useState(false)

  return (
    <div className="landing-pagina">
      <FondoCampos />

      <button className="landing-ver-fondo" onClick={() => setSoloFondo(v => !v)}
              aria-pressed={soloFondo}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
          {soloFondo && <path d="M3 3l18 18" />}
        </svg>
        {soloFondo ? 'Mostrar contenido' : 'Ver fondo'}
      </button>

      <main className={`landing${soloFondo ? ' landing--oculto' : ''}`} aria-hidden={soloFondo}>
        <header className="landing-encabezado">
          <p className="landing-datos">Grupo 3 · Comisión 69 · UTN FRLP · 2026</p>
          <h1 className="landing-titulo">Física&nbsp;II</h1>
          <p className="landing-bajada">
            Resolución guiada, teoría y preguntas de cada parcial.
          </p>
          <ul className="landing-integrantes" aria-label="Integrantes">
            {PARTICIPANTES.map(n => <li key={n}>{n}</li>)}
          </ul>
        </header>

        <div className="landing-parciales">
          {PARCIALES.map(p => <TarjetaParcial key={p.id} parcial={p} />)}

          <section className="lp-card lp-card--proximo" aria-disabled="true">
            <span className="lp-card-num">{PARCIAL_PROXIMO.id}</span>
            <h2 className="lp-card-titulo">{PARCIAL_PROXIMO.label}</h2>
            <p className="lp-card-cubre">Próximamente</p>
          </section>
        </div>
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
  const [, tema] = p.label.split(' · ')

  return (
    <section
      className={`lp-card lp-card--activa ${clase}`}
      role="link"
      tabIndex={0}
      aria-label={`Entrar a ${p.label}`}
      onClick={entrar}
      onKeyDown={e => { if (e.key === 'Enter' && e.target === e.currentTarget) entrar() }}
    >
      <span className="lp-card-num">{p.id}</span>
      <p className="lp-card-etiqueta">{p.corto}</p>
      <h2 className="lp-card-titulo">{tema}</h2>
      <p className="lp-card-cubre">{p.cubre}</p>

      <ul className="landing-links">
        {p.tabs.map(t => (
          <li key={t.id}>
            <a href={`#/${p.slug}/${t.id}`} onClick={frenar}>
              <span className="landing-link-nombre">{t.label}</span>
              {t.desc && <span className="landing-desc">{t.desc}</span>}
            </a>
          </li>
        ))}
      </ul>

      {p.id === 2 && (
        <a className="landing-destacado" href={`#${RUTA_SIMULACRO}`} onClick={frenar}>
          Cuestionario →
        </a>
      )}

      <span className="lp-entrar" aria-hidden="true">Entrar →</span>
    </section>
  )
}

// ── Fondo animado: un dipolo (+ y −) que se mueve despacio, con sus líneas de campo eléctrico y
// las equipotenciales (perpendiculares), recalculadas en cada cuadro; sobre las líneas de campo "fluyen" puntos que indican el sentido de E.
const N_LINEAS = 22
const MAX_TRAMOS = 1500
const FRACCIONES_EQUIPOTENCIAL = [-2.2, -1.2, -.6, -.3, .15, .3, .5, .7, .85, 1.3, 1.6, 2.2, 3.2]
const Q = [1, -1]       // signo de cada carga

function posiciones(s, w, h) {
  return [
    { x: w * (.5 + .36 * Math.cos(.11 * s)),     y: h * (.5 + .32 * Math.sin(.15 * s)) },
    { x: w * (.5 - .36 * Math.cos(.09 * s + 1)), y: h * (.5 - .32 * Math.sin(.13 * s + 2)) },
  ]
}

function campo(x, y, cargas) {
  let ex = 0, ey = 0
  cargas.forEach((c, i) => {
    const dx = x - c.x, dy = y - c.y
    const r2 = dx * dx + dy * dy + 1
    const k = Q[i] / (r2 * Math.sqrt(r2))
    ex += k * dx
    ey += k * dy
  })
  const m = Math.hypot(ex, ey) || 1
  return [ex / m, ey / m]
}

// Traza una curva desde (x, y) avanzando con el método del punto medio.
//   equipotencial — false: sigue E (línea de campo); true: avanza perpendicular a E
//   signo — sentido de avance (+1 / −1)
// El paso crece al alejarse de las cargas, así las líneas largas llegan hasta el borde de la pantalla.
function trazarCurva(x, y, cargas, w, h, { equipotencial = false, signo = 1, cierra = false } = {}) {
  const dir = (px, py) => {
    const [ex, ey] = campo(px, py, cargas)
    return equipotencial ? [-ey * signo, ex * signo] : [ex * signo, ey * signo]
  }
  const x0 = x, y0 = y
  const pts = [[x, y]]
  for (let i = 0; i < MAX_TRAMOS; i++) {
    const dMin = Math.min(Math.hypot(x - cargas[0].x, y - cargas[0].y), Math.hypot(x - cargas[1].x, y - cargas[1].y))
    const paso = Math.max(4, Math.min(16, dMin * .06))
    const [ax, ay] = dir(x, y)
    const [bx, by] = dir(x + ax * paso / 2, y + ay * paso / 2)
    x += bx * paso
    y += by * paso
    pts.push([x, y])
    if (!equipotencial && Math.hypot(x - cargas[1].x, y - cargas[1].y) < 12) break
    if (x < -80 || x > w + 80 || y < -80 || y > h + 80) break
    if (cierra && i > 30 && Math.hypot(x - x0, y - y0) < paso * 1.2) { pts.push([x0, y0]); break }
  }
  return pts
}

function dibujar(ctx, w, h, s) {
  ctx.clearRect(0, 0, w, h)
  const cargas = posiciones(s, w, h)
  const [pos, neg] = cargas

  // Líneas de campo: salen de la carga + siguiendo E y terminan en la − o al salir de la pantalla
  const lineas = []
  for (let k = 0; k < N_LINEAS; k++) {
    const a = (2 * Math.PI * k) / N_LINEAS + .06 * s
    lineas.push(trazarCurva(pos.x + 14 * Math.cos(a), pos.y + 14 * Math.sin(a), cargas, w, h))
  }

  // Equipotenciales: curvas perpendiculares a E que cruzan (o rodean) el eje entre las cargas
  const equipotenciales = []
  FRACCIONES_EQUIPOTENCIAL.forEach(f => {
    const x = pos.x + (neg.x - pos.x) * f, y = pos.y + (neg.y - pos.y) * f
    const ida = trazarCurva(x, y, cargas, w, h, { equipotencial: true, signo: 1, cierra: true })
    equipotenciales.push(ida)
    if (Math.hypot(ida[ida.length - 1][0] - x, ida[ida.length - 1][1] - y) > 1) {
      equipotenciales.push(trazarCurva(x, y, cargas, w, h, { equipotencial: true, signo: -1 }))
    }
  })

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const trazar = pts => {
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()
  }

  ctx.setLineDash([])
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(106,76,147,.11)'
  equipotenciales.forEach(trazar)

  ctx.lineWidth = 1.4
  ctx.strokeStyle = 'rgba(57,73,171,.13)'
  lineas.forEach(trazar)

  ctx.lineWidth = 2.6
  ctx.strokeStyle = 'rgba(106,76,147,.45)'
  ctx.setLineDash([1, 26])
  ctx.lineDashOffset = -s * 38
  lineas.forEach(trazar)
  ctx.setLineDash([])

  // Cargas: halo + signo
  cargas.forEach((c, i) => {
    const col = i === 0 ? '57,73,171' : '106,76,147'
    const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 70)
    g.addColorStop(0, `rgba(${col},.28)`)
    g.addColorStop(1, `rgba(${col},0)`)
    ctx.fillStyle = g
    ctx.fillRect(c.x - 70, c.y - 70, 140, 140)

    ctx.beginPath()
    ctx.arc(c.x, c.y, 15, 0, 2 * Math.PI)
    ctx.fillStyle = `rgba(${col},.9)`
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2.4
    ctx.beginPath()
    ctx.moveTo(c.x - 6, c.y); ctx.lineTo(c.x + 6, c.y)
    if (Q[i] > 0) { ctx.moveTo(c.x, c.y - 6); ctx.lineTo(c.x, c.y + 6) }
    ctx.stroke()
  })
}

function FondoCampos() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (quieto) dibujar(ctx, w, h, 4)
    }

    const t0 = performance.now()
    const cuadro = ahora => {
      dibujar(ctx, w, h, (ahora - t0) / 1000 + 4)
      raf = requestAnimationFrame(cuadro)
    }

    ajustar()
    window.addEventListener('resize', ajustar)
    if (!quieto) raf = requestAnimationFrame(cuadro)
    return () => {
      window.removeEventListener('resize', ajustar)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={ref} className="landing-fondo" aria-hidden="true" />
}
