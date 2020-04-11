const Model = require('../model')

class TicketAddAdmin extends Model {
  constructor (client, db) {
    super({
      client, db,
      alias: ['addadmin', 'addadm'],
      name: 'SetParent'
    })
  }

  async run (message) {
    if (!message.args[1]) return message.channel.createMessage('관리자 목록에 추가할 역할 ID를 입력해주세요.')
    else if (isNaN(Number(message.args[1]))) return message.channel.createMessage('올바르지 않은 역할 ID 입니다.')
    message.guildInf.roles.push(message.args[1])
    await this.db('guilds').where({ guild: message.guild.id }).update({ roles: JSON.stringify(message.guildInf.roles) })
    message.channel.createMessage('해당 역할을 추가하였습니다.')
  }
}

module.exports = TicketAddAdmin
