// eventHandlers.js
import {
  makeCellEditable,
  isEditable,
  clearCellContent,
  highlightCellInput
} from './cellActions.js'
import { $ } from './domUtils.js'
import { highlighHeaderCell } from './header.js'

export const initializeEventHandlers = () => {
  const $bodySheet = $('.body-sheet')

  $bodySheet.addEventListener('click', (event) => {
    const target = event.target
    highlighHeaderCell({ target })
    highlightCellInput(target)
  })

  $bodySheet.addEventListener('dblclick', (event) => {
    const target = event.target
    if (target.getAttribute('role') === 'input') {
      makeCellEditable(target)
    }
  })

  $bodySheet.addEventListener('keydown', (event) => {
    const target = event.target
    if (event.key === 'Enter') {
      event.preventDefault()
      if (isEditable(target)) {
        // Lógica para cuando la celda sea editable y se presione Enter otra vez
      } else {
        makeCellEditable(target)
      }
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (!isEditable(target)) clearCellContent(target)
    }
  })
}
