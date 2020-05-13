const Model = require('../model')

class TicketClose extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['close'],
      name: 'Close',
      checkManager: true,
      reqTicket: true
    })
  }

  async run (message) {
    if (!message.ticket) return message.channel.createMessage('유효하지 않은 티켓입니다.')
    await this.db('tickets').where({ uuid: message.ticket.uuid, guild: message.guild.id }).del()
    this.client.deleteChannel(message.channel.id)
  }
}

module.exports = TicketClose
