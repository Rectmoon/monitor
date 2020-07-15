import perf from './performance'
import error from './error'
import behavior from './behavior'
import resource from './resource'

export default class MonitorSdk {
  constructor (config = {}) {
    const { resourceOn = true, errorOn = true, behaviorOn = true } = config
    this.resourceOn = resourceOn
    this.errorOn = errorOn
    this.behaviorOn = behaviorOn
    this.init()
  }

  init () {
    this.initData()
    this.initReporters()
  }

  initData () {
    this.resourceList = []
    this.errorList = []
  }

  initReporters () {
    const { resourceList, errorList } = this

    if (this.resourceOn) {
      resource.ready(data => {
        resourceList.push(data)
      })
    }

    if (this.errorOn) {
      error.ready(data => {
        errorList.push(data)
      })
    }

    perf.ready(perfInfo => {
      this.report({
        type: 1,
        perfInfo,
        resourceList,
        errorList
      }).then(() => {
        this.initData()
      })
    })
  }

  report (data) {
    const url = 'http://www.report.com/report'

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      type: 'report-data',
      body: JSON.stringify(data)
    }).catch(err => {
      console.log(err)
    })
  }
}
