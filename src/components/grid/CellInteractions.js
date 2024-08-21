import {
  getCurrentActiveCell,
  getCurrentEditableCell,
  setCurrentActiveCell,
  setCurrentEditableCell,
} from '../../GlobalState.js'
import {
  removeAttribute,
  removeClass,
  setAttribute,
  setStyles,
} from '../../utils/DOMUtils.js'
import { gridState } from './GridState.js'

// Añade la clases a la celda
const addClassCell = (cell, ...classes) => cell.classList.add(...classes)

const getEditableCell = (cell) => cell.querySelector('.value')

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
    setCurrentActiveCell(cell)
    updateCell(getCurrentEditableCell()) // !!
    disableCellEditing(cell)
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
      if (contentValue.startsWith('=')) {
        contentComputedValue = eval(contentValue.slice(1))
      }
      computedValue.textContent = contentComputedValue

      gridState.cells[row][col] = {
        computedValue: contentComputedValue,
        value: contentValue,
      }
    }
  } catch (error) {
    console.error('Error al actualizar la celda:', error)
  }
}
