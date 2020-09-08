const Model = require('../model')

class SetJoinRole extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['admins'],
      name: 'Admins'
    })
  }

  async run (message) {
    let result = ''
    for (let i = 0; i < message.guildInf.roles.length; i++) {
      const roleID = message.guildInf.roles[i]
      const role = message.guild.roles.find(r => r.id === roleID)
      result += `[${i}] ${role ? role.name : '존재하지 않는 역할'}(${roleID})`
      if (i !== message.guildInf.roles.length - 1) result += '\n'
    }
    message.channel.createMessage(`\`\`\`${result === '' ? '관리자 역할이 없습니다.\naddadm 명령어로 추가해보세요.' : result}\`\`\``)
  }
}

module.exports = SetJoinRole
