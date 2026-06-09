// Validación y formato de celulares venezolanos (el campo es para WhatsApp).
// Operadoras móviles válidas:
//   0412 (Digitel) · 0414 / 0424 (Movistar) · 0416 / 0426 (Movilnet)
const PREFIJOS_MOVIL_VE = ['412', '414', '416', '424', '426']

function soloDigitos(s: string): string {
  return (s || '').replace(/\D/g, '')
}

// Lleva cualquier formato (+58, 0058, 0414…, 414…) a 11 dígitos locales: 0XXXXXXXXXX
export function normalizarTelefonoVE(raw: string): string {
  let d = soloDigitos(raw)
  if (d.startsWith('00')) d = d.slice(2) // 0058...
  if (d.startsWith('58')) d = d.slice(2) // +58 / 58...
  if (d.length === 10 && d.startsWith('4')) d = '0' + d // venía sin el 0 inicial
  return d
}

export function esTelefonoVEValido(raw: string): boolean {
  const d = normalizarTelefonoVE(raw)
  if (d.length !== 11 || d[0] !== '0') return false
  return PREFIJOS_MOVIL_VE.includes(d.slice(1, 4))
}

// Formato legible para mostrar: 0414-123-4567 (si no es válido, deja el texto tal cual)
export function formatearTelefonoVE(raw: string): string {
  const d = normalizarTelefonoVE(raw)
  if (d.length !== 11) return raw
  return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}`
}
