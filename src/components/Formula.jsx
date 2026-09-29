import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// Renderiza un string LaTeX con KaTeX. `block` = modo display (centrado, tamaño grande).
export default function Formula({ tex, block = false, className = '' }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: block, throwOnError: false }),
    [tex, block],
  )
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
  if (parts.length === 1) return text
  return parts.map((part, i) => (i % 2 === 1 ? <Formula key={i} tex={part} /> : part))
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
