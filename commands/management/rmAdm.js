const Model = require('../model')

class TicketRemoveAdmin extends Model {
  constructor (client, db) {
    super({
      client, db,
      alias: ['removeadmin', 'rmadmin', 'removeadm', 'rmadm'],
      name: 'RemoveAdmin'
    })
  }

  async run (message) {
    const index = Number(message.args[1])
    if (!message.args[1]) return message.channel.createMessage('관리자 목록에 삭제할 역할 인덱스를 입력해주세요.')
    else if (isNaN(index)) return message.channel.createMessage('올바르지 않은 정수입니다.')
    message.guildInf.roles.splice(index, 1)
    await this.db('guilds').where({ guild: message.guild.id }).update({ roles: JSON.stringify(message.guildInf.roles) })
    message.channel.createMessage('해당 역할을 삭제하였습니다.')
  }
}

module.exports = TicketRemoveAdmin
