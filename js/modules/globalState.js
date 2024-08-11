
// Variable globales, para almacenar y setear las celdas editables y activas actuales
let currentCellEditable = null
export const getCurrentEditableCell = () => currentCellEditable
export const setCurrentEditableCell = (cell) => {
  currentCellEditable = cell
}


let currentActiveCell = null
export const getCurrentActiveCell = () => currentActiveCell
export const setCurrentActiveCell = (cell) => {
  currentActiveCell = cell
}