// cellActions.js
import {
  getCurrentEditableCell,
  setCurrentEditableCell
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
export const highlightInputCell = (target) => {
  if (target.getAttribute('role') === 'input') {
    $('.cell.is-active')?.classList.remove('is-active')
    addClassCell(target)
    highlightHeaderCell({ target })
    disableCellEditing(target)
  }
}

// Establece una celda como editable en el DOM
export const setDomEditableCell = (cell) => {
  cell.setAttribute('contenteditable', 'true')
  cell.focus()
}

// Elimina la edición de una celda y asegura que no haya otras celdas editables
export const disableCellEditing = (cell) => {
  const currentEditableCell = getCurrentEditableCell()

  if (currentEditableCell && currentEditableCell !== cell) {
    currentEditableCell.removeAttribute('contenteditable')
  }
}

// Limpia el contenido de una celda
export const clearCellContent = (cell) => {
  cell.textContent = ''
}
