const Model = require('../model')

class VoteUpdate extends Model {
  constructor (client, db) {
    super({
      client, db,
      alias: ['updatevote'],
      name: 'voteUpdate'
    })
  }

  async run (message) {
    if (!message.args[1]) return message.channel.createMessage('업데이트 할 투표의 id를 입력해주세요.')

    const vote = await this.client.vote.get(message.args[1], message.guild.id, true)
    console.log(vote)
    if (vote.flag === this.client.vote.errors.int) return message.channel.createMessage('업데이트 할 투표의 id를 정수 타입으로 입력해 주세요.')
    else if (vote.flag === this.client.vote.errors.notExist) return message.channel.createMessage('존재하지 않는 투표입니다.')
    else if (vote.flag === this.client.vote.errors.noMessage) return message.channel.createMessage('투표 메시지를 찾을 수 없습니다.')

    vote.update()
  }
}

module.exports = VoteUpdate
