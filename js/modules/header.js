// header.js
import { $ } from './domUtils.js'

export const numberToColumn = (n) => {
  let column = ''
  while (n >= 0) {
    column = String.fromCharCode((n % 26) + 65) + column
    n = Math.floor(n / 26) - 1
  }
  return column
}

export const createHeaderRow = (cols, rows, position = 'top') => {
  const $headerRowTop = $('.header-row--top')
  const $headerRowLeft = $('.header-row--left')

  for (let i = 0; i < cols; i++) {
    const headerCell = document.createElement('div')
    headerCell.classList.add('header-cell')
    let content = position === 'top' ? numberToColumn(i) : i + 1
    headerCell.setAttribute('aria-label', content)
    headerCell.textContent = content

    position === 'top'
      ? $headerRowTop.appendChild(headerCell)
      : $headerRowLeft.appendChild(headerCell)
  }
}

export const highlighHeaderCell = ({ target }) => {
  const row = target.getAttribute('label-header-row')
  const col = target.getAttribute('label-header-col')

  $('.header-row--top > .header-cell.is-highlight')?.classList.remove(
    'is-highlight'
  )
  $('.header-row--left > .header-cell.is-highlight')?.classList.remove(
    'is-highlight'
  )

  const $colHeader = $(`.header-cell[aria-label='${col}']`)
  const $rowHeader = $(`.header-cell[aria-label='${row}']`)
  $colHeader.classList.add('is-highlight')
  $rowHeader.classList.add('is-highlight')
}
