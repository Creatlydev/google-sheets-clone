// globalState.js
let currentCellEditable = null

export const getCurrentEditableCell = () => currentCellEditable

export const setCurrentEditableCell = (cell) => {
  currentCellEditable = cell
}
