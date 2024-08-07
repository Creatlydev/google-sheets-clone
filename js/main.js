// Selector helper function
const $ = (el, all = false) =>
  all ? document.querySelectorAll(el) : document.querySelector(el)

// DOM elements
const $cheetContainer = $('.sheet-container')
const $headerRowTop = $('.header-row--top')
const $headerRowLeft = $('.header-row--left')
const $bodySheet = $('.body-sheet')

// Grid dimensions
const cols = $cheetContainer.dataset.cols
const rows = $cheetContainer.dataset.rows
$cheetContainer.style.setProperty('--cols', cols)
$cheetContainer.style.setProperty('--rows', rows)

// Track the currently editable cell
let currentCellEditable = null

/**
 * Convert a number to a column label (e.g., 0 -> A, 1 -> B)
 * @param {number} n - The column number
 * @returns {string} - The column label
 */
function numberToColumn(n) {
  let column = ''
  while (n >= 0) {
    column = String.fromCharCode((n % 26) + 65) + column
    n = Math.floor(n / 26) - 1
  }
  return column
}

/**
 * Create header rows for the spreadsheet
 * @param {string} position - 'top' for column headers, 'left' for row headers
 */
function createHeaderRow(position = 'top') {
  for (let i = 0; i < cols; i++) {
    const headerCell = document.createElement('div')
    headerCell.classList.add('header-cell')
    let content = position === 'top' ? numberToColumn(i) : i + 1
    headerCell.setAttribute('aria-label', content)
    headerCell.textContent = content

    // Add header cell to appropriate header row
    if (position === 'top') {
      $headerRowTop.appendChild(headerCell)
    } else {
      $headerRowLeft.appendChild(headerCell)
    }
  }
}

/**
 * Highlight header cells corresponding to the selected cell
 * @param {Object} event - The event object
 */
function highlighHeaderCell({ target }) {
  const row = target.getAttribute('label-header-row')
  const col = target.getAttribute('label-header-col')

  $('.header-row--top > .header-cell.is-highlight')?.classList.remove(
    'is-highlight'
  )
  $('.header-row--left > .header-cell.is-highlight')?.classList.remove(
    'is-highlight'
  )

  const $colHeader = $(`.header-cell[aria-label='${col}']`)
  const $rowHeader = $(`.header-cell[aria-label='${row}']`)
  $colHeader.classList.add('is-highlight')
  $rowHeader.classList.add('is-highlight')
}

/**
 * Create the body of the spreadsheet
 */
function createBodySheet() {
  createHeaderRow()
  createHeaderRow('left')

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

/**
 * Remove the contenteditable attribute from the currently editable cell
 * @param {HTMLElement} cell - The cell to make non-editable
 */
const removeEditable = (cell) => {
  if (currentCellEditable && currentCellEditable !== cell) {
    currentCellEditable.removeAttribute('contenteditable')
  }
}

/**
 * Make a cell editable
 * @param {HTMLElement} cell - The cell to make editable
 */
function makeCellEditable(cell) {
  removeEditable(cell)

  cell.setAttribute('contenteditable', 'true')
  cell.focus()

  currentCellEditable = cell
}

/**
 * Highlight the cell and corresponding headers when clicked
 * @param {HTMLElement} target - The clicked cell
 */
const highlightCellInput = (target) => {
  if (target.getAttribute('role') === 'input') {
    highlighHeaderCell({ target })
    removeEditable(target)
  }
}

// Event listener for single click on body cells
$bodySheet.addEventListener('click', (event) => {
  const target = event.target
  highlightCellInput(target)
})

// Event listener for double click on body cells to make them editable
$bodySheet.addEventListener('dblclick', (event) => {
  const target = event.target
  if (target.getAttribute('role') === 'input') {
    makeCellEditable(target)
  }
})

/**
 * Check if a cell is currently editable
 * @param {HTMLElement} cell - The cell to check
 * @returns {boolean} - True if the cell is editable, false otherwise
 */
const isEditable = (cell) => {
  return cell.getAttribute('contenteditable') === 'true'
}

// Event listener for keydown events in body cells
$bodySheet.addEventListener('keydown', (event) => {
  const target = event.target

  if (event.key === 'Enter') {
    event.preventDefault()
    if (isEditable(target)) {
      // Logic to move focus to the next cell when Enter is pressed in an editable cell
    } else {
      makeCellEditable(target)
    }
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (!isEditable(target)) {
      target.textContent = ''
    }
  }
})

// Initialize the spreadsheet
createBodySheet()
