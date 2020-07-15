export const getUniqueId = len =>
  Number(
    Math.random()
      .toString()
      .substring(3, len + 3) + Date.now()
  ).toString(36)

export const filterTime = (t1, t2) =>
  t1 > 0 && t2 > 0 && t1 - t2 >= 0 ? t1 - t2 : undefined

export const loadReady = cb => {
  if (document.readyState === 'complete') {
    cb && cb()
    return void 0
  }

  window.addEventListener('load', () => {
    cb && cb()
  })
}
