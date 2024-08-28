import { INITIAL_GRID } from '../../Constants.js'
import { gridState } from './GridState.js'
import { $, createElement, setStyles } from '../../utils/DOMUtils.js'
import { createCellContainer } from './Grid.js'

const $gridContainer = $('#grid-container')
const $spreadSheet = $('.js-spreadsheet')

// Funcion para agregar nuevas filas
function addRows() {
  const $verticalHead = $('.js-vertical-head')
  const fragment = document.createDocumentFragment()
  const cellFragment = document.createDocumentFragment()
  const NEW_ROWS = []

  const currentRowCount = gridState.length()
  const updateRowCount = currentRowCount + INITIAL_GRID.ROW_INCREMENT
  for (let row = currentRowCount; row < updateRowCount; row++) {
    fragment.appendChild(
      createElement('div', { class: 'head-cell', index: row }, row + 1)
    )
    NEW_ROWS.push([])
    for (let col = 0; col < gridState.cells[0].length; col++) {
      const cell = { computedValue: '', value: '' }
      cellFragment.appendChild(createCellContainer(cell, row, col))
      NEW_ROWS[row - currentRowCount].push(cell)
    }
  }

  setStyles($gridContainer, { '--rows': updateRowCount })
  $verticalHead.appendChild(fragment)
  $spreadSheet.appendChild(cellFragment)
  moveSentinel()

  // Update STATE
  gridState.cells = [...gridState.cells, ...NEW_ROWS]
}

function moveSentinel() {
  const $verticalSentinel = $('.sentinel-vertical')
  $gridContainer.appendChild($verticalSentinel) // Mover el sentinela al final
}

export function initGridExpansionObserver() {
  const $verticalSentinel = createElement('div', {
    class: 'sentinel-vertical',
  })

  $gridContainer.appendChild($verticalSentinel)

  const verticalObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        addRows()
      }
    },
    {
      threshold: 0,
    }
  )

  verticalObserver.observe($verticalSentinel)
}
