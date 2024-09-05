import {
  getCurrentActiveCell,
  getCurrentEditableCell,
  setCurrentActiveCell,
  setCurrentEditableCell,
} from '../../GlobalState.js'
import {
  $,
  $$,
  removeAttribute,
  removeClass,
  setAttribute,
  setStyles,
} from '../../utils/DOMUtils.js'
import { CELL_CLASSES, HEADER_CLASSES } from '../../constants.js'
import { gridState } from './GridState.js'

// Añade la clases a la celda
const addClassCell = (cell, ...classes) => cell.classList.add(...classes)

const getChildrensCell = (cell) => {
  const value = cell.querySelector('.value')
  const computedValue = cell.querySelector('.computed-value')
  return { computedValue, value }
}

export const isEditableCell = (cell) => {
  const { value } = getChildrensCell(cell)
  return value.getAttribute('contenteditable') === 'true'
}

// Habilitar la edicion en la celda
export const enableEditingCell = (cell) => {
  const { value } = getChildrensCell(cell)
  setStyles(value, { 'z-index': '1' })
  // Hacer editable el elemento
  setAttribute(value, 'contenteditable', 'true')
  setCurrentEditableCell(cell)
  cell.focus()

  // Crear un rango de selección manualmente para asegurar que el cursor aparezca
  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNodeContents(value)
  //range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

export const highlightInputCell = (cell) => {
  const currentActiveCell = getCurrentActiveCell()
  if (currentActiveCell !== cell) {
    currentActiveCell && removeClass('is-active', currentActiveCell)
    addClassCell(cell, 'is-active')
    highlightHeaderCells([cell])
    setCurrentActiveCell(cell)
    updateCell(getCurrentEditableCell()) // !!
    disableCellEditing(cell)
    // cell.click()
  }
}

// Desactiva la edición de una celda si es distinta a la actual o se fuerce
export const disableCellEditing = (cell, { force = false } = {}) => {
  const currentEditableCell = getCurrentEditableCell()

  if ((currentEditableCell && currentEditableCell !== cell) || force) {
    try {
      const { value } = getChildrensCell(currentEditableCell)
      removeAttribute(value, 'contenteditable')
      setStyles(value, { 'z-index': 'unset' })
      setCurrentEditableCell(null)
      updateCell(cell)
    } catch (error) {
      // Maneja silenciosamente cualquier error si no hay celda editable
    }
  }
}

export const clearContentCell = (cell) => {
  const { computedValue, value } = getChildrensCell(cell)
  value.textContent = computedValue.textContent = ''
}

// ESTA FUNCIONALIDAD SERA REFACTORIZADA
const updateCell = (cell) => {
  try {
    if (cell) {
      const { computedValue, value } = getChildrensCell(cell)
      const { row, col } = cell.dataset

      const contentValue = value.textContent
      let contentComputedValue = contentValue
      try {
        if (contentValue.startsWith('=')) {
          contentComputedValue = eval(contentValue.slice(1))
        }
      } catch (error) {
        console.error('Error al realizar la operacion ')
        contentComputedValue = '!#Error#¡'
      }
      computedValue.textContent = contentComputedValue

      gridState.cells[row][col] = {
        computedValue: contentComputedValue,
        value: contentValue,
      }
    }
  } catch (error) {
    console.error('Error al actualizar la celda: ', error.message)
  }
}

// HIGHLIGHTING HEADERS CELLS
// Resalta los encabezados correspondientes a las celdas seleccionadas
export const highlightHeaderCells = (cells) => {
  // Elimina el resaltado de los encabezados anteriores
  $$(
    `.horizontal-head > .${HEADER_CLASSES.HEAD_CELL}.${CELL_CLASSES.HIGHLIGHTED}`
  ).forEach((cell) => {
    cell.classList.remove(`${CELL_CLASSES.HIGHLIGHTED}`)
  })
  $$(
    `.vertical-head > .${HEADER_CLASSES.HEAD_CELL}.${CELL_CLASSES.HIGHLIGHTED}`
  ).forEach((cell) => {
    cell.classList.remove(`${CELL_CLASSES.HIGHLIGHTED}`)
  })
  // Resalta los encabezados de las columnas y filas correspondientes
  cells.forEach((cell) => {
    const row = cell.dataset.row
    const col = cell.dataset.col
    const $columnHeader = $(
      `.horizontal-head > .${HEADER_CLASSES.HEAD_CELL}[index='${col}']`
    )
    const $rowHeader = $(
      `.vertical-head > .${HEADER_CLASSES.HEAD_CELL}[index='${row}']`
    )
    selectHeaderCell($columnHeader)
    selectHeaderCell($rowHeader)
  })
}

const selectHeaderCell = (header) => {
  header.classList.add(`${CELL_CLASSES.HIGHLIGHTED}`)
}
