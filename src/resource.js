import { filterTime, loadReady } from './utils'

export default {
  ready (cb) {
    const wrapperFunc = () => {
      try {
        const performance =
          window.performance ||
          window.mozPerformance ||
          window.msPerformance ||
          window.webkitPerformance

        const data = performance.getEntriesByType('resource').map(entry => ({
          initiatorType: entry.initiatorType,
          name: entry.name,
          nextHopProtocol: entry.nextHopProtocol,
          duration: parseInt(entry.duration),
          encodedBodySize: parseInt(entry.encodedBodySize),
          decodedBodySize: parseInt(entry.decodedBodySize),

          redirect: filterTime(entry.redirectEnd, entry.redirectStart), // 重定向
          dns: filterTime(entry.domainLookupEnd, entry.domainLookupStart), // DNS解析
          connect: filterTime(entry.connectEnd, entry.connectStart), // TCP建连
          network: filterTime(entry.connectEnd, entry.startTime), // 网络总耗时

          send: filterTime(entry.responseStart, entry.requestStart), // 发送开始到接受第一个返回, 首字节时间
          receive: filterTime(entry.responseEnd, entry.responseStart), // 接收总时间
          request: filterTime(entry.responseEnd, entry.requestStart) // 总时间
        }))

        cb && cb(data)
      } catch (e) {
        console.log('performance is not supported')
      }
    }

    loadReady(wrapperFunc)
  }
}
