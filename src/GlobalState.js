const globalState = {
  currentEditableCell: null,
  currentActiveCell: null,
  isSelectingNow: false,
}

export const getCurrentEditableCell = () => globalState.currentEditableCell
export const setCurrentEditableCell = (cell) =>
  (globalState.currentEditableCell = cell)

export const getCurrentActiveCell = () => globalState.currentActiveCell
export const setCurrentActiveCell = (cell) =>
  (globalState.currentActiveCell = cell)

export const isSelectingNow = () => globalState.isSelectingNow
export const setIsSelectingNow = (value) => (globalState.isSelectingNow = value)
