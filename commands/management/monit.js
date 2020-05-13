const Model = require('../model')

const trace = (target, message, event, index, a) => {
  console.log(a, message, `[${event}][${index}]`)
  if ((a.member ? a.member.id : a.author ? a.author.id : a.id) === target.id && target.enable) {
    message.channel.createMessage(`<@${target.id}>의 이벤트를 추적했습니다.`)
    if (index !== null) {
      if (typeof message._client._events[event] === typeof []) message._client._events[event].splice(index)
      else delete message._client._events[event]
    } else delete message._client._events[event]
  }
}

class EventMonitor extends Model {
  constructor (client, db) {
    super({
      client, db,
      alias: ['monit', 'monitor'],
      name: 'Monitor'
    })
  }

  async run (message) {
    if (!message.args[1]) return message.channel.createMessage('이벤트를 추적할 대상을 입력해주세요.')
    if (!message.args[2]) return message.channel.createMessage('추적할 이벤트의 이름을 입력해주세요.')
    const target = message.args[1].replace('<@', '').replace('>', '').replace('&', '').replace('!', '')
    const event = message.args[2]
    this.client.on(event, trace.bind(
      {},
      { id: target, enable: true },
      message,
      event,
      this.client._events[event] ? this.client._events[event].length : null
    ))
    message.channel.createMessage('지정한 대상의 특정 이벤트 추적을 시작합니다.')
  }
}

module.exports = EventMonitor
