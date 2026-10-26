import { createContext, useContext, useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/*
 * Paleta de magnitudes: { símbolo: clave de color }. Si un ejercicio la provee con
 * <PaletaContext.Provider>, cada aparición de esos símbolos (como letra suelta, no en
 * subíndices de texto como "enc") se pinta con la clase `mc-<clave>` (colores en Parcial2.css).
 * Las palabras se pintan con {{clave|texto}} dentro de MathText.
 */
export const PaletaContext = createContext(null)

const LETRA_SUELTA = /<span class="(mord (?:mathnormal|mathit)(?: mtight)?)"( style="[^"]*")?>([A-Za-zα-ωΑ-Ω])<\/span>/g

function pintar(html, paleta) {
  return html.replace(LETRA_SUELTA, (todo, clases, estilo, letra) => {
    const clave = paleta[letra]
    return clave
      ? `<span class="${clases} mc-${clave}"${estilo ?? ''}>${letra}</span>`
      : todo
  })
}

// Renderiza un string LaTeX con KaTeX. `block` = modo display (centrado, tamaño grande).
export default function Formula({ tex, block = false, className = '' }) {
  const paleta = useContext(PaletaContext)
  const html = useMemo(() => {
    // Subíndices de texto (int, enc, eq…) en romano, para no confundirlos con magnitudes;
    // \Phi en cursiva (el romano no se distingue de un \text{...})
    const fuente = paleta
      ? tex.replace(/_\{([A-Za-z]{2,})\}/g, '_{\\mathrm{$1}}').replace(/\\Phi(?![A-Za-z])/g, '\\varPhi')
      : tex
    const out = katex.renderToString(fuente, {
      displayMode: block,
      throwOnError: false,
      strict: code => (code === 'htmlExtension' ? 'ignore' : 'warn'),
      trust: ctx => ctx.command === '\\htmlClass' && ctx.class === 'hl',
      macros: { '\\hl': '\\htmlClass{hl}{#1}' },   // \hl{...}: resalta lo que cambia en el paso
    })
    return paleta ? pintar(out, paleta) : out
  }, [tex, block, paleta])
  const Tag = block ? 'div' : 'span'
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

// Texto plano con fórmulas inline entre $...$  →  "La densidad $J(r)$ depende de r"
// y negrita entre **...**
// (la negrita puede contener fórmulas: "**Q tiende a $0$**")
export function MathText({ children }) {
  if (typeof children !== 'string') return children
  const parts = children.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}><ConFormulas text={part} /></strong> : <ConFormulas key={i} text={part} />,
  )
}

function ConFormulas({ text }) {
  const parts = text.split(/\$([^$]+)\$/g)
  return parts.map((part, i) => (i % 2 === 1 ? <Formula key={i} tex={part} /> : <ConColor key={i} text={part} />))
}

// {{clave|palabras}} → palabras con el color de la magnitud (solo con paleta activa)
function ConColor({ text }) {
  const paleta = useContext(PaletaContext)
  const parts = text.split(/\{\{(\w+)\|([^}]+)\}\}/g)
  if (parts.length === 1) return text
  const items = []
  for (let i = 0; i < parts.length; i += 3) {
    items.push(parts[i])
    if (i + 2 < parts.length) {
      items.push(paleta ? <span key={i} className={`mc-${parts[i + 1]}`}>{parts[i + 2]}</span> : parts[i + 2])
    }
  }
  return items
}

const VINETA = /^- /
const NUMERO = /^(\d+)[.)] /

// Igual que MathText pero separa párrafos con una línea en blanco.
// Dentro de un párrafo, las líneas consecutivas que empiezan con "- " forman una lista <ul>,
// y las que empiezan con "1) " o "1. " una lista numerada <ol>.
export function MathParagraphs({ text }) {
  const bloques = []
  text.split('\n\n').forEach(para => {
    let actual = null
    para.split('\n').forEach(linea => {
      const tipo = VINETA.test(linea) ? 'ul' : NUMERO.test(linea) ? 'ol' : 'p'
      if (!actual || actual.tipo !== tipo) {
        actual = { tipo, lineas: [] }
        bloques.push(actual)
      }
      actual.lineas.push(linea)
    })
  })

  return bloques.map(({ tipo, lineas }, i) => {
    if (tipo === 'p') return <p key={i}><MathText>{lineas.join(' ')}</MathText></p>
    if (tipo === 'ul') {
      return (
        <ul key={i}>
          {lineas.map((l, j) => <li key={j}><MathText>{l.replace(VINETA, '')}</MathText></li>)}
        </ul>
      )
    }
    return (
      <ol key={i} start={Number(lineas[0].match(NUMERO)[1])}>
        {lineas.map((l, j) => <li key={j}><MathText>{l.replace(NUMERO, '')}</MathText></li>)}
      </ol>
    )
  })
}
