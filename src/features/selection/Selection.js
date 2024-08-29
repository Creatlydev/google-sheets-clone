import { HEADER_CLASSES } from '../../constants.js'
import {
  $,
  $$,
  addClass,
  createElement,
  getAttribute,
  removeClass,
  setStyles,
} from '../../utils/DOMUtils.js'
import { highlightInputCell } from '../../components/grid/CellInteractions.js'
import { isSelectingNow, setIsSelectingNow } from '../../GlobalState.js'

export default class Selection {
  constructor() {
    this.grid = $('#grid-container')
    this.spreadsheet = this.grid.querySelector('.js-spreadsheet')
    this.selectedBox = null
    this.init()
  }

  init() {
    this.grid.addEventListener('mousedown', (event) =>
      this.handleMouseDown(event)
    )
  }

  handleMouseDown(event) {
    const target = event.target.closest(`.${HEADER_CLASSES.HEAD_CELL}`)
    if (target) {
      this.createSelectedBox()
      const box = target.getBoundingClientRect()
      let $cellInput
      const horizontalHead = target.closest('.horizontal-head')
      if (horizontalHead) {
        $cellInput = this.selectedColumn(box, target)
      } else {
        $cellInput = this.selectedRow(box, target)
      }

      highlightInputCell($cellInput)
      setIsSelectingNow(true)
    } else {
      const selectedBox = $('.selected-box')
      if (isSelectingNow()) {
        this.grid.removeChild(selectedBox)
        this.removeSelectedClass()
        setIsSelectingNow(false)
      }
    }
  }

  selectedColumn(box, headCell) {
    setStyles(this.selectedBox, {
      left: `${box.left}px`,
      top: `${box.bottom}px`,
      width: `${box.right - box.left}px`,
      height: `${this.spreadsheet.clientHeight}px`,
    })
    this.addSelectedClass(headCell)

    // Highlight cell in column selected
    const columnSelected = getAttribute(headCell, 'index')
    const $cellInput = $(
      `.cell-input[data-row='0'][data-col='${columnSelected}']`
    )
    return $cellInput
  }

  selectedRow(box, headCell) {
    setStyles(this.selectedBox, {
      left: `${box.right}px`,
      top: `${box.top}px`,
      width: `${this.spreadsheet.clientWidth}px`,
      height: `${box.bottom - box.top}px`,
    })
    this.addSelectedClass(headCell)

    // Highlight cell in row selected
    const rowSelected = getAttribute(headCell, 'index')
    const $cellInput = $(`.cell-input[data-row='${rowSelected}'][data-col='0']`)
    return $cellInput
  }

  createSelectedBox() {
    if (!$('.selected-box')) {
      this.selectedBox = createElement('div', { class: 'selected-box' })
      this.grid.appendChild(this.selectedBox)
    }
  }

  addSelectedClass(headCell) {
    this.removeSelectedClass()
    addClass(HEADER_CLASSES.SELECTED, headCell)
  }

  removeSelectedClass() {
    removeClass(
      HEADER_CLASSES.SELECTED,
      ...Array.from(
        $$(`.${HEADER_CLASSES.HEAD_CELL}.${HEADER_CLASSES.SELECTED}`)
      )
    )
  }
}
