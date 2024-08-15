import createInitialGrid from './components/grid/Grid.js'
import {initGridExpansionObservers} from './components/grid/GridExpansion.js'

window.addEventListener('DOMContentLoaded', () => {
    createInitialGrid()
    initGridExpansionObservers()
})
