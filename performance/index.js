/**
 * 性能监控
 */

function getTiming () {
  const times = {}

  try {
    const t = window.performance.timing
    const loadTime = t.loadEventEnd - t.loadEventStart
    if (loadTime < 0) {
      return void setTimeout(getTiming, 200)
    }

    // 重定向的时间
    times.redirectTime = t.redirectEnd - t.redirectStart
    // DNS 查询时间
    // DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    times.dnsTime = t.domainLookupEnd - t.domainLookupStart
    // 读取页面第一个字节的时间
    // 这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    times.ttfbTime = t.responseStart - t.navigationStart
    // DNS 缓存时间
    times.appcacheTime = t.domainLookupStart - t.fetchStart
    // 卸载页面的时间
    times.unloadTime = t.unloadEventEnd - t.unloadEventStart
    // tcp连接耗时
    times.tcpTime = t.connectEnd - t.connectStart
    // 内容加载完成的时间
    // 页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    times.resTime = t.responseEnd - t.responseStart
    // dom树耗时
    times.analysisTime = t.domComplete - t.domInteractive
    // 白屏时间
    times.blankTime = t.domLoading - t.navigationStart
    // domReadyTime
    times.domReadyTime = t.domContentLoadedEventEnd - t.navigationStart
    // 页面加载完成的时间
    // 这几乎代表了用户等待页面可用的时间
    times.loadPage = t.loadEventEnd - t.navigationStart
  } catch (e) {
    console.error(e)
    console.error('你的浏览器不支持 performance 操作')
  }
  return times
}

console.log(getTiming())

function getEntries () {
  const entryTimesList = []
  try {
    const entryList = window.performance.getEntries()
    if (!entryList || !entryList.length) return entryTimesList
    return entryList.reduce((result, nextEntry) => {
      const usefulType = [
        'script',
        'css',
        'fetch',
        'xmlhttprequest',
        'link',
        'img'
      ]

      const {
        name,
        initiatorType,
        nextHopProtocol,
        domainLookupEnd,
        domainLookupStart,
        connectEnd,
        connectStart,
        responseEnd,
        responseStart,
        redirectEnd,
        redirectStart
      } = nextEntry

      if (usefulType.includes(initiatorType)) {
        return [
          ...result,
          {
            // 请求资源路径
            name,
            // 发起资源类型
            initiatorType,
            // http协议版本
            nextHopProtocol,
            // dns查询耗时
            dnsTime: domainLookupEnd - domainLookupStart,
            // tcp链接耗时
            tcpTime: connectEnd - connectStart,
            // 内容加载完成的时间
            resTime: responseEnd - responseStart,
            // 重定向时间
            redirectTime: redirectEnd - redirectStart
          }
        ]
      }
      return result
    }, entryTimesList)
  } catch (e) {
    console.error(e)
    console.error('你的浏览器不支持 performance 操作')
    return entryTimesList
  }
}
