import { $, setStyles } from '../../utils/DOMUtils.js'
import {
  clearContentCell,
  enableEditingCell,
  highlightInputCell,
  isEditableCell,
} from './CellInteractions.js'

export function initGridEventListeners() {
  const $spreadSheet = $('.js-spreadsheet')

  // MOUSEDOWN EVENT
  $spreadSheet.addEventListener('mousedown', (event) => {
    const $cellInput = event.target.closest('.cell-input')
    if (!$cellInput || event.button !== 0) return

    const $editableCell = $cellInput.querySelector('.value')
    const $computedValue = $cellInput.querySelector('.computed-value')

    highlightInputCell($cellInput)
  })

  // Maneja el evento keydown en la hoja de cálculo
  $spreadSheet.addEventListener('keydown', (event) => {
    const $cellInput = event.target.closest('.cell-input')
    if (!$cellInput) return
    if (event.key === 'Enter') {
      event.preventDefault()
      if (isEditableCell($cellInput)) {
        // Mueve el foco a la celda siguiente si la celda es editable
        // moveFocusVerticallyCell(target, 'down')
      } else {
        // Habilita la edición de la celda si no es editable
        enableEditingCell($cellInput)
      }
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      // Limpia el contenido de la celda si no es editable
      !isEditableCell($cellInput) && clearContentCell($cellInput)
    }
  })

  // Maneja el evento keypress en la hoja de cálculo
  $spreadSheet.addEventListener('keypress', (event) => {
    const $cellInput = event.target.closest('.cell-input')
    if (!$cellInput) return
    !isEditableCell($cellInput) && enableEditingCell($cellInput)
  })

  //   DOUBLE-CLICK
  $spreadSheet.addEventListener('dblclick', (event) => {
    const $cellInput = event.target.closest('.cell-input')
    if (!$cellInput) return
    !isEditableCell($cellInput) && enableEditingCell($cellInput)
  })

  $spreadSheet.addEventListener('focusout', (event) => {
    const target = event.relatedTarget
    if (target) {
      const $cellInput = target.closest('.cell-input')
      if ($cellInput) highlightInputCell($cellInput)
      else {
        // Logica here
      }
    }
  })
}
