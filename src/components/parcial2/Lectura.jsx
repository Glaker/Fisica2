// Tarjetita con un valor en vivo (usada en los paneles de visualización)
export function Lectura({ titulo, valor, extra, destacado, color }) {
  return (
    <div className={`p2-lectura${destacado ? ' p2-lectura--destacada' : ''}${color ? ' p2-lectura--color' : ''}`}
         style={color ? { borderTopColor: color } : undefined}>
      <div className="fs-card-title">{titulo}</div>
      <div className="cc2-result" style={color ? { color } : undefined}>{valor}</div>
      {extra && <div className="p2-lectura-extra">{extra}</div>}
    </div>
  )
}

export function Lecturas({ children }) {
  return <div className="p2-lecturas">{children}</div>
}
