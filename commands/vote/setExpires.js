const Model = require('../model')

class VoteExpires extends Model {
  constructor (client, db) {
    super({
      client, db,
      alias: ['voteexpires', 'expiresvote'],
      name: 'setVoteExpires'
    })
  }

  async run (message) {
    let inf = false
    if (!message.args[1]) return message.channel.createMessage('마감일을 수정할 투표의 id를 입력해 주세요.')
    else if (!message.args[2] || !message.args[3]) {
      if (message.args[2] !== '-1') return message.channel.createMessage('마감일은 `yyyy-mm-dd hh:mm:ss` 과 같은 형식으로 입력해 주세요.')
      else inf = true
    }
    
    const vote = await this.client.vote.get(message.args[1], message.guild.id)
    if (vote.flag === this.client.vote.errors.int) return message.channel.createMessage('마감일을 수정할 투표의 id를 정수 타입으로 입력해 주세요.')
    else if (vote.flag === this.client.vote.errors.notExist) return message.channel.createMessage('존재하지 않는 투표입니다.')
    else if (vote.flag === this.client.vote.errors.closed) return message.channel.createMessage('이미 종료된 투표입니다.')

    const orignal = message.args.slice(2, 4).join(' ')
    const expires = inf ? -1 : new Date(orignal).getTime()
    if (isNaN(expires)) return message.channel.createMessage('마감일은 `yyyy-mm-dd hh:mm:ss` 과 같은 형식으로 입력해 주세요.')

    message.channel.createMessage(`[${vote.id}] \`${vote.title}\` 투표의 마감일을 \`${orignal}\` 로 설정했습니다.`)
    vote.update()
    await this.db('votes').where({ id: vote.id }).update({ expires })
  }
}

module.exports = VoteExpires
