const globalState = {
  currentEditableCell: null,
  currentActiveCell: null,
}

export const getCurrentEditableCell = () => globalState.currentEditableCell
export const setCurrentEditableCell = (cell) =>
  (globalState.currentEditableCell = cell)

export const getCurrentActiveCell = () => globalState.currentActiveCell
export const setCurrentActiveCell = (cell) =>
  (globalState.currentActiveCell = cell)
