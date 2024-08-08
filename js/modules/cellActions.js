// cellActions.js
import {
  getCurrentCellEditable,
  setCurrentCellEditable
} from './globalState.js'

export const makeCellEditable = (cell) => {

  domSetCurrentCellEditable(cell)
  setCurrentCellEditable(cell)
}

export const isEditable = (cell) =>
  cell.getAttribute('contenteditable') === 'true'

export const highlightCellInput = (target) => {
  if (target.getAttribute('role') === 'input') {
    removeEditable(target)
  }
}

export const domSetCurrentCellEditable = (cell) => {
  cell.setAttribute('contenteditable', 'true')
  cell.focus()
}

export const removeEditable = (cell) => {
  const currentCellEditable = getCurrentCellEditable()

  if (currentCellEditable && currentCellEditable !== cell) {
    currentCellEditable.removeAttribute('contenteditable')
  }
}

export const clearCellContent = (cell) => {
  cell.textContent = ''
}
