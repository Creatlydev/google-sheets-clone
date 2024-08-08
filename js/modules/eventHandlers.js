// eventHandlers.js
import {
  enableCellEditing,
  isCellEditable,
  clearCellContent,
  highlightInputCell
} from './cellActions.js'
import { $ } from './domUtils.js'

export const initializeEventHandlers = () => {
  const $bodySheet = $('.body-sheet')

  $bodySheet.addEventListener('click', (event) => {
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
}
