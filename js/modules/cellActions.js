import {
  getCurrentEditableCell,
  setCurrentEditableCell,
  getCurrentActiveCell,
  setCurrentActiveCell
} from './globalState.js'
import { highlightHeaderCell } from './header.js'
import { columnToNumber } from '../utils/columnToNumber.js'
import { numberToColumn } from '../utils/numberToColumn.js'
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

// Mueve el foco a la celda de la izquierda o derecha según la dirección indicada
export const moveFocusToAdjacentCell = (cell, direction) => {
  const currentActiveCell = getCurrentActiveCell()

  // // Ajusta la columna según la dirección
  const nextCol = numberToColumn(
    columnToNumber(cell.getAttribute('label-header-col')) +
      (direction === 'right' ? +1 : -1)
  )
  const ariaLabelNextCellActive =
    nextCol + cell.getAttribute('label-header-row')

  // Busca la celda a la derecha en el DOM
  let nextCell = $(`.cell[aria-label="${ariaLabelNextCellActive}"]`)

  if (nextCell) {
    highlightInputCell(nextCell)
    nextCell.focus() // Mueve el foco a la celda de la derecha
  }
}

// Mueve el foco a la celda de arriba o abajo segun la direccion indicada
export const moveFocusVerticallyCell = (cell, direction) => {
  const currentActiveCell = getCurrentActiveCell()
  const newRow =
    parseInt(cell.getAttribute('label-header-row')) +
    (direction === 'down' ? +1 : -1)

  // Obtiene el aria-label de la celda en la fila correspondiente
  const ariaLabelNextCellActive = cell.getAttribute('label-header-col') + newRow

  // Busca la siguiente celda en el DOM
  let nextCell = $(`.cell[aria-label="${ariaLabelNextCellActive}"]`)

  if (nextCell) {
    highlightInputCell(nextCell)
    nextCell.focus() // Mueve el foco a la siguiente celda
  }
}

// Borra el contenido de una celda
export const clearCellContent = (cell) => {
  cell.textContent = ''
}
