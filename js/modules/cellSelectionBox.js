import { columnToNumber } from '../utils/columnToNumber.js'
import { ROLE_INPUT } from '../utils/constants.js'

// Variables globales para el manejo de la selección de celdas
let isSelecting, startCell, finishCell, currentHoverCell
let selectedCells = []
let wrappedBox, boxCell

/**
 * Inicia el proceso de selección de celdas
 * @param {Event} event - Evento de clic en la celda inicial
 */
export const startSelectingCells = (event) => {
  startCell = finishCell = event.target
  boxCell = startCell.getBoundingClientRect()

  // Agrega la celda inicial a la lista de celdas seleccionadas
  selectedCells.push(getRowAndColumn(startCell))

  // Añade listeners para continuar la selección
  document.addEventListener('mousemove', selectingCells)
  document.addEventListener('mouseup', finishSelectingCells)
  document.addEventListener('mouseover', addCurrentHoverCell)
}

/**
 * Agrega la celda actual al proceso de selección cuando se pasa sobre ella
 * @param {Event} event - Evento mouseover
 */
const addCurrentHoverCell = (event) => {
  if (event.target.getAttribute('role') !== ROLE_INPUT) return

  currentHoverCell = event.target
  finishCell = event.target
  selectedCells.push(getRowAndColumn(currentHoverCell))

  // Si la selección comenzó y se volvió a la celda inicial, se elimina el cuadro de selección
  if (finishCell === startCell && isSelecting) {
    document.body.removeChild(wrappedBox)
  }

  // Crea y agrega un cuadro de selección si aún no existe
  if (finishCell !== startCell && !document.querySelector('.wrapped-cells')) {
    wrappedBox = createWrappedBox()
  }

  // Actualiza el cuadro de selección con las nuevas dimensiones
  if (finishCell !== startCell) {
    setBoundingClientRect()
  }
}

/**
 * Bloquea la selección de texto mientras se seleccionan celdas
 * @param {Event} event - Evento mousemove
 */
const selectingCells = () => {
  document.body.style.userSelect = 'none'
  if (!isSelecting && selectedCells.length <= 1) return
  isSelecting = true
}

/**
 * Finaliza el proceso de selección de celdas
 */
const finishSelectingCells = () => {
  document.body.style.userSelect = 'unset'
  if (isSelecting) {
    document.body.removeChild(wrappedBox)
  }
  resetSelectionState()
}

/**
 * Devuelve un objeto con la fila y la columna de una celda
 * @param {Element} cell - Celda seleccionada
 * @returns {Object} - Objeto con la fila y columna
 */
const getRowAndColumn = (cell) => ({
  row: parseInt(cell.getAttribute('label-header-row')),
  column: cell.getAttribute('label-header-col'),
})

/**
 * Establece las dimensiones y posición del cuadro de selección en función de las celdas seleccionadas
 */
const setBoundingClientRect = () => {
  const { row: rowStart, column: columnStart } = getRowAndColumn(startCell)
  const { row: rowFinish, column: columnFinish } = getRowAndColumn(finishCell)

  const positions = determineStartFinishPositions(
    rowStart,
    columnStart,
    rowFinish,
    columnFinish
  )

  const startYCell = boxCell[positions.startPosY] + window.scrollY
  const startXCell = boxCell[positions.startPosX] + window.scrollX

  const boxFinishCell = finishCell.getBoundingClientRect()
  const finishYCell = boxFinishCell[positions.finishPosY] + window.scrollY
  const finishXCell = boxFinishCell[positions.finishPosX] + window.scrollX

  const height = Math.abs(finishYCell - startYCell)
  const width = Math.abs(finishXCell - startXCell)

  applyStylesToWrappedBox(positions, startYCell, startXCell, height, width)
}

/**
 * Determina las posiciones de inicio y fin del cuadro de selección
 */
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

/**
 * Aplica los estilos calculados al cuadro de selección
 */
const applyStylesToWrappedBox = (positions, startY, startX, height, width) => {
  let { startPosY, startPosX } = positions

  wrappedBox.style = ''
  wrappedBox.style[startPosY] =
    startPosY === 'bottom' ? `calc(100% - ${startY}px)` : `${startY}px`
  wrappedBox.style[startPosX] =
    startPosX === 'right' ? `calc(100% - ${startX}px)` : `${startX}px`
  wrappedBox.style.height = `${height}px`
  wrappedBox.style.width = `${width}px`
}

/**
 * Crea y devuelve un nuevo elemento div para el cuadro de selección
 * @returns {Element} - Elemento div creado
 */
const createWrappedBox = () => {
  const box = document.createElement('div')
  box.classList.add('wrapped-cells')
  document.body.appendChild(box)
  return box
}

/**
 * Resetea el estado de la selección de celdas
 */
const resetSelectionState = () => {
  isSelecting = false
  selectedCells = []
  document.removeEventListener('mousemove', selectingCells)
  document.removeEventListener('mouseup', finishSelectingCells)
  document.removeEventListener('mouseover', addCurrentHoverCell)
}
