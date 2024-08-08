let currentCellEditable = null
let currentActiveCell = null

export const getCurrentEditableCell = () => currentCellEditable

export const setCurrentEditableCell = (cell) => {
  currentCellEditable = cell
}

export const getCurrentActiveCell = () => currentActiveCell

export const setCurrentActiveCell = (cell) => {
  currentActiveCell = cell
}
