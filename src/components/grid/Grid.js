import { INITIAL_GRID, ROLES, HEADER_CLASSES } from '../../Constants.js'
import { $ } from '../../utils/DOMUtils.js'
import { createElement, setAttribute, setStyles } from '../../utils/DOMUtils.js'
import { numberToColumn } from '../../utils/Helpers.js'
import { gridState } from './GridState.js'

function createInitialGrid() {
  const $gridContainer = $('#grid-container')
  const $horizontalHead = $('.js-horizontal-head')
  const $verticalHead = $('.js-vertical-head')

  // Crear encabezado horizontal
  const horizontalFragment = document.createDocumentFragment()
  for (let i = 0; i < INITIAL_GRID.VISIBLE_COLS; i++) {
    const ariaLabel = numberToColumn(i)
    horizontalFragment.appendChild(
      createElement(
        'div',
        { class: HEADER_CLASSES.HEAD_CELL, 'aria-label': ariaLabel, index: i },
        ariaLabel
      )
    )
  }

  $horizontalHead.appendChild(horizontalFragment)

  // Crear encabezado Vertcial
  const verticalFragment = document.createDocumentFragment()
  for (let i = 0; i < INITIAL_GRID.VISIBLE_ROWS; i++) {
    verticalFragment.appendChild(
      createElement('div', { class: HEADER_CLASSES.HEAD_CELL, index: i }, i + 1)
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
    'data-row': row,
    'data-col': col,
    'aria-label': numberToColumn(col)
  })

  const computedValue = createElement(
    'span',
    { class: 'computed-value' },
    cell.computedValue
)
  const valueElement = createElement('div', { class: 'value' }, cell.value)

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
