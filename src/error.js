const formatInstanceError = errObj => {
  let line = errObj.line || errObj.lineNumber
  let column = errObj.column || errObj.columnNumber
  let message = errObj.message
  let name = errObj.name
  let stackLine = ''
  let stackColumn = ''
  let resourceUrl = ''

  let { stack } = errObj
  if (stack) {
    let matchUrl = stack.match(/https?:\/\/[^\n]+/)
    let urlFirstStack = matchUrl ? matchUrl[0] : ''
    let regUrlCheck = /(https?:\/\/(\S)*(\.js)?)\/:\d+:\d+/

    if (regUrlCheck.test(urlFirstStack)) {
      resourceUrl = urlFirstStack.match(regUrlCheck)[1]
    }

    let posStack = urlFirstStack.match(/:(\d+):(\d+)/)
    if (posStack && posStack.length >= 3) {
      ;[, stackLine, stackColumn] = posStack
    }
  }

  return {
    name,
    message,
    stack,
    source: resourceUrl,
    lineno: Number(line || stackLine),
    colno: Number(column || stackColumn),
    stack: errObj.stack
  }
}

const formatRuntimeJsError = allMsg => {
  const [
    message, // 错误信息（字符串）。可用于HTML onerror=""处理程序中的event
    source, // 发生错误的脚本URL（字符串）
    lineno, // 发生错误的行号（数字）
    colno, // 发生错误的列号（数字）
    errObj // Error对象（对象）
  ] = allMsg

  return {
    t: new Date().getTime(),
    n: 'onError',
    msg: message,
    data: {
      message,
      source,
      lineno,
      colno: colno || (window.event && window.event.errorCharacter) || 0,
      stack: errObj.stack
    }
  }
}

const formatResourceError = e => ({
  t: new Date().getTime(),
  n: 'resourceError',
  msg: e.target.localName + ' is load error',
  data: {
    target: e.target.localName,
    type: e.type,
    resourceUrl: e.target.href || e.target.currentSrc
  }
})

const formatNoRejectHandlerError = e => {
  const message = e && e.reason
  return {
    t: new Date().getTime(),
    n: 'promiseError',
    msg: message,
    data: e
  }
}

const formatConsoleError = info => {
  const errorInfo = info instanceof Error ? formatInstanceError(info) : info
  return {
    t: new Date().getTime(),
    n: 'consoleError',
    msg: errorInfo.message || errorInfo,
    data: errorInfo
  }
}

export default {
  ready (cb) {
    //=======================================================================================================
    // javascript
    //=======================================================================================================
    window.onerror = (origin => (...args) => {
      const errorInfo = formatRuntimeJsError(args)
      console.log(errorInfo)
      cb && cb(errorInfo)
      origin && origin.apply(window, args)
    })(window.onerror)
    //=======================================================================================================
    // img,script,css,jsonp
    //=======================================================================================================
    window.addEventListener(
      'error',
      e => {
        if (e.target == window) return
        const errorInfo = formatResourceError(e)
        cb && cb(errorInfo)
      },
      true
    )
    //=======================================================================================================
    // unhandledrejection
    //=======================================================================================================
    window.addEventListener('unhandledrejection', e => {
      cb && cb(formatNoRejectHandlerError(e))
    })
    //=======================================================================================================
    // consle.error
    //=======================================================================================================
    console.error = (origin => info => {
      const errorInfo = formatConsoleError(info)
      cb && cb(errorInfo)
      origin.call(console, info)
    })(console.error)
  }
}
