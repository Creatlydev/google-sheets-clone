let currentResizer
let modifying
let startX, startY, startWidth, startHeight

let sizeColumns = []
let sizeRows = []

// Inicializa el tamaño de las columnas y filas cuando se carga el contenido de la página
window.addEventListener('DOMContentLoaded', () => {
  // Selecciona todas las celdas de encabezado
  let $headerCells = document.querySelectorAll('.header-cell')
  $headerCells.forEach((headerCell) => {
    let identifier = headerCell.getAttribute('aria-label')
    if (isNaN(identifier)) {
      // Guarda el ancho de las columnas en el array sizeColumns
      sizeColumns.push(headerCell.getBoundingClientRect().width + 'px')
    } else {
      // Guarda la altura de las filas en el array sizeRows
      sizeRows.push(headerCell.getBoundingClientRect().height + 'px')
    }
  })
})

// Inicia el proceso de redimensionamiento
export const startResizing = (event, { modified = 'columns' }) => {
  currentResizer = event.target
  modifying = modified

  // Guarda las dimensiones y posición iniciales del elemento que se está redimensionando
  startX = event.clientX
  startY = event.clientY
  startWidth = parseFloat(getComputedStyle(currentResizer.parentNode).width)
  startHeight = parseFloat(getComputedStyle(currentResizer.parentNode).height)
  currentResizer.classList.add('resizer-hover')

  // Agrega eventos para mover y detener el redimensionamiento
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResizing)
}

// Redimensiona la columna o fila en función del movimiento del ratón
const resize = (event) => {
  if (!currentResizer) return

  // Calcula el nuevo tamaño basado en el movimiento del mouse
  let newWidth = startWidth + (event.clientX - startX)
  let newHeight = startHeight + (event.clientY - startY)
  if (newWidth < 12) newWidth = 12 // Establece un ancho mínimo
  else if (newHeight < 12) newHeight = 12 // Establece una altura mínima

  if (modifying === 'columns') {
    // Aplica el nuevo ancho a la columna y actualiza el grid
    currentResizer.parentNode.style.width = `${newWidth}px`
  } else {
    // Aplica la nueva altura a la fila y actualiza el grid
    currentResizer.parentNode.style.height = `${newHeight}px`
  }
  updateGridTemplate()
}

// Detiene el proceso de redimensionamiento y limpia los eventos
const stopResizing = () => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResizing)

  currentResizer.classList.remove('resizer-hover')
  currentResizer = null
}

// Actualiza el estilo grid-template-columns o grid-template-rows
const updateGridTemplate = () => {
  let gridSizes

  if (modifying === 'columns') {
    // Actualiza el tamaño de las columnas
    sizeColumns[currentResizer.getAttribute('order')] =
      currentResizer.parentNode.style.width
    gridSizes = sizeColumns
  } else {
    // Actualiza el tamaño de las filas
    sizeRows[currentResizer.getAttribute('order')] =
      currentResizer.parentNode.style.height
    gridSizes = sizeRows
  }

  const nameProperty =
    modifying === 'columns' ? '--grid-columns' : '--grid-rows'
  // Actualiza el grid-template-columns o grid-template-rows en el contenedor de la cuadrícula
  currentResizer
    .closest('.sheet-container')
    .style.setProperty(nameProperty, gridSizes.join(' '))
}
