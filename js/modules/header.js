import { $ } from './domUtils.js'

// Convierte un número a la correspondiente letra de columna
export const numberToColumn = (n) => {
  let column = ''
  while (n >= 0) {
    column = String.fromCharCode((n % 26) + 65) + column
    n = Math.floor(n / 26) - 1
  }
  return column
}

// Crea la fila de encabezado para columnas o filas
export const createHeaderRow = (range, position = 'top') => {
  const $headerRowTop = $('.header-row--top')
  const $headerRowLeft = $('.header-row--left')

  for (let i = 0; i < range; i++) {
    const headerCell = document.createElement('div')
    headerCell.classList.add('header-cell')
    const content = position === 'top' ? numberToColumn(i) : i + 1
    headerCell.setAttribute('aria-label', content)
    headerCell.textContent = content

    position === 'top'
      ? $headerRowTop.appendChild(headerCell)
      : $headerRowLeft.appendChild(headerCell)

    const resizer = document.createElement('div')
    resizer.classList.add('resizer')
    resizer.setAttribute('identifier', content)
    resizer.setAttribute('order', i)
    headerCell.appendChild(resizer)
  }
}

// Resalta la celda de encabezado correspondiente a la celda seleccionada
export const highlightHeaderCell = ({ target }) => {
  const rowLabel = target.getAttribute('label-header-row')
  const colLabel = target.getAttribute('label-header-col')

  // Eliminar resaltado de encabezados anteriores
  $('.header-row--top > .header-cell.is-highlight')?.classList.remove(
    'is-highlight'
  )
  $('.header-row--left > .header-cell.is-highlight')?.classList.remove(
    'is-highlight'
  )

  // Resaltar encabezado de columna y fila correspondientes
  const $columnHeader = $(`.header-cell[aria-label='${colLabel}']`)
  const $rowHeader = $(`.header-cell[aria-label='${rowLabel}']`)
  $columnHeader.classList.add('is-highlight')
  $rowHeader.classList.add('is-highlight')
}
