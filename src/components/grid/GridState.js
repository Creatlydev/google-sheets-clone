import { times } from '../../utils/Helpers.js'
import {INITIAL_GRID} from '../../constants.js'

export const gridState = {
  cells: [],
  initialize: function () {
    this.cells = times(INITIAL_GRID.VISIBLE_ROWS).map((i) =>
      times(INITIAL_GRID.VISIBLE_COLS).map((j) => ({ computedValue: '', value: '' }))
    )
  },
}
