const Model = require('../model')
const modes = ['set', 'view']
const options = [
  {
    name: 'isPrivate',
    type: 'boolean',
    toggle: true
  }, {
    name: 'autoResult',
    type: 'boolean',
    toggle: true
  }, {
    name: 'allowCancel',
    type: 'boolean',
    toggle: true
  }, {
    name: 'isClosed',
    type: 'boolean',
    toggle: true
  }, {
    name: 'allowDuplicates',
    type: 'number'
  }, {
    name: 'title',
    type: 'string'
  }, {
    name: 'content',
    type: 'string'
  }
]

class VoteSettings extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['setvote', 'voteset'],
      name: 'voteSettings'
    })
  }

  async run (message) {
    const event = new this.client.Event(options)
    if (!message.args[1] || !message.args[2] || !modes.includes(message.args[2])) {
      return message.channel.createMessage('**사용법**\n`??setvote (voteID) ("set"|"view") (settings) (?value)`')
    } else if (!message.args[3] || !event.keys.includes(message.args[3])) {
      return message.channel.createMessage(`**설정 또는 확인이 가능한 옵션 목록**\n\`${event.keys.join(', ')}\``)
    }

    const vote = await this.client.vote.get(message.args[1], message.guild.id, true)
    if (vote.flag === this.client.vote.errors.int) return message.channel.createMessage('투표의 id를 정수 타입으로 입력해 주세요.')
    else if (vote.flag === this.client.vote.errors.notExist) return message.channel.createMessage('존재하지 않는 투표입니다.')

    const key = message.args[3]
    const opt = event.events.find(v => v.name === key)
    const before = event.validate(null, vote[key], opt) || vote[key]
    if (message.args[2] === 'view') {
      return message.channel.createMessage(`**[${vote.id}] "${vote.title}"의 정보**\n**Key** : ${opt.name}\n**Type** : ${opt.type}\n**Value** : ${before}`)
    } else if (message.args[2] === 'set') {
      const set = {}
      set[opt.name] = event.validate(null, message.args.slice(4).join(' '), opt)
      if (set[opt.name] === undefined) return message.channel.createMessage(`올바른 ${opt.type} 값을 입력해 주세요.`)

      await this.db('votes').where({ id: vote.id }).update(set)
      vote.update()
      message.channel.createMessage(`**Key** "${key}"의 값을 "${before}"에서 "${set[opt.name]}"로 변경되었습니다.`)
    }
  }
}

module.exports = VoteSettings
