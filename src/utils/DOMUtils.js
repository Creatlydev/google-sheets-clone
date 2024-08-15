export const $ = (el) => document.querySelector(el)
export const $$ = (el) => document.querySelectorAll(el)

// Crear un elemento HTML
export function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag)
  Object.keys(attributes).forEach((key) => {
    setAttribute(element, key, attributes[key])
  })

  element.innerHTML = content
  return element
}

// Insertar multiples elementos
export function appendElements(parent, ...elements) {
  const fragment = document.createDocumentFragment()
  elements.forEach((el) => fragment.appendChild(el))
  parent.appendChild(fragment)
}

// Establecer estilos css
export function setStyles(element, styles = {}) {
  Object.keys(styles).forEach((key) => {
    element.style[key] = styles[key]
  })
}

// Obtener estilos de elemento
export function getStyle(element, styleName, inline) {
  if (inline) return element.style[styleName]
  return getComputedStyle(element)[styleName]
}

// Obtener valor de un atributo
export function getAttribute(element, attributeName) {
  return element.getAttribute(attributeName)
}

// Establecer atributo
export function setAttribute(element, attributeName, value) {
  element.setAttribute(attributeName, value)
}

// Verficar existencia de elemento
export function existsElement(className) {
  return document.querySelector(className)
}

// =======================================================================
// Manipulacion de clases
export function addClass(className, ...elements) {
  elements.forEach((element) => element.classList.add(className))
}

export function removeClass(className, ...elements) {
  elements.forEach((element) => element.classList.remove(className))
}

export function hasClass(element, className) {
  return element.classList.contains(className)
}
