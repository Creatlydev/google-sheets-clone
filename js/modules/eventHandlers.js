import {
  enableCellEditing,
  isCellEditable,
  clearCellContent,
  highlightInputCell,
  disableCellEditing,
  moveFocusToAdjacentCell,
  moveFocusVerticallyCell,
} from './cellActions.js'
import { $ } from '../utils/domUtils.js'
import { startResizing } from './resize.js'
import { ROLE_INPUT } from '../utils/constants.js'
import { startSelectingCells } from './selectedCells.js'

// Inicializa los manejadores de eventos para la hoja de cálculo
export const initializeEventHandlers = () => {
  // Obtiene referencias a elementos del DOM
  const $bodySheet = $('.body-sheet')
  const $headerRowTop = $('.header-row--top')
  const $headerRowLeft = $('.header-row--left')

  // Maneja el evento mousedown en la hoja de cálculo
  $bodySheet.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
      const target = event.target
      // Resalta la celda de entrada seleccionada
      highlightInputCell(target)
      !isCellEditable(target) && startSelectingCells(event)
    }
  })

  // evento que impide el comportamiento por defecto cuando el navegador detecta que se quiere arrastrar algun elemento
  $bodySheet.addEventListener('dragstart', (event) => {
    event.preventDefault()
  })

  // evento para evitar poder abrir el menu contextual y que active accidentalmente el evento mousemove
  $bodySheet.addEventListener('contextmenu', (event) => {
    event.preventDefault()
  })

  // Maneja el evento focusout en la hoja de cálculo
  $bodySheet.addEventListener('focusout', (event) => {
    const target = event.relatedTarget
    if (target && target.getAttribute('role') === ROLE_INPUT) {
      // Resalta la celda de entrada si el foco se mueve a otra celda editable
      highlightInputCell(target)
    } else {
      // Desactiva la celda de entrada si el foco se mueve a un elemento que no es una celda
      disableCellEditing(event.target, { force: true })
    }
  })

  // Maneja el evento dblclick en la hoja de cálculo
  $bodySheet.addEventListener('dblclick', (event) => {
    const target = event.target
    if (target.getAttribute('role') === ROLE_INPUT) {
      // Habilita la edición de la celda si es una celda editable
      enableCellEditing(target)
    }
  })

  // Maneja el evento keydown en la hoja de cálculo
  $bodySheet.addEventListener('keydown', (event) => {
    const target = event.target
    if (event.key === 'Enter') {
      event.preventDefault() // Previene el comportamiento por defecto del Enter
      if (isCellEditable(target)) {
        // Mueve el foco a la celda siguiente si la celda es editable
        moveFocusVerticallyCell(target, 'down')
      } else {
        // Habilita la edición de la celda si no es editable
        enableCellEditing(target)
      }
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      // Limpia el contenido de la celda si no es editable
      !isCellEditable(target) && clearCellContent(target)
    } else if (event.ctrlKey && event.key === 'a') {
      !isCellEditable(target) && event.preventDefault()
    }

    // Detectar si se ha presionado algunas de las teclas de flecha y mover foco a la celda correspondiente segun la dirrecion
    else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      let direction = event.key === 'ArrowRight' ? 'right' : 'left'
      !isCellEditable(target) && event.preventDefault()
      !isCellEditable(target) && moveFocusToAdjacentCell(target, direction)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      let direction = event.key === 'ArrowUp' ? 'up' : 'down'
      !isCellEditable(target) && event.preventDefault()
      !isCellEditable(target) && moveFocusVerticallyCell(target, direction)
    }
  })

  // Maneja el evento keypress en la hoja de cálculo
  $bodySheet.addEventListener('keypress', (event) => {
    const target = event.target
    if (!isCellEditable(target)) {
      // Habilita la edición de la celda si no es editable
      enableCellEditing(target)
    }
  })

  // Maneja el evento mousedown en la fila superior del encabezado
  $headerRowTop.addEventListener('mousedown', (event) => {
    const target = event.target
    if (target?.classList.contains('resizer')) {
      // Inicia el redimensionamiento de columnas si se hace clic en un resizer
      startResizing(event, { modified: 'columns' })
    }
  })

  // Maneja el evento mousedown en la fila izquierda del encabezado
  $headerRowLeft.addEventListener('mousedown', (event) => {
    const target = event.target
    if (target?.classList.contains('resizer')) {
      // Inicia el redimensionamiento de filas si se hace clic en un resizer
      startResizing(event, { modified: 'rows' })
    }
  })
}
