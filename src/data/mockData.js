// Utilidades relacionadas a la detección de anomalías en el ranking.
// Los datos reales ahora vienen del backend (ver src/lib/api.js);
// este archivo ya no contiene datos simulados.

// Umbral simple para marcar un ranking como anómalo: puntos muy altos
// respecto a la cantidad de reciclajes reportados (posible manipulación).
export function esAnomalo(usuario) {
  if (usuario.reciclajes === 0) return usuario.puntos > 0
  const ratio = usuario.puntos / usuario.reciclajes
  return ratio > 40
}
