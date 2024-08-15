export function delegateEvent(container, eventType, selector, handler) {
  container.addEventListener(eventType, function (event) {
    const targetElement = event.target.closest(selector)
    if (targetElement && container.contains(targetElement)) {
      handler.call(targetElement, event)
    }
  })
}
