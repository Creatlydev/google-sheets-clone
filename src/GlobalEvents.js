export const handleGlobalEvents = () => {
  const $body = document.body

  $body.addEventListener('contextmenu', (event) => event.preventDefault())
}
