import { gridState } from './components/grid/GridState.js'
import { getCurrentActiveCell } from './GlobalState.js'
import { times } from './utils/Helpers.js'

export const handleGlobalEvents = () => {
  const $body = document.body

  // evento que impide el comportamiento por defecto cuando el navegador detecta que se quiere arrastrar algun elemento
  $body.addEventListener('dragstart', (event) => {
    event.preventDefault()
  })

  $body.addEventListener('contextmenu', (event) => event.preventDefault())

  // Evento que se emitira cuando se active el evento copy en el body
  $body.addEventListener('copy-cells', (event) => {
    const toCopy = event.detail.toCopy
    const { row, column } = event.detail.idsSelected

    let computedValues

    if (toCopy === 'column') {
      computedValues = gridState.cells.map(
        (_, index) => gridState.cells[index][column].computedValue
      )
      navigator.clipboard.writeText(computedValues.join('\n'))
    } else if (toCopy === 'row') {
      computedValues = gridState.cells[row].map(
        (_, index) => gridState.cells[row][index].computedValue
      )
    } else {
      const currentActiveCell = getCurrentActiveCell()
      if (currentActiveCell) {
        computedValues = [currentActiveCell.querySelector('span').textContent]
      }
    }

    // Copiar valores computados en el portapapapeles
    computedValues && navigator.clipboard.writeText(computedValues.join('\n'))
  })
}
