export function delegateEvent(container, eventType, selector, handler) {
  container.addEventListener(eventType, function (event) {
    const targetElement = event.target.closest(selector)
    if (targetElement && container.contains(targetElement)) {
      handler.call(targetElement, event)
    }
  })
}


export function emit(event, obj) {
    const customEvent = new Event(event);
    customEvent.detail = obj;
    document.body.dispatchEvent(customEvent);
}