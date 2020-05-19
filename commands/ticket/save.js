const Model = require('../model')

class TicketSave extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['save'],
      name: 'Save',
      checkManager: true,
      reqTicket: true
    })
  }

  async run (message) {
    if (message.ticket.saved) return message.channel.createMessage('이미 보존된 티켓입니다.')
    const some = message.args.slice(1).join(' ')
    message.channel.permissionOverwrites.filter(p => p.type === 'member').forEach(p => {
      if (p.id !== this.client.user.id) message.channel.editPermission(p.id, 0, 3072, 'member')
    })

    message.channel.edit({ name: `closed-${message.channel.name}` })
    message.channel.createMessage(`<@${message.member.id}>에 의해 티켓이 보존되었습니다.\n세부 사항 : ${some === '' ? '없음' : some}`)
    await this.db('tickets').where({ guild: message.ticket.guild, uuid: message.ticket.uuid }).update({ saved: true })
  }
}

module.exports = TicketSave
