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
    
    wrappedBox = document.createElement('div')
    wrappedBox.classList.add('wrapped-cells')

    document.addEventListener('mousemove', selectingCells)
    document.addEventListener('mouseup', finishSelectingCells)

}

export const selectingCells = (event) => {
    document.body.style.userSelect= 'none'

    if (!isSelecting) return
    document.body.appendChild(wrappedBox)

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
    document.body.style.userSelect= 'unset'
    isSelecting = false
    document.removeEventListener('mousemove', selectingCells)
    document.removeEventListener('mouseup', finishSelectingCells)
}