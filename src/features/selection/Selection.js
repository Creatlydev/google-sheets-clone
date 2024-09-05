import { HEADER_CLASSES } from '../../constants.js'
import {
  $,
  $$,
  addClass,
  createElement,
  getAttribute,
  removeClass,
  setStyles
} from '../../utils/DOMUtils.js'
import { highlightInputCell } from '../../components/grid/CellInteractions.js'
import { isSelectingNow, setIsSelectingNow } from '../../GlobalState.js'
import { emit } from '../../utils/EventUtils.js'

export default class Selection {
  constructor() {
    this.body = document.body
    this.grid = $('#grid-container')
    this.coping = null
    this.spreadsheet = this.grid.querySelector('.js-spreadsheet')
    this.selectedBox = null
    this.idColumnSelected = null
    this.idRowSelected = null
    this.headSelected = null
    this.init()
  }

  init() {
    this.grid.addEventListener('mousedown', (event) =>
      this.handleMouseDown(event)
    )
    this.body.addEventListener('copy', () => {
      emit('copy-cells', {
        toCopy: this.coping,
        idsSelected: { row: this.idRowSelected, column: this.idColumnSelected }
      })
    })
  }

  handleMouseDown(event) {
    const target = event.target.closest(`.${HEADER_CLASSES.HEAD_CELL}`)
    if (target) {
      this.headSelected = target
      this.createSelectedBox()
      const box = target.getBoundingClientRect()
      let $cellInput
      const horizontalHead = target.closest('.horizontal-head')
      if (horizontalHead) {
        $cellInput = this.selectedColumn()
      } else {
        $cellInput = this.selectedRow()
      }

      highlightInputCell($cellInput)
      setIsSelectingNow(true)
    } else {
      const selectedBox = $('.selected-box')
      if (isSelectingNow()) {
        document.body.removeChild(selectedBox)
        this.removeSelectedClass()
        setIsSelectingNow(false)
        this.idColumnSelected = null
        this.idRowSelected = null
        this.coping = null
      }
    }
  }

  selectedColumn() {
    const box = this.headSelected.getBoundingClientRect()
    const headCell = this.headSelected
    const scrollLeft = this.grid.scrollLeft
    setStyles(this.selectedBox, {
      left: `${box.left + scrollLeft}px`,
      top: `${box.bottom}px`,
      width: `${box.right - box.left}px`,
      height: `${this.spreadsheet.clientHeight}px`
    })
    this.addSelectedClass(headCell)

    // Highlight cell in column selected
    const columnSelected = getAttribute(headCell, 'index')
    const $cellInput = $(
      `.cell-input[data-row='0'][data-col='${columnSelected}']`
    )
    this.coping = 'column'
    this.idColumnSelected =  columnSelected
    return $cellInput
  }

  selectedRow() {
    const box = this.headSelected.getBoundingClientRect()
    const headCell = this.headSelected
    const scrollTop = this.grid.scrollTop
    setStyles(this.selectedBox, {
      left: `${box.right}px`,
      top: `${box.top + scrollTop}px`,
      width: `${this.spreadsheet.clientWidth}px`,
      height: `${box.bottom - box.top}px`
    })
    this.addSelectedClass(headCell)

    // Highlight cell in row selected
    const rowSelected = getAttribute(headCell, 'index')
    const $cellInput = $(`.cell-input[data-row='${rowSelected}'][data-col='0']`)
    this.coping = 'row'
    this.idRowSelected = rowSelected
    return $cellInput
  }

  createSelectedBox() {
    if (!$('.selected-box')) {
      this.selectedBox = createElement('div', { class: 'selected-box' })
      document.body.appendChild(this.selectedBox)
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
