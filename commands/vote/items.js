const Model = require('../model')

class VoteItems extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['voteitems', 'items'],
      name: 'voteitems'
    })
  }

  async run (message) {
    if (!message.args[1]) return message.channel.createMessage('투표가 가능한 항목을 확인할 투표의 id를 입력해 주세요.')

    const vote = await this.client.vote.get(message.args[1], message.guild.id, true)
    if (vote.flag === this.client.vote.errors.int) return message.channel.createMessage('투표의 id를 정수 타입으로 입력해 주세요.')
    else if (vote.flag === this.client.vote.errors.notExist) return message.channel.createMessage('존재하지 않는 투표입니다.')

    const items = []
    for (const i in vote.items) items.push(`[${i}] ${vote.items[i].emoji} ${vote.items[i].content}`)
    message.channel.createMessage(`[${vote.id}] \`${vote.title}\` 투표의 항목\n${items.join('\n')}`)
  }
}

module.exports = VoteItems
