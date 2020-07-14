const getChildIndex = element => {
  const parent = element.parentNode
  const index = Array.prototype.slice
    .call(parent.childNodes)
    .filter(child => child.nodeType === 1)
    .findIndex(child => child === element)

  return index === -1 ? '' : `[${index}]`
}

const getPath = element => {
  if (!element instanceof Element || element.nodeType !== 1) return void 0

  let rootNode = document.body
  if (element === rootNode) return void 0

  let path = ''

  while (element !== document) {
    const tag = element.tagName.toLocaleLowerCase()
    const index = getChildIndex(element)

    path = `/${tag}${index}${path}`
    element = element.parentNode
  }

  return path
}

export default {
  ready (cb) {
    const clickBehaviorHandler = e => {
      const event = e || window.event
      const target = event.target || event.srcElement
      const { tagName, id, className, innerHTML, innerText } = target
      const data = {
        type: 'click',
        path: getPath(target),
        tagName,
        id,
        className,
        innerHTML,
        innerText
      }

      cb && cb(data)
    }
    document.addEventListener('click', clickBehaviorHandler, false)
  }
}
