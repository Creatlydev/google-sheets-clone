// Función auxiliar para convertir la letra de la columna a un número
export const columnToNumber = (col) => {
  let number = 0
  for (let i = 0; i < col.length; i++) {
    number = number * 26 + (col.charCodeAt(i) - 64)
  }
  return number - 1 // para ajustarlo al índice 0
}
