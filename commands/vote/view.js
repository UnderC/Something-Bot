const Model = require('../model')

class VoteView extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['vote', 'viewvote', 'voteview'],
      name: 'viewVote',
      checkManager: false
    })
  }

  async run (message) {
    if (!message.args[1]) return message.channel.createMessage('확인할 투표의 id를 입력해 주세요.')

    const vote = await this.client.vote.get(message.args[1], message.guild.id, true)
    if (vote.flag === this.client.vote.errors.int) return message.channel.createMessage('투표의 id를 정수 타입으로 입력해 주세요.')
    else if (vote.flag === this.client.vote.errors.notExist) return message.channel.createMessage('존재하지 않는 투표입니다.')

    const votes = vote.getDuplicates(message.author.id)
    const content = votes.join(', ')
    const channel = vote.isPrivate ? await this.client.getDMChannel(message.author.id) : message.channel
    channel.createMessage(`[${vote.id}] \`${vote.title}\` 투표에\n${content} 이모지에 투표를 하셨습니다.`)
  }
}

module.exports = VoteView
