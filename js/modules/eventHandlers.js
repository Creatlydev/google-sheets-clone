import {
  enableCellEditing,
  isCellEditable,
  clearCellContent,
  highlightInputCell,
  moveFocusToNextCellOnEnter,
  disableCellEditing
} from './cellActions.js'
import { $ } from '../utils/domUtils.js'
import { startResizing } from './resize.js'
import { ROLE_INPUT } from '../utils/constants.js'

export const initializeEventHandlers = () => {
  const $bodySheet = $('.body-sheet')
  const $headerRowTop = $('.header-row--top')
  const $headerRowLeft = $('.header-row--left')

  $bodySheet.addEventListener('mousedown', (event) => {
    const target = event.target
    highlightInputCell(target)
  })

  $bodySheet.addEventListener('focusout', (event) => {
    const target = event.relatedTarget
    if (target && target.getAttribute('role') === ROLE_INPUT) {
      highlightInputCell(target)
    } else {
      disableCellEditing(event.target, {force: true})
    }
  })

  $bodySheet.addEventListener('dblclick', (event) => {
    const target = event.target
    if (target.getAttribute('role') === ROLE_INPUT) {
      enableCellEditing(target)
    }
  })

  $bodySheet.addEventListener('keydown', (event) => {
    const target = event.target
    if (event.key === 'Enter') {
      event.preventDefault()
      if (isCellEditable(target)) {
        // Lógica para cuando la celda sea editable y se presione Enter otra vez
        moveFocusToNextCellOnEnter(target)
      } else {
        enableCellEditing(target)
      }
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (!isCellEditable(target)) clearCellContent(target)
    }
  })

  $bodySheet.addEventListener('keypress', (event) => {
    const target = event.target
    !isCellEditable(target) && enableCellEditing(target)
  })

  $headerRowTop.addEventListener('mousedown', (event) => {
    const target = event.target
    if (target?.classList.contains('resizer')) {
      startResizing(event, { modified: 'columns' })
    }
  })
  $headerRowLeft.addEventListener('mousedown', (event) => {
    const target = event.target
    if (target?.classList.contains('resizer')) {
      startResizing(event, { modified: 'rows' })
    }
  })
}
