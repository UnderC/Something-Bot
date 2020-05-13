const Model = require('../model')

class VoteCreate extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['createvote', 'votecreate'],
      name: 'createVote'
    })
  }

  async run (message) {
    if (!message.args[1]) return message.channel.createMessage('투표를 생성할 채널의 id를 입력해 주세요.')
    else if (isNaN(Number(message.args[1]))) return message.channel.createMessage('채널의 id를 정수 타입으로 입력해 주세요.')
    else if (!message.args[2]) return message.channel.createMessage('생성할 투표의 제목을 입력해 주세요.')

    const channel = message.guild.channels.find(c => c.id === message.args[1])
    if (!channel) return message.channel.createMessage('채널을 찾을 수 없습니다.')

    const title = message.args.slice(2).join(' ')
    const voteMsg = await channel.createMessage({ embed: { title } })
    const result = await this.db('votes').insert({
      title,
      guild: message.guild.id,
      channel: voteMsg.channel.id,
      message: voteMsg.id,
      data: '{}',
      items: '[]'
    })

    message.channel.createMessage(`[${result[0]}] \`${title}\` 투표를 <#${channel.id}>에 생성하였습니다.`)
  }
}

module.exports = VoteCreate
