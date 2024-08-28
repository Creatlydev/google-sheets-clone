import {
  getCurrentActiveCell,
  setCurrentActiveCell,
} from '../../GlobalState.js'
import { $, setStyles } from '../../utils/DOMUtils.js'
import {
  clearContentCell,
  disableCellEditing,
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
    if (event.key === 'Delete' || event.key === 'Backspace') {
      // Limpia el contenido de la celda si no es editable
      if (!isEditableCell($cellInput)) {
        clearContentCell($cellInput)
      }
    }
  })

  // Maneja el evento keypress en la hoja de cálculo
  $spreadSheet.addEventListener('keypress', (event) => {
    const $cellInput = event.target.closest('.cell-input')
    if (!$cellInput) return
    if (!isEditableCell($cellInput)) {
      enableEditingCell($cellInput)
    }
  })

  //   DOUBLE-CLICK
  $spreadSheet.addEventListener('dblclick', (event) => {
    const $cellInput = event.target.closest('.cell-input')
    if (!$cellInput) return
    !isEditableCell($cellInput) && enableEditingCell($cellInput)
  })

  $spreadSheet.addEventListener('focusout', (event) => {
    const target = event.relatedTarget

    if (!target) {
      const $cellInput = event.target.closest('.cell-input')
      if (isEditableCell($cellInput)) {
        disableCellEditing($cellInput, { force: true })
      }
    }

    // ======
    $spreadSheet.addEventListener(
      'focusin',
      (event) => {
        const $cellInput = event.target.closest('.cell-input')
        if (!$cellInput) return
        highlightInputCell($cellInput)
      },
      { once: true }
    )
  })
}
