const Model = require('../model')

class VoteRemoveItem extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['rmitem', 'itemrm'],
      name: 'removeItem'
    })
  }

  async run (message) {
    if (!message.args[1]) return message.channel.createMessage('항목을 삭제할 투표의 id를 입력해 주세요.')
    else if (!message.args[2]) return message.channel.createMessage('삭제할 항목의 이모지 또는 id를 입력해 주세요.')

    const vote = await this.client.vote.get(message.args[1], message.guild.id, true)
    if (vote.flag === this.client.vote.errors.int) return message.channel.createMessage('투표의 id를 정수 타입으로 입력해 주세요.')
    else if (vote.flag === this.client.vote.errors.notExist) return message.channel.createMessage('존재하지 않는 투표입니다.')
    else if (vote.flag === this.client.vote.errors.closed) return message.channel.createMessage('이미 종료된 투표입니다.')
    else if (vote.flag === this.client.vote.errors.noMessage) return message.channel.createMessage('투표 메시지를 찾을 수 없습니다.')

    const target = message.args[2]
    const emoji = vote.items.find((v, i) => i === Number(target) || v.emoji === target)
    const index = vote.items.indexOf(emoji)
    vote.items.splice(index, 1)
    await this.db('votes').where({ id: vote.id, guild: message.guild.id }).update({ items: JSON.stringify(vote.items) })

    vote.update()
    vote.realMessage.removeReaction(emoji.emoji.includes(':') ? emoji.emoji.replace('<a:', '').replace('<:', '').replace('>', '') : emoji.emoji)

    message.channel.createMessage(`[${vote.id}] \`${vote.title}\` 투표의 항목을 삭제했습니다.`)
  }
}

module.exports = VoteRemoveItem
