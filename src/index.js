import perf from './performance'
import error from './error'
import behavior from './behavior'

const targets = [perf, error, behavior]

export default class MonitorSdk {
  constructor () {
    this.init()
  }

  init () {
    targets.forEach(target => {
      target.ready(data => {
        console.log('ready')
        console.log(data)
      })
    })
  }
}
