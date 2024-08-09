import {
  getCurrentEditableCell,
  setCurrentEditableCell,
  getCurrentActiveCell,
  setCurrentActiveCell
} from './globalState.js'
import { highlightHeaderCell } from './header.js'
import { $ } from './domUtils.js'

// Hace una celda editable
export const enableCellEditing = (cell) => {
  setDomEditableCell(cell)
  setCurrentEditableCell(cell)
}

const addClassCell = (cell) => cell.classList.add('is-active')

// Verifica si una celda es editable
export const isCellEditable = (cell) =>
  cell.getAttribute('contenteditable') === 'true'

// Resalta la celda de entrada seleccionada y elimina la edición de otras celdas
export const highlightInputCell = (cell, focusInIsCell = true) => {
  if (cell.getAttribute('role') === 'input') {
    const currentActiveCell = getCurrentActiveCell()
    if (currentActiveCell !== cell) {
      currentActiveCell && currentActiveCell.classList.remove('is-active')
      addClassCell(cell)
      highlightHeaderCell({ target: cell })
      disableCellEditing(cell)

      setCurrentActiveCell(cell)
    } else if (!focusInIsCell) {
      disableCellEditing(cell, true)
    }
  }
}

// Establece una celda como editable en el DOM
export const setDomEditableCell = (cell) => {
  cell.setAttribute('contenteditable', 'true')
  cell.focus()
}

// Elimina la edición de una celda y asegura que no haya otras celdas editables
export const disableCellEditing = (cell, force = false) => {
  const currentEditableCell = getCurrentEditableCell()

  if ((currentEditableCell && currentEditableCell !== cell) || force) {
    try {
      currentEditableCell.removeAttribute('contenteditable')
    } catch (error) {}
  }
}

export const moveFocusToNextCellOnEnter = (cell) => {
  const currentActiveCell = getCurrentActiveCell()
  const ariaLabelCurrentCellActive =
    cell.getAttribute('label-header-col') +
    (parseInt(cell.getAttribute('label-header-row')) + 1)
  let nextCell = $(`.cell[aria-label="${ariaLabelCurrentCellActive}"]`)

  if (nextCell) {
    currentActiveCell.classList.remove('is-active')
    addClassCell(nextCell)
    highlightHeaderCell({ target: nextCell })
    disableCellEditing(nextCell)
    setCurrentActiveCell(nextCell)
    nextCell.focus()
  }
}

// Limpia el contenido de una celda
export const clearCellContent = (cell) => {
  cell.textContent = ''
}
