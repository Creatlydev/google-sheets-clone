import { INITIAL_GRID, ROLES } from '../../constants.js'
import { $ } from '../../utils/DOMUtils.js'
import { createElement, setAttribute, setStyles } from '../../utils/DOMUtils.js'
import { numberToColumn } from '../../utils/Helpers.js'
import { gridState } from './GridState.js'

function createInitialGrid() {
  const $gridContainer = $('#grid-container')
  const $horizontalHead = $('.js-horizontal-head')
  const $verticalHead = $('.js-vertical-head')

  setStyles($horizontalHead, { 'user-select': 'none' })

  // Crear encabezado horizontal
  const headFragment = document.createDocumentFragment()
  for (let i = 0; i < INITIAL_GRID.VISIBLE_COLS; i++) {
    const ariaLabel = numberToColumn(i)
    headFragment.appendChild(
      createElement(
        'div',
        { class: 'head-cell', 'aria-label': ariaLabel, index: i },
        ariaLabel
      )
    )
  }

  $horizontalHead.appendChild(headFragment)

  // Crear encabezado Vertcial
  const verticalFragment = document.createDocumentFragment()
  for (let i = 0; i < INITIAL_GRID.VISIBLE_ROWS; i++) {
    verticalFragment.appendChild(
      createElement('div', { class: 'head-cell', index: i }, i + 1)
    )
  }

  $verticalHead.appendChild(verticalFragment)

  // ========================
  renderSpreadSheet()
}

// Función para crear el contenedor de la celda
export function createCellContainer(cell, row, col) {
  const cellInput = createElement('div', {
    role: ROLES.CELL_INPUT,
    class: 'cell-input',
    tabindex: '0',
    'data-x': row,
    'data-y': col,
  })

  const computedValue = createElement(
    'span',
    { class: 'computed-value' },
    cell.computedValue
  )
  const valueElement = createElement('div', {}, cell.value)

  cellInput.appendChild(valueElement)
  cellInput.appendChild(computedValue)

  return cellInput
}

// Función principal para construir la grilla
export function renderSpreadSheet() {
  const $spreadSheet = $('.js-spreadsheet')
  const gridFragment = document.createDocumentFragment()
  gridState.initialize()
  const STATE = gridState.cells
  STATE.forEach((row, i) => {
    row.forEach((cell, j) => {
      gridFragment.appendChild(createCellContainer(cell, i, j))
    })
  })

  $spreadSheet.appendChild(gridFragment)
}

export default createInitialGrid
