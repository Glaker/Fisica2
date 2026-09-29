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

// Igual que MathText pero separa párrafos con una línea en blanco.
// Las líneas que empiezan con "- " se muestran como lista.
export function MathParagraphs({ text }) {
  return text.split('\n\n').flatMap((para, i) => {
    const lineas = para.split('\n')
    const primeraItem = lineas.findIndex(l => l.startsWith('- '))
    if (primeraItem === -1) return [<p key={i}><MathText>{para}</MathText></p>]

    const intro = lineas.slice(0, primeraItem).join(' ')
    const items = lineas.slice(primeraItem).map(l => l.replace(/^- /, ''))
    return [
      intro && <p key={`${i}p`}><MathText>{intro}</MathText></p>,
      <ul key={`${i}ul`}>
        {items.map((item, j) => <li key={j}><MathText>{item}</MathText></li>)}
      </ul>,
    ].filter(Boolean)
  })
}
