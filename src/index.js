import createInitialGrid from './components/grid/Grid.js'
import { initGridExpansionObserver } from './components/grid/GridExpansion.js'
import { initGridEventListeners } from './components/grid/GridEvents.js'
import { handleGlobalEvents } from './GlobalEvents.js'
import Navigation from './features/navigation/Navigation.js'
import Selection from './features/selection/Selection.js'
import { setInstanceSelection } from './GlobalState.js'

window.addEventListener('DOMContentLoaded', () => {
  createInitialGrid()
  initGridExpansionObserver()
  handleGlobalEvents()
  initGridEventListeners()
  new Navigation() // Navegacion por las celdas
  const instanceSelection = new Selection() 
  setInstanceSelection(instanceSelection)
})
