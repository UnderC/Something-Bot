const Model = require('../model')
const modes = ['set', 'view']
const booleans = ['false', 'true']
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
      client, db,
      alias: ['setvote', 'voteset'],
      name: 'voteSettings'
    })
  }

  async run (message) {
    const opts = options.map(v => v.name)
    if (!message.args[1] || !message.args[2] || !modes.includes(message.args[2])) {
      return message.channel.createMessage('**사용법**\n`??setvote (voteID) ("set"|"view") (settings) (?value)`')
    } else if (!message.args[3] || !opts.includes(message.args[3])) {
      return message.channel.createMessage(`**설정 또는 확인이 가능한 옵션 목록**\n\`${opts.join(', ')}\``)
    }

    const vote = await this.client.vote.get(message.args[1], message.guild.id, true)
    if (vote.flag === this.client.vote.errors.int) return message.channel.createMessage('투표의 id를 정수 타입으로 입력해 주세요.')
    else if (vote.flag === this.client.vote.errors.notExist) return message.channel.createMessage('존재하지 않는 투표입니다.')

    const key = message.args[3]
    for (const opt of options) {
      if (opt.name !== key) continue
      const value = opt.type === 'boolean' ? Boolean(vote[key]) : vote[key]
      if (message.args[2] === 'view') {
        return message.channel.createMessage(`**[${vote.id}] "${vote.title}"의 정보**\n**Key** : ${opt.name}\n**Type** : ${opt.type}\n**Value** : ${value}`)
      } else if (message.args[2] === 'set') {
        const data = message.args[4].toLowerCase()
        if (opt.type === 'boolean' && !booleans.includes(data)) return message.channel.createMessage('올바른 boolean 값을 입력해 주세요.')
        else if (opt.type === 'number' && isNaN(data)) return message.channel('올바른 정수 값을 입력해 주세요.')

        const set = {}
        set[opt.name] = opt.type === 'boolean'
          ? booleans.indexOf(data)
          : (opt.type === 'number' ? Number(data) : message.args.slice(4).join(' '))
        
        await this.db('votes').where({ id: vote.id }).update(set)
        vote.update()
        message.channel.createMessage(`**Key** "${key}"의 값을 "${value}"에서 "${data}"로 변경되었습니다.`)
      }
    }
  }
}

module.exports = VoteSettings
