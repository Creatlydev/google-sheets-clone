import { $ } from '../utils/domUtils.js'

// Convierte un número en la correspondiente letra de columna (A, B, C, ..., Z, AA, AB, ...)
export const numberToColumn = (n) => {
  let column = ''
  while (n >= 0) {
    // Convierte el número en una letra (A-Z)
    column = String.fromCharCode((n % 26) + 65) + column
    // Reduce el número para obtener la siguiente letra
    n = Math.floor(n / 26) - 1
  }
  return column
}

// Crea una fila de encabezado para columnas o filas
export const createHeaderRow = (range, position = 'top') => {
  // Selecciona los elementos del DOM para las filas de encabezado
  const $headerRowTop = $('.header-row--top')
  const $headerRowLeft = $('.header-row--left')

  for (let i = 0; i < range; i++) {
    // Crea una nueva celda de encabezado
    const headerCell = document.createElement('div')
    headerCell.classList.add('header-cell')
    // Determina el contenido basado en la posición (arriba o izquierda)
    const content = position === 'top' ? numberToColumn(i) : i + 1
    headerCell.setAttribute('aria-label', content)
    headerCell.textContent = content

    // Agrega la celda al encabezado correspondiente
    position === 'top'
      ? $headerRowTop.appendChild(headerCell)
      : $headerRowLeft.appendChild(headerCell)

    // Crea un resizer para permitir el redimensionamiento
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

  // Elimina el resaltado de los encabezados anteriores
  $('.header-row--top > .header-cell.is-highlight')?.classList.remove(
    'is-highlight'
  )
  $('.header-row--left > .header-cell.is-highlight')?.classList.remove(
    'is-highlight'
  )

  // Resalta el encabezado de la columna y la fila correspondientes
  const $columnHeader = $(`.header-cell[aria-label='${colLabel}']`)
  const $rowHeader = $(`.header-cell[aria-label='${rowLabel}']`)
  $columnHeader.classList.add('is-highlight')
  $rowHeader.classList.add('is-highlight')
}
