class Command {
  constructor (info) {
    this.client = info.client
    this.db = info.db
    this.alias = info.alias
    this.name = info.name
    this.checkManager = info.checkManager
    this.checkOwner = info.checkOwner
    this.reqTicket = info.reqTicket
  }

  run () {
    throw new Error()
  }
}

module.exports = Command
