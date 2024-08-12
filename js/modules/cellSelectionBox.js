import { columnToNumber } from '../utils/columnToNumber.js'
import { ROLE_INPUT } from '../utils/constants.js'

// Variables globales para el manejo de la selección de celdas
let isSelecting, initialCell, finalCell, hoveredCell
let selectedCells = []
let selectionBox, initialCellRect

/**
 * Inicia el proceso de selección de celdas
 * @param {Event} event - Evento de clic en la celda inicial
 */
export const startCellSelection = (event) => {
  initialCell = finalCell = event.target
  initialCellRect = initialCell.getBoundingClientRect()

  // Agrega la celda inicial a la lista de celdas seleccionadas
  selectedCells.push(getRowAndColumn(initialCell))

  // Añade listeners para continuar la selección
  document.addEventListener('mousemove', onCellSelection)
  document.addEventListener('mouseup', completeCellSelection)
  document.addEventListener('mouseover', handleHoveredCell)
}

/**
 * Agrega la celda actual al proceso de selección cuando se pasa sobre ella
 * @param {Event} event - Evento mouseover
 */
const handleHoveredCell = (event) => {
  if (event.target.getAttribute('role') !== ROLE_INPUT) return

  hoveredCell = event.target
  finalCell = event.target
  selectedCells.push(getRowAndColumn(hoveredCell))

  // Si la selección comenzó y se volvió a la celda inicial, se elimina el cuadro de selección
  if (finalCell === initialCell && isSelecting) {
    document.body.removeChild(selectionBox)
  }

  // Crea y agrega un cuadro de selección si aún no existe
  if (finalCell !== initialCell && !document.querySelector('.wrapped-cells')) {
    selectionBox = createSelectionBox()
  }

  // Actualiza el cuadro de selección con las nuevas dimensiones
  if (finalCell !== initialCell) {
    updateSelectionBoxRect()
  }
}

/**
 * Bloquea la selección de texto mientras se seleccionan celdas
 */
const onCellSelection = () => {
  document.body.style.userSelect = 'none'
  if (!isSelecting && selectedCells.length <= 1) return
  isSelecting = true
}

/**
 * Finaliza el proceso de selección de celdas
 */
const completeCellSelection = () => {
  document.body.style.userSelect = 'unset'
  if (isSelecting) {
    document.body.removeChild(selectionBox)
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
const updateSelectionBoxRect = () => {
  const { row: startRow, column: startColumn } = getRowAndColumn(initialCell)
  const { row: finishRow, column: finishColumn } = getRowAndColumn(finalCell)

  const positions = calculateStartFinishPositions(
    startRow,
    startColumn,
    finishRow,
    finishColumn
  )

  const startY = initialCellRect[positions.startPosY] + window.scrollY
  const startX = initialCellRect[positions.startPosX] + window.scrollX

  const finalCellRect = finalCell.getBoundingClientRect()
  const finishY = finalCellRect[positions.finishPosY] + window.scrollY
  const finishX = finalCellRect[positions.finishPosX] + window.scrollX

  const height = Math.abs(finishY - startY)
  const width = Math.abs(finishX - startX)

  applyStylesToSelectionBox(positions, startY, startX, height, width)
}

/**
 * Determina las posiciones de inicio y fin del cuadro de selección
 */
const calculateStartFinishPositions = (
  startRow,
  startColumn,
  finishRow,
  finishColumn
) => {
  const startColumnNum = columnToNumber(startColumn)
  const finishColumnNum = columnToNumber(finishColumn)

  let startPosY, startPosX, finishPosY, finishPosX

  if (finishRow >= startRow && finishColumnNum >= startColumnNum) {
    startPosY = 'top'
    startPosX = 'left'
    finishPosY = 'bottom'
    finishPosX = 'right'
  } else if (finishRow >= startRow && finishColumnNum < startColumnNum) {
    startPosY = 'top'
    startPosX = 'right'
    finishPosY = 'bottom'
    finishPosX = 'left'
  } else if (finishRow < startRow && finishColumnNum >= startColumnNum) {
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
const applyStylesToSelectionBox = (
  positions,
  startY,
  startX,
  height,
  width
) => {
  let { startPosY, startPosX } = positions

  selectionBox.style = ''
  selectionBox.style[startPosY] =
    startPosY === 'bottom' ? `calc(100% - ${startY}px)` : `${startY}px`
  selectionBox.style[startPosX] =
    startPosX === 'right' ? `calc(100% - ${startX}px)` : `${startX}px`
  selectionBox.style.height = `${height}px`
  selectionBox.style.width = `${width}px`
}

/**
 * Crea y devuelve un nuevo elemento div para el cuadro de selección
 * @returns {Element} - Elemento div creado
 */
const createSelectionBox = () => {
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
  document.removeEventListener('mousemove', onCellSelection)
  document.removeEventListener('mouseup', completeCellSelection)
  document.removeEventListener('mouseover', handleHoveredCell)
}
