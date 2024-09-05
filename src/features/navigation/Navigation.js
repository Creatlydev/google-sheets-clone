import { $, removeClass } from '../../utils/DOMUtils.js'
import {
  getCurrentActiveCell,
  setCurrentActiveCell,
  isSelectingNow,
} from '../../GlobalState.js'
import {
  enableEditingCell,
  highlightInputCell,
  isEditableCell,
} from '../../components/grid/CellInteractions.js'

class Navigation {
  constructor() {
    this.grid = $('.js-spreadsheet')
    this.init()
  }

  init() {
    this.grid.addEventListener('keydown', (e) => this.handleKeydown(e))
  }

  handleKeydown(event) {
    const { key } = event
    const currentActiveCell = getCurrentActiveCell()
    const switchKey = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      Tab: event.shiftKey,
      Enter: event.shiftKey,
    }
    if (['Tab', 'Enter'].includes(key)) {
      event.preventDefault()
      if (key === 'Tab') {
        Navigation.moveToCell(
          ...switchKey[switchKey['Tab'] ? 'ArrowLeft' : 'ArrowRight'],
          this.grid
        )
      } else {
        if (isEditableCell(currentActiveCell) || switchKey['Enter']) {
          Navigation.moveToCell(
            ...switchKey[switchKey['Enter'] ? 'ArrowUp' : 'ArrowDown'],
            this.grid
          )
        } else {
          enableEditingCell(currentActiveCell)
        }
      }
    } else {
      if (switchKey[key]) {
        if (!isEditableCell(currentActiveCell)) {
          event.preventDefault()
          Navigation.moveToCell(...switchKey[key], this.grid)
        }
      }
    }
  }

  static moveToCell(rowOffset, colOffset, grid) {
    const currentActiveCell = getCurrentActiveCell()
    if (!currentActiveCell) return

    const currentRow = currentActiveCell.dataset.row
    const currentCol = currentActiveCell.dataset.col

    const newRow = parseInt(currentRow) + rowOffset
    const newCol = parseInt(currentCol) + colOffset

    const newCell = grid.querySelector(
      `[data-row='${newRow}'][data-col='${newCol}']`
    )
    removeClass('is-active', currentActiveCell)
    if (newCell) {
      newCell.focus()
      highlightInputCell(newCell)
    }
  }
}

export default Navigation
