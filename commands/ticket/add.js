const Model = require('../model')

class TicketAddUser extends Model {
  constructor (client, db) {
    super({
      client, db,
      alias: ['add', 'adduser', 'addusr'],
      name: 'Add',
      reqTicket: true
    })
  }

  async run (message) {
    if (message.ticket.saved) return message.channel.createMessage('이미 보존된 티켓에 새로운 유저를 추가할 수 없습니다.')
    if (message.args.length <= 1) return message.channel.createMessage('추가할 유저가 없습니다.')
    const targets = message.args.slice(1)
    targets.forEach(v => {
      const target = v.replace('<@', '').replace('>', '').replace('&', '').replace('!', '')
      if (target === message.ticket.requester) return message.channel.createMessage('티켓 요청자는 추가할 수 없습니다.')
      message.channel.editPermission(target, 3072, 0, 'member')
    })

    message.channel.createMessage(`${targets.length}명의 유저를 티켓에 추가하였습니다.`)
  }
}

module.exports = TicketAddUser
