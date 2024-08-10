let isSelecting, startCell, currentEvent
let startX, startY, finishX, finishY
let selectedCells = []
let wrappedBox


export const startSelectingCells = (event) => {
    currentEvent = event
    isSelecting = true
    startCell = event.target
    let boxCell = startCell.getBoundingClientRect()
    startX = parseFloat(boxCell.left) + window.scrollX
    startY = parseFloat(boxCell.top) + window.scrollY
    finishX = event.clientX
    finishY = event.clientY
    console.table([
        startX, startY, finishX, finishY
    ])

    console.info('======== EVENT =======')
    console.table([
        event
    ])
    
    console.info('======== SCROLL =======')
    console.table([
        window.scrollX, window.scrollY
    ])
    
    wrappedBox = document.createElement('div')
    wrappedBox.classList.add('wrapped-cells')

    console.log('Ha comenzado ha seleccionar las celdas')
    document.addEventListener('mousemove', selectingCells)
    document.addEventListener('mouseup', finishSelectingCells)

}

export const selectingCells = (event) => {
    if (!isSelecting) return
    document.body.appendChild(wrappedBox)

    console.log('Seleccionando celdas...')
    finishX = event.pageX
    finishY = event.pageY
    let width = finishX - startX
    let height = finishY - startY
    
    wrappedBox.style.top = `${startY}px`
    wrappedBox.style.left = `${startX}px`
    wrappedBox.style.width = `${width}px`
    wrappedBox.style.height = `${height}px`
}

export const finishSelectingCells = () => {
    isSelecting = false
    console.log('Ha terminado de seleccionar las celdas')
    document.removeEventListener('mousemove', selectingCells)
    document.removeEventListener('mouseup', finishSelectingCells)
}