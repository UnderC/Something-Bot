const Model = require('../model')

class TicketRemoveUser extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['remove', 'rm', 'rmuser', 'rmusr'],
      name: 'Remove',
      reqTicket: true
    })
  }

  async run (message) {
    if (message.ticket.saved) return message.channel.createMessage('이미 보존된 티켓에 유저를 제거할 수 없습니다.')
    if (message.args.length <= 1) return message.channel.createMessage('제거할 유저가 없습니다.')
    const targets = message.args.slice(1)
    targets.forEach(v => {
      const target = v.replace('<@', '').replace('>', '').replace('&', '').replace('!', '')
      if (target === message.ticket.requester) return message.channel.createMessage('티켓 요청자는 제거할 수 없습니다.')
      message.channel.editPermission(target, 0, 3072, 'member')
    })

    message.channel.createMessage(`${targets.length}명의 유저를 티켓에 제거하였습니다.`)
  }
}

module.exports = TicketRemoveUser
