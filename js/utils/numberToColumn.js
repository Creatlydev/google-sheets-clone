// Convierte un número en la correspondiente letra de columna (A, B, C, ..., Z, AA, AB, ...)
export const numberToColumn = (n) => {
  let column = ''
  while (n >= 0) {
    // Convierte el número en una letra (A-Z)
    column = String.fromCharCode((n % 26) + 65) + column
    // Reduce el número para obtener la siguiente letra
    n = Math.floor(n / 26) - 1
  }
  return column
}
