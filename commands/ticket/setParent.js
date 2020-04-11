const Model = require('../model')

class TicketSetParent extends Model {
  constructor (client, db) {
    super({
      client, db,
      alias: ['parent', 'category', 'setparent'],
      name: 'SetParent'
    })
  }

  async run (message) {
    if (!message.args[1]) return message.channel.createMessage('카테고리 ID를 입력해주세요.')
    else if (isNaN(Number(message.args[1]))) return message.channel.createMessage('올바르지 않은 카테고리 ID입니다.')
    await this.db('guilds').where({ guild: message.guild.id }).update({ parent: message.args[1] })
    message.channel.createMessage('앞으로 티켓은 해당 카테고리 하위에 생성됩니다.')
  }
}

module.exports = TicketSetParent
