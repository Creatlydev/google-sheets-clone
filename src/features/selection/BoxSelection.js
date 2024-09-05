import { ROLES } from '../../constants.js'
import { $ } from '../../utils/DOMUtils.js'

// Variables globales para el manejo de la selección de celdas
let isSelecting, initialCell, finalCell, hoveredCell
let selectedCells = {}
let selectionBox, initialCellRect

/**
 * Inicia el proceso de selección de celdas
 * @param {Event} event - Evento de clic en la celda inicial
 */
export const startCellSelection = (event) => {
  if (existSelectionBox()) {
    document.body.removeChild(selectionBox)
  }

  initialCell = event.target.closest('.cell-input')
  initialCellRect = initialCell.getBoundingClientRect()

  // Añade listeners para continuar la selección
  document.addEventListener('mousemove', onCellSelection)
  document.addEventListener('mouseup', completeCellSelection)
  document.addEventListener('mouseover', handleHoveredCell)
}

/**
 * Bloquea la selección de texto mientras se seleccionan celdas
 */
const onCellSelection = () => {
  if (!isSelecting && !finalCell) return
  isSelecting = true
}

/**
 * Agrega la celda actual al proceso de selección cuando se pasa sobre ella
 * @param {Event} event - Evento mouseover
 */
const handleHoveredCell = (event) => {
  // console.log()
  const target = event.target.closest('.cell-input')
  if (!target) return

  finalCell = target
  // Si la selección comenzó y se volvió a la celda inicial, se elimina el cuadro de selección
  if (finalCell === initialCell && existSelectionBox()) {
    selectedCells = {}
    document.body.removeChild(selectionBox)
  }

  // Crea y agrega un cuadro de selección si aún no existe
  if (finalCell !== initialCell && !existSelectionBox()) {
    selectionBox = createSelectionBox()
  }

  // Actualiza el cuadro de selección con las nuevas dimensiones
  if (finalCell !== initialCell) {
    updateSelectionBoxRect()
  }
}

/**
 * Finaliza el proceso de selección de celdas
 */
const completeCellSelection = () => {
  if (isSelecting) {
    // document.body.removeChild(selectionBox)
    findCellsInSelectionArea(initialCell, finalCell)
  }
  console.table(selectedCells)
  resetSelectionState()
}

// comprobar si existe el box que se dibuja sobre las celdas que se van seleccionando
const existSelectionBox = () => document.querySelector('.wrapper-cells')

/**
 * Devuelve un objeto con la fila y la columna de una celda
 * @param {Element} cell - Celda seleccionada
 * @returns {Object} - Objeto con la fila y columna
 */
const getRowAndColumn = (cell) => ({
  row: parseInt(cell.dataset.row),
  column: parseInt(cell.dataset.col)
})

/**
 * Establece las dimensiones y posición del cuadro de selección en función de las celdas seleccionadas
 */
const updateSelectionBoxRect = () => {
  const { startX, startY, finishX, finishY, positions } =
    getSelectionBoxBounds()
  const height = Math.abs(finishY - startY)
  const width = Math.abs(finishX - startX)

  applyStylesToSelectionBox(positions, startY, startX, height, width)
}

const getSelectionBoxBounds = () => {
  const { row: startRow, column: startColumn } = getRowAndColumn(initialCell)
  const { row: finishRow, column: finishColumn } = getRowAndColumn(finalCell)

  const positions = calculateStartFinishPositions(
    startRow,
    startColumn,
    finishRow,
    finishColumn
  )

  const startY =
    initialCellRect[positions.startPosY] + $('#grid-container').scrollTop
  const startX =
    initialCellRect[positions.startPosX] + $('#grid-container').scrollLeft

  const finalCellRect = finalCell.getBoundingClientRect()
  const finishY =
    finalCellRect[positions.finishPosY] + $('#grid-container').scrollTop
  const finishX =
    finalCellRect[positions.finishPosX] + $('#grid-container').scrollLeft

  return { startX, startY, finishX, finishY, positions }
}

/**
 * Encuentra todas las celdas dentro del área de selección definida por las celdas inicial y final.
 * La función calcula el rango de filas y columnas cubiertos por el área de selección y genera una lista de celdas comprometidas.
 *
 * @param {Object} initial - Objeto que representa la celda inicial de la selección, con propiedades:
 *                           {number} row - Número de la fila de la celda inicial.
 *                           {string} column - Letra de la columna de la celda inicial.
 * @param {Object} final - Objeto que representa la celda final de la selección, con propiedades:
 *                         {number} row - Número de la fila de la celda final.
 *                         {string} column - Letra de la columna de la celda final.
 *
 * @returns {Array<string>} - Lista de identificadores de celdas en el área de selección, donde cada identificador es una cadena compuesta por el número de fila y el número de columna.
 *
 */
function findCellsInSelectionArea(initial, final) {
  const getMinAndMax = (a, b) => {
    if (a <= b) return { min: a, max: b }
    return { min: b, max: a }
  }

  let { min: minRow, max: maxRow } = getMinAndMax(
    parseInt(initial.dataset.row),
    parseInt(final.dataset.row)
  )
  let { min: minColumn, max: maxColumn } = getMinAndMax(
    parseInt(initial.dataset.col),
    parseInt(final.dataset.col)
  )

  for (let i = minRow; i <= maxRow; i++) {
    for (let j = minColumn; j <= maxColumn; j++) {
      selectedCells[`${i}${j}`] = { row: i, column: j }
    }
  }
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
  let startPosY, startPosX, finishPosY, finishPosX

  if (finishRow >= startRow && finishColumn >= startColumn) {
    startPosY = 'top'
    startPosX = 'left'
    finishPosY = 'bottom'
    finishPosX = 'right'
  } else if (finishRow >= startRow && finishColumn < startColumn) {
    startPosY = 'top'
    startPosX = 'right'
    finishPosY = 'bottom'
    finishPosX = 'left'
  } else if (finishRow < startRow && finishColumn >= startColumn) {
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
  box.classList.add('wrapper-cells')
  document.body.appendChild(box)
  return box
}

/**
 * Resetea el estado de la selección de celdas
 */
const resetSelectionState = () => {
  isSelecting = false
  selectedCells = {}
  initialCell = null
  finalCell = null
  document.removeEventListener('mousemove', onCellSelection)
  document.removeEventListener('mouseup', completeCellSelection)
  document.removeEventListener('mouseover', handleHoveredCell)
}
