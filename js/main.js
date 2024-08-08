// main.js
import { createHeaderRow, numberToColumn } from './modules/header.js'
import { initializeEventHandlers } from './modules/eventHandlers.js'
import { $ } from './modules/domUtils.js'

const $cheetContainer = $('.sheet-container')
const cols = $cheetContainer.dataset.cols
const rows = $cheetContainer.dataset.rows


$cheetContainer.style.setProperty('--cols', cols)
$cheetContainer.style.setProperty('--rows', rows)

const createBodySheet = () => {
  const $bodySheet = $('.body-sheet')

  for (let i = 0; i < cols * rows; i++) {
    let row = Math.floor(i / rows) + 1
    let col = i % cols
    col = numberToColumn(col)
    const ariaLabel = `${col}${row}`
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.setAttribute('tabindex', 0)
    cell.setAttribute('label-header-row', row)
    cell.setAttribute('label-header-col', col)
    cell.setAttribute('aria-label', ariaLabel)
    cell.setAttribute('role', 'input')
    $bodySheet.appendChild(cell)
  }
}

createHeaderRow(cols)
createHeaderRow(rows, 'left')
createBodySheet()
initializeEventHandlers()
