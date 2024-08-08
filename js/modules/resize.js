let currentResizer
let modifying
let startX, startY, startWidth, startHeight

export const startResizing = (event, {modified= 'columns'}) => {
  currentResizer = event.target
  modifying = modified

  // Guardar el tamaño y la posición inicial
  startX = event.clientX
  startY = event.clientY
  startWidth = parseFloat(getComputedStyle(currentResizer.parentNode).width)
  startHeight = parseFloat(getComputedStyle(currentResizer.parentNode).height)

  // Agregar eventos para mover y terminar el redimensionamiento
  currentResizer.addEventListener('mousemove', resize)
  currentResizer.addEventListener('mouseup', stopResizing)
}

const resize = (event) => {
  if (!currentResizer) return

  // Calcular el nuevo tamaño basado en el movimiento del mouse
  const newWidth = startWidth + (event.clientX - startX)
  const newHeight = startHeight + (event.clientY - startY)

  // Aplicar el nuevo tamaño

  if (modifying === 'columns') {
    currentResizer.parentNode.style.width = `${newWidth}px`
    updateGridTemplateColumns()
  } else {
    currentResizer.parentNode.style.height = `${newHeight}px`
    updateGridTemplateColumns(('rows'))
  }
}

const stopResizing = () => {
  currentResizer.removeEventListener('mousemove', resize)
  currentResizer.removeEventListener('mouseup', stopResizing)
}

// Define the function to update grid-template-columns
const updateGridTemplateColumns = () => {
  const headerCells = currentResizer
    .closest('.header-row')
    .querySelectorAll('.header-cell')

  const gridSizes = Array.from(headerCells).map((headerCell) => {
    if (modifying === 'columns') {
      return headerCell.getBoundingClientRect().width + 'px'
    }

    return headerCell.getBoundingClientRect().height + 'px'
  })

  const nameProperty =
    modifying === 'columns' ? '--grid-columns' : '--grid-rows'
  // 4. Actualizar el grid-template-columns en el contenedor de la cuadrícula
  currentResizer
    .closest('.sheet-container')
    .style.setProperty(nameProperty, gridSizes.join(' '))
}

const updateGridTemplateRows = () => {}
