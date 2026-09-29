// Número con coma decimal: fmt(3.14159, 2) → "3,14"
export function fmt(x, decimales = 2) {
  return x.toFixed(decimales).replace('.', ',')
}

// Igual que fmt pero siempre con signo: "+0,71" / "−0,71"
export function fmtSigno(x, decimales = 2) {
  const s = fmt(Math.abs(x), decimales)
  return Number(s.replace(',', '.')) === 0 ? s : (x > 0 ? '+' : '−') + s
}
