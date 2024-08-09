import {
  getCurrentEditableCell,
  setCurrentEditableCell,
  getCurrentActiveCell,
  setCurrentActiveCell
} from './globalState.js'
import { highlightHeaderCell } from './header.js'
import { $ } from '../utils/domUtils.js'
import { ROLE_INPUT } from '../utils/constants.js'

// Habilita la edición de la celda seleccionada
export const enableCellEditing = (cell) => {
  setDomEditableCell(cell)
  setCurrentEditableCell(cell)
}

// Añade la clase 'is-active' a la celda
const addClassCell = (cell) => cell.classList.add('is-active')

// Verifica si una celda es editable
export const isCellEditable = (cell) =>
  cell.getAttribute('contenteditable') === 'true'

// Resalta la celda seleccionada
export const highlightInputCell = (cell) => {
  if (cell.getAttribute('role') === ROLE_INPUT) {
    const currentActiveCell = getCurrentActiveCell()

    // Si la celda activa actual es diferente a la nueva, actualiza el foco
    if (currentActiveCell !== cell) {
      currentActiveCell && currentActiveCell.classList.remove('is-active')
      addClassCell(cell) // Marca la celda actual como activa
      highlightHeaderCell({ target: cell }) // Resalta el encabezado de la columna y fila
      disableCellEditing(cell) // Desactiva la edición en la celda anterior si es distinta
      setCurrentActiveCell(cell) // Actualiza la celda activa actual
    }
  }
}

// Establece una celda como editable en el DOM
export const setDomEditableCell = (cell) => {
  cell.setAttribute('contenteditable', 'true')
  cell.focus() // Coloca el cursor en la celda
}

// Desactiva la edición de una celda, a menos que sea la actual o se fuerce
export const disableCellEditing = (cell, { force = false } = {}) => {
  const currentEditableCell = getCurrentEditableCell()

  if ((currentEditableCell && currentEditableCell !== cell) || force) {
    try {
      currentEditableCell.removeAttribute('contenteditable')
    } catch (error) {
      // Maneja silenciosamente cualquier error si no hay celda editable
    }
  }
}

// Mueve el foco a la siguiente celda cuando se presiona Enter
export const moveFocusToNextCellOnEnter = (cell) => {
  const currentActiveCell = getCurrentActiveCell()

  // Obtiene el aria-label de la celda en la siguiente fila
  const ariaLabelNextCellActive =
    cell.getAttribute('label-header-col') +
    (parseInt(cell.getAttribute('label-header-row')) + 1)

  // Busca la siguiente celda en el DOM
  let nextCell = $(`.cell[aria-label="${ariaLabelNextCellActive}"]`)

  if (nextCell) {
    currentActiveCell.classList.remove('is-active')
    addClassCell(nextCell)
    highlightHeaderCell({ target: nextCell })
    disableCellEditing(nextCell)
    setCurrentActiveCell(nextCell)
    nextCell.focus() // Mueve el foco a la siguiente celda
  }
}

// Borra el contenido de una celda
export const clearCellContent = (cell) => {
  cell.textContent = ''
}
