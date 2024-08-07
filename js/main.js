const $ = (el, all = false) =>
  all ? document.querySelectorAll(el) : document.querySelector(el)

const $cheetContainer = $('.sheet-container')
const $headerRowTop = $('.header-row--top')
const $headerRowLeft = $('.header-row--left')
const $bodySheet = $('.body-sheet')

const cols = $cheetContainer.dataset.cols
const rows = $cheetContainer.dataset.rows
$cheetContainer.style.setProperty('--cols', cols)
$cheetContainer.style.setProperty('--rows', rows)

let currentCellEditable = null

function numberToColumn(n) {
  let column = ''
  while (n >= 0) {
    column = String.fromCharCode((n % 26) + 65) + column
    n = Math.floor(n / 26) - 1
  }
  return column
}

function createHeaderRow(position = 'top') {
  for (let i = 0; i < cols; i++) {
    const headerCell = document.createElement('div')
    headerCell.classList.add('header-cell')
    let content = position === 'top' ? numberToColumn(i) : i + 1
    headerCell.setAttribute('aria-label', content)
    headerCell.textContent = content

    // Agregar al header row
    position === 'top'
      ? $headerRowTop.appendChild(headerCell)
      : $headerRowLeft.appendChild(headerCell)
  }
}

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

const removeEditable = (cell) => {
  if (currentCellEditable && currentCellEditable !== cell) {
    currentCellEditable?.removeAttribute('contenteditable')
  }
}

// Función para hacer una celda editable
function makeCellEditable(cell) {
  removeEditable(cell)

  cell.setAttribute('contenteditable', 'true')
  cell.focus()

  currentCellEditable = cell
}

const highlightCellInput = (target) => {
  if (target.getAttribute('role') === 'input') {
    highlighHeaderCell({ target })
    removeEditable(target)
  }
}

$bodySheet.addEventListener('click', (event) => {
  const target = event.target
  highlightCellInput(target)
})

$bodySheet.addEventListener('dblclick', (event) => {
  const target = event.target
  if (target.getAttribute('role') === 'input') {
    makeCellEditable(target)
  }
})

const isEditable = (cell) => {
  if (cell.getAttribute('contenteditable') === 'true') return true
  return false
}

$bodySheet.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (isEditable(event.target)) {
      // Logica para cuando la celda sea editable y se de enter otra vez, el foco se pase a la celda posterior siguiente
    } else {
      makeCellEditable(event.target)
    }
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (!isEditable(event.target)) event.target.textContent = ''
  }
})

createBodySheet()
