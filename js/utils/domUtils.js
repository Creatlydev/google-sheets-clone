// domUtils.js
export const $ = (el, all = false) =>
  all ? document.querySelectorAll(el) : document.querySelector(el)