
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


// Variables que serviran para la funcionalidad de seleccionar varias celdas, cuando se arrastra el mouse

let isSelecting = false; // Variable para saber si el usuario está en modo de selección
export const getIsSelecting = () => isSelecting
export const setIsSelecting = (newValue) => isSelecting = newValue


let startCell = null; // Celda desde donde se inició la selección
export const getStartCell = () => startCell
export const setStartCell = (newValue) => startCell = newValue


let selectedCells = []; // Array para almacenar las celdas actualmente seleccionadas
export const getSelectedCells = () => selectedCells
export const setSelectedCells = (newValue) => selectedCells = newValue

