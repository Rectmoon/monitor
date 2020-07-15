import { filterTime, loadReady } from './utils'

export default {
  collector () {
    const {
      timing: {
        redirectEnd,
        redirectStart,
        domainLookupEnd,
        domainLookupStart,
        connectEnd,
        connectStart,
        navigationStart,

        requestStart,
        responseStart,
        responseEnd,

        loadEventStart,
        loadEventEnd,
        domLoading,
        domComplete,
        domContentLoadedEventStart,
        domInteractive
      }
    } = window.performance

    return {
      // 网络建连
      redirect: filterTime(redirectEnd, redirectStart), // 页面重定向时间
      dns: filterTime(domainLookupEnd, domainLookupStart), // DNS查找时间
      connect: filterTime(connectEnd, connectStart), // TCP建连时间
      network: filterTime(connectEnd, navigationStart), // 网络总耗时

      // 网络接收
      send: filterTime(responseStart, requestStart), // 前端从发送到接收到后端第一个返回
      receive: filterTime(responseEnd, responseStart), // 接受页面时间
      request: filterTime(responseEnd, requestStart), // 请求页面总时间

      // 前端渲染
      dom: filterTime(domComplete, domLoading), // dom解析时间
      loadEvent: filterTime(loadEventEnd, loadEventStart), // loadEvent时间
      frontend: filterTime(loadEventEnd, domLoading), // 前端总时间

      // 关键阶段
      load: filterTime(loadEventEnd, navigationStart), // 页面完全加载总时间
      domReady: filterTime(domContentLoadedEventStart, navigationStart), // domready时间
      interactive: filterTime(domInteractive, navigationStart), // 可操作时间
      ttfb: filterTime(responseStart, navigationStart) // 首字节时间
    }
  },

  ready (cb) {
    const checkFunc = () => {
      const timer = setTimeout(checkFunc, 100)
      try {
        if (performance.timing.loadEventEnd > 0) {
          clearTimeout(timer)
          cb && cb(this.collector())
        }
      } catch (e) {
        clearTimeout(timer)
        console.log('performance is not supported')
      }
    }

    loadReady(checkFunc)
  }
}
