const booleans = ['false', 'true']
class SomethingEventItem {
  constructor (name, type) {
    this.name = name
    this.type = type
  }

  static build (a, b) {
    if (typeof a === typeof []) return a.map(v => new SomethingEventItem(v.name, v.type))
    else if (typeof a === typeof '' && typeof b === typeof '') return [new SomethingEventItem(a, b)]
    else return []
  }

  get undefs () {
    switch (this.type) {
      case 'string':
        return ['NaN', 'undefined', 'null', '']
      case 'number':
        return ['NaN']
      default:
        return []
    }
  }

  convert (a) {
    switch (this.type) {
      case 'string':
        return String(a)
      case 'boolean':
        return Boolean(booleans.indexOf(a))
      case 'number':
        return Number(a)
      case 'json':
        return typeof a === 'object' ? a : JSON.parse(a)
      default:
        return a
    }
  }
}

class SomethingEvent {
  constructor (a, b) {
    this.events = SomethingEventItem.build(a, b)
    this.keys = this.events.map(v => v.name)
  }

  validate (a, b, _event) {
    const event = _event || this.events.find(v => v.type === a)
    return !event.undefs.includes(b) ? event.convert(b) : undefined
  }
}

module.exports = SomethingEvent
