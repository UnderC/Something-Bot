const uuid = require('uuid')
const Model = require('../model')

class TicketOpen extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['open', 'create', 'new'],
      name: 'Open'
    })
  }

  async run (message) {
    if (message.ticket) return message.channel.createMessage('티켓 내에서 또 다른 티켓을 생성할 수 없습니다.')

    const data = {
      guild: message.guild.id,
      requester: message.member.id,
      uuid: uuid.v4(),
      saved: false
    }

    const everyone = message.guild.roles.find(r => r.name === '@everyone')
    const channel = await message.guild.createChannel(
      `ticket-${data.uuid.slice(0, 4)}`, 0,
      {
        topic: data.uuid,
        parentID: message.guildInf.parent,
        permissionOverwrites: [
          { id: this.client.user.id, type: 'member', allow: 268438544 },
          { id: message.member.id, type: 'member', allow: 3072 },
          { id: everyone.id, deny: 3072 }
        ].concat(message.guildInf.roles.map(v => { return { id: v, allow: 3072 } }))
      }
    )

    const some = message.args.slice(1).join(' ')
    message.channel.createMessage(`<#${channel.id}> 채널이 생성되었습니다.`)
    channel.createMessage(`<@${message.member.id}>의 요청으로 티켓이 생성되었습니다.\n세부 사항 : ${some === '' ? '없음' : some}`)
    await this.db('tickets').insert(data)
  }
}

module.exports = TicketOpen
