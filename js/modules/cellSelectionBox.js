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
  const { row: rowStart, column: columnStart } = getRowAndColumn(startCell)
  const { row: rowFinish, column: columnFinish } = getRowAndColumn(finishCell)

  const positions = determineStartFinishPositions(
    rowStart,
    columnStart,
    rowFinish,
    columnFinish
  )

  const startYCell = calculateCellPosition(boxCell, positions.startPosY)
  const startXCell = calculateCellPosition(boxCell, positions.startPosX)

  const boxFinishCell = finishCell.getBoundingClientRect()
  const finishYCell = calculateCellPosition(boxFinishCell, positions.finishPosY)
  const finishXCell = calculateCellPosition(boxFinishCell, positions.finishPosX)

  const height = Math.abs(finishYCell - startYCell)
  const width = Math.abs(finishXCell - startXCell)

  applyStylesToWrappedBox(positions, startYCell, startXCell, height, width)
}

const determineStartFinishPositions = (
  rowStart,
  columnStart,
  rowFinish,
  columnFinish
) => {
  const columnStartNum = columnToNumber(columnStart)
  const columnFinishNum = columnToNumber(columnFinish)

  let startPosY, startPosX, finishPosY, finishPosX

  if (rowFinish >= rowStart && columnFinishNum >= columnStartNum) {
    startPosY = 'top'
    startPosX = 'left'
    finishPosY = 'bottom'
    finishPosX = 'right'
  } else if (rowFinish >= rowStart && columnFinishNum < columnStartNum) {
    startPosY = 'top'
    startPosX = 'right'
    finishPosY = 'bottom'
    finishPosX = 'left'
  } else if (rowFinish < rowStart && columnFinishNum >= columnStartNum) {
    startPosY = 'bottom'
    startPosX = 'left'
    finishPosY = 'top'
    finishPosX = 'right'
  } else {
    startPosY = 'bottom'
    startPosX = 'right'
    finishPosY = 'top'
    finishPosX = 'left'
  }

  return { startPosY, startPosX, finishPosY, finishPosX }
}

const calculateCellPosition = (cellRect, position) => {
  return parseFloat(cellRect[position]) + window.scrollY
}

const applyStylesToWrappedBox = (positions, startY, startX, height, width) => {
  let startPosY = positions.startPosY
  let startPosX = positions.startPosX
  wrappedBox.style = ''
  wrappedBox.style[startPosY] =
    startPosY === 'bottom' ? `calc(100% - ${startY}px)` : `${startY}px`
  wrappedBox.style[startPosX] =
    startPosX === 'right' ? `calc(100% - ${startX}px)` : `${startX}px`
  wrappedBox.style.height = `${height}px`
  wrappedBox.style.width = `${width}px`
}
