let isSelecting, startCell, finishCell, currentEvent
let startX, startY, finishX, finishY, currentHoverCell
let selectedCells = []
let wrappedBox

export const startSelectingCells = (event) => {
  currentEvent = event
  finishCell = startCell = event.target
  let boxCell = startCell.getBoundingClientRect()
  startX = parseFloat(boxCell.left) + window.scrollX
  startY = parseFloat(boxCell.top) + window.scrollY

  // Agregar celda inicial a la lista de seleccionadas
  selectedCells.push(getRowAndColumn(startCell))

  document.addEventListener('mousemove', selectingCells)
  document.addEventListener('mouseup', finishSelectingCells)

  document.addEventListener('mouseover', addCurrentHoverCell)
}

const addCurrentHoverCell = (event) => {
  currentHoverCell = event.target
  selectedCells.push(getRowAndColumn(currentHoverCell))
}

const selectingCells = (event) => {
  document.body.style.userSelect = 'none'
  if (!isSelecting && selectedCells.length <= 1) {
    wrappedBox = document.createElement('div')
    wrappedBox.classList.add('wrapped-cells')
    document.body.appendChild(wrappedBox)
    console.log('ESTO SE EJECUTA SOLO LA PRIMERA VEZ')
    return
  }

  console.log('=======================================')

  isSelecting = true

  finishX = event.pageX
  finishY = event.pageY
  let width = finishX - startX
  let height = finishY - startY

  wrappedBox.style.top = `${startY}px`
  wrappedBox.style.left = `${startX}px`
  wrappedBox.style.width = `${width}px`
  wrappedBox.style.height = `${height}px`
}

const finishSelectingCells = () => {
  document.body.style.userSelect = 'unset'
  isSelecting && document.body.removeChild(wrappedBox)
  isSelecting = false
  selectedCells = []
  document.removeEventListener('mousemove', selectingCells)
  document.removeEventListener('mouseup', finishSelectingCells)
  document.removeEventListener('mouseover', addCurrentHoverCell)
}

// UTILITIES

const getRowAndColumn = (cell) => {
  return {
    row: cell.getAttribute('label-header-row'),
    column: cell.getAttribute('label-header-col'),
  }
}
