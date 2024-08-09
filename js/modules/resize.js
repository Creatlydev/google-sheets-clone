let currentResizer
let modifying
let startX, startY, startWidth, startHeight

// =================================================================================================
let sizeColumns = []
let sizeRows = []

window.addEventListener('DOMContentLoaded', () => {
  let $headerCells = document.querySelectorAll('.header-cell')
  $headerCells.forEach((headerCell) => {
    let identifier = headerCell.getAttribute('aria-label')
    if (isNaN(identifier)) {
      sizeColumns.push(headerCell.getBoundingClientRect().width + 'px')
    } else {
      sizeRows.push(headerCell.getBoundingClientRect().height + 'px')
    }
  })
})
// =================================================================================================

export const startResizing = (event, { modified = 'columns' }) => {
  currentResizer = event.target
  modifying = modified

  // Guardar el tamaño y la posición inicial
  startX = event.clientX
  startY = event.clientY
  startWidth = parseFloat(getComputedStyle(currentResizer.parentNode).width)
  startHeight = parseFloat(getComputedStyle(currentResizer.parentNode).height)
  currentResizer.classList.add('resizer-hover')

  // Agregar eventos para mover y terminar el redimensionamiento
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResizing)
}

const resize = (event) => {
  if (!currentResizer) return

  // Calcular el nuevo tamaño basado en el movimiento del mouse
  let newWidth = startWidth + (event.clientX - startX)
  let newHeight = startHeight + (event.clientY - startY)
  if (newWidth < 12) newWidth = 12
  else if (newHeight < 12) newHeight = 12

  if (modifying === 'columns') {
    currentResizer.parentNode.style.width = `${newWidth}px`
    updateGridTemplateColumns()
  } else {
    currentResizer.parentNode.style.height = `${newHeight}px`
    updateGridTemplateColumns('rows')
  }
}

const stopResizing = () => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResizing)

  currentResizer.classList.remove('resizer-hover')
  currentResizer = null
}

// Define the function to update grid-template-columns
const updateGridTemplateColumns = () => {
  let gridSizes

  if (modifying === 'columns') {
    sizeColumns[currentResizer.getAttribute('order')] =
      currentResizer.parentNode.style.width
    gridSizes = sizeColumns
  } else {
    sizeRows[currentResizer.getAttribute('order')] =
      currentResizer.parentNode.style.height
    gridSizes = sizeRows
  }

  const nameProperty =
    modifying === 'columns' ? '--grid-columns' : '--grid-rows'
  // 4. Actualizar el grid-template-columns en el contenedor de la cuadrícula
  currentResizer
    .closest('.sheet-container')
    .style.setProperty(nameProperty, gridSizes.join(' '))
}
