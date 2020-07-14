import { filterTime, loadReady } from './utils'

export default {
  collector () {
    if (!window.performance) return {}

    const timing = window.performance.timing
    // https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming
    return {
      // 网络建连
      redirect: filterTime(timing.redirectEnd, timing.redirectStart), // 页面重定向时间
      dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS查找时间
      connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连时间
      network: filterTime(timing.connectEnd, timing.navigationStart), // 网络总耗时

      // 网络接收
      send: filterTime(timing.responseStart, timing.requestStart), // 前端从发送到接收到后端第一个返回
      receive: filterTime(timing.responseEnd, timing.responseStart), // 接受页面时间
      request: filterTime(timing.responseEnd, timing.requestStart), // 请求页面总时间

      // 前端渲染
      dom: filterTime(timing.domComplete, timing.domLoading), // dom解析时间
      loadEvent: filterTime(timing.loadEventEnd, timing.loadEventStart), // loadEvent时间
      frontend: filterTime(timing.loadEventEnd, timing.domLoading), // 前端总时间

      // 关键阶段
      load: filterTime(timing.loadEventEnd, timing.navigationStart), // 页面完全加载总时间
      domReady: filterTime(
        timing.domContentLoadedEventStart,
        timing.navigationStart
      ), // domready时间
      interactive: filterTime(timing.domInteractive, timing.navigationStart), // 可操作时间
      ttfb: filterTime(timing.responseStart, timing.navigationStart) // 首字节时间
    }
  },

  ready (cb) {
    loadReady(() => {
      const data = this.collector()
      cb && cb(data)
    })
  }
}
