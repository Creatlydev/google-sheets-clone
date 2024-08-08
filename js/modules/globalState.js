// globalState.js
let currentCellEditable = null

export const getCurrentCellEditable = () => currentCellEditable

export const setCurrentCellEditable = (cell) => {
  currentCellEditable = cell
}
