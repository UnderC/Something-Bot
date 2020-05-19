const Model = require('../model')

class TicketRename extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['rename', 'name', 'title'],
      name: 'Rename',
      reqTicket: true
    })
  }

  async run (message) {
    if (!message.ticket) return message.channel.createMessage('유효하지 않은 티켓입니다.')
    const name = message.args.slice(1).join(' ')
    message.channel.createMessage(`티켓 이름이 \`${message.channel.name}\` 에서 \`${name}\` (으)로 변경되었습니다.`)
    message.channel.edit({ name })
  }
}

module.exports = TicketRename
