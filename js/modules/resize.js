let currentResizer
let startX, startY, startWidth, startHeight

export const startResizing = (event) => {
  currentResizer = event.target

  // Guardar el tamaño y la posición inicial
  startX = event.clientX
  startY = event.clientY
  startWidth = parseFloat(getComputedStyle(currentResizer.parentNode).width)
  startHeight = parseFloat(getComputedStyle(currentResizer.parentNode).height)
  console.log(startWidth)
  console.log(startHeight)

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
  if (currentResizer.parentNode.classList.contains('header-cell')) {
    currentResizer.parentNode.style.width = `${newWidth}px`
  } else {
    currentResizer.parentNode.style.height = `${newHeight}px`
  }

  updateGridTemplateColumns()
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

  const columnSizes = Array.from(headerCells).map((headerCell) => {
    return headerCell.getBoundingClientRect().width + 'px'
  })

  // 4. Actualizar el grid-template-columns en el contenedor de la cuadrícula
  currentResizer.closest('.sheet-container').style.setProperty('--grid-columns', columnSizes.join(' '))
}
