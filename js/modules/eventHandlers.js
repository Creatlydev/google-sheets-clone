// eventHandlers.js
import {
  enableCellEditing,
  isCellEditable,
  clearCellContent,
  highlightInputCell
} from './cellActions.js'
import { $ } from './domUtils.js'
import { startResizing } from './resize.js'

export const initializeEventHandlers = () => {
  const $bodySheet = $('.body-sheet')
  const $headerRowTop = $('.header-row--top')
  const $headerRowLeft = $('.header-row--left')

  $bodySheet.addEventListener('mousedown', (event) => {
    const target = event.target
    highlightInputCell(target)
  })

  $bodySheet.addEventListener('dblclick', (event) => {
    const target = event.target
    if (target.getAttribute('role') === 'input') {
      enableCellEditing(target)
    }
  })

  $bodySheet.addEventListener('keydown', (event) => {
    const target = event.target
    if (event.key === 'Enter') {
      event.preventDefault()
      if (isCellEditable(target)) {
        // Lógica para cuando la celda sea editable y se presione Enter otra vez
      } else {
        enableCellEditing(target)
      }
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (!isCellEditable(target)) clearCellContent(target)
    }
  })


  $headerRowTop.addEventListener('click', (event) => {
    const target = event.target
    if (target?.classList.contains('resizer')) {
      startResizing(event, {modified: 'columns'})
    }
  })
  $headerRowLeft.addEventListener('click', (event) => {
    const target = event.target
    if (target?.classList.contains('resizer')) {
      startResizing(event, {modified: 'rows'})
    }
  })
}
