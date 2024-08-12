import { columnToNumber } from '../utils/columnToNumber.js'
import { ROLE_INPUT } from '../utils/constants.js'

let isSelecting, startCell, finishCell, currentEvent, currentHoverCell
let selectedCells = []
let wrappedBox, widthWrapped, heightWrapped
let boxCell

export const startSelectingCells = (event) => {
  currentEvent = event
  finishCell = startCell = event.target
  boxCell = startCell.getBoundingClientRect()

  // Agregar celda inicial a la lista de seleccionadas
  selectedCells.push(getRowAndColumn(startCell))

  document.addEventListener('mousemove', selectingCells)
  document.addEventListener('mouseup', finishSelectingCells)

  document.addEventListener('mouseover', addCurrentHoverCell)
}

const addCurrentHoverCell = (event) => {
  console.log(event.target)
  if (event.target.getAttribute('role') !== ROLE_INPUT) {
    return
  }

  currentHoverCell = event.target
  finishCell = event.target
  selectedCells.push(getRowAndColumn(currentHoverCell))

  if (finishCell === startCell && isSelecting)
    document.body.removeChild(wrappedBox)

  if (finishCell !== startCell && !document.querySelector('.wrapped-cells')) {
    wrappedBox = document.createElement('div')
    wrappedBox.classList.add('wrapped-cells')
    document.body.appendChild(wrappedBox)
  }

  if (finishCell !== startCell) {
    setBoundingClientRect()
  }
}

const selectingCells = (event) => {
  document.body.style.userSelect = 'none'
  if (!isSelecting && selectedCells.length <= 1) return
  isSelecting = true
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
    row: parseInt(cell.getAttribute('label-header-row')),
    column: cell.getAttribute('label-header-col'),
  }
}

const setBoundingClientRect = () => {
  let { row: rowStartCell, column: columnStartCell } =
    getRowAndColumn(startCell)
  columnStartCell = columnToNumber(columnStartCell)

  let { row: rowFinishCell, column: columnFinishCell } =
    getRowAndColumn(finishCell)
  columnFinishCell = columnToNumber(columnFinishCell)
  // ----------------------------------------- \\
  let startWrappedX, startWrappedY, finishWrappedX, finishWrappedY
  let startPosX, startPosY, finishPosX, finishPosY

  if (
    (rowFinishCell > rowStartCell && columnFinishCell > columnStartCell) ||
    (rowFinishCell > rowStartCell && columnFinishCell === columnStartCell) ||
    (rowFinishCell === rowStartCell && columnFinishCell > columnStartCell)
  ) {
    startPosY = 'top'
    startPosX = 'left'
    finishPosY = 'bottom'
    finishPosX = 'right'
  } else if (
    (rowFinishCell > rowStartCell && columnFinishCell < columnStartCell) ||
    (rowFinishCell === rowStartCell && columnFinishCell < columnStartCell)
  ) {
    startPosY = 'top'
    startPosX = 'right'
    finishPosY = 'bottom'
    finishPosX = 'left'
  } else if (
    (rowFinishCell < rowStartCell && columnFinishCell < columnStartCell) ||
    (rowFinishCell < rowStartCell && columnFinishCell === columnStartCell)
  ) {
    startPosY = 'bottom'
    startPosX = 'right'
    finishPosY = 'top'
    finishPosX = 'left'
  } else if (
    rowFinishCell < rowStartCell &&
    columnFinishCell > columnStartCell
  ) {
    startPosY = 'bottom'
    startPosX = 'left'
    finishPosY = 'top'
    finishPosX = 'right'
  }

  //   ==================
  let startYCell = parseFloat(boxCell[startPosY]) + window.scrollY
  let startXCell = parseFloat(boxCell[startPosX]) + window.scrollX

  let boxFinishCell = finishCell.getBoundingClientRect()

  let finishYCell = parseFloat(boxFinishCell[finishPosY]) + window.scrollY
  let finishXCell = parseFloat(boxFinishCell[finishPosX]) + window.scrollX
  let height = Math.abs(finishYCell - startYCell)
  let width = Math.abs(finishXCell - startXCell)

  console.table({
    startPosY,
    startPosX,
    startYCell,
    startXCell,
    height,
    width,
  })

  wrappedBox.style = ''
  wrappedBox.style[startPosY] =
    startPosY === 'bottom' ? `calc(100% - ${startYCell}px)` : `${startYCell}px`
  wrappedBox.style[startPosX] =
    startPosX === 'right' ? `calc(100% - ${startXCell}px)` : `${startXCell}px`
  wrappedBox.style.height = `${height}px`
  wrappedBox.style.width = `${width}px`
}
