const Model = require('../model')

class TicketReOpen extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['reopen'],
      name: 'ReOpen',
      checkManager: true,
      reqTicket: true
    })
  }

  async run (message) {
    if (!message.ticket.saved) return message.channel.createMessage('이미 열려있는 티켓입니다.')
    message.channel.permissionOverwrites.filter(p => p.type === 'member').forEach(p => {
      if (p.id !== this.client.user.id) message.channel.editPermission(p.id, 3072, 0, 'member')
    })

    const some = message.args.slice(1).join(' ')
    message.channel.createMessage(`<@${message.member.id}>의 요청으로 티켓이 다시 열렸습니다.\n세부 사항 : ${some === '' ? '없음' : some}`)
    message.channel.edit({ name: message.channel.name.split('closed-').join('') })
    await this.db('tickets').where({ guild: message.ticket.guild, uuid: message.ticket.uuid }).update({ saved: false })
  }
}

module.exports = TicketReOpen
