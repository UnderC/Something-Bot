const errors = {
  int: 0,
  notExist: 1,
  closed: 2,
  noMessage: 3
}

class Vote {
  constructor (manager, raw, message, flag) {
    this.id = raw.id
    this.guild = raw.guild
    this.channel = raw.channel
    this.message = raw.message
    this.title = raw.title
    this.content = raw.content
    this.data = raw.data
    this.items = raw.items
    this.expires = parseInt(raw.expires)
    this.isPrivate = raw.isPrivate
    this.autoResult = raw.autoResult
    this.allowCancel = raw.allowCancel
    this.isClosed = raw.isClosed
    this.isAdminOnly = raw.isAdminOnly
    this.allowDuplicates = raw.allowDuplicates
    this.manager = manager
    this.realMessage = message
    this.flag = flag
  }

  get expired () {
    return this.expires !== -1 && (new Date() >= this.expires)
  }

  update (toPublic) {
    const _ = toPublic !== undefined ? toPublic : !this.isPrivate
    return this.manager.update(this, this.isClosed ? this.autoResult : _)
  }

  close () {
    this.isClosed = true
    this.update()
    return this.manager.db('votes').where({ id: this.id }).update({ isClosed: true })
  }

  getDuplicates (user) {
    const votes = []
    const keys =  Object.keys(this.data)
    const values = Object.values(this.data)
    for (const i in keys) if (values[i].includes(user)) votes.push(keys[i])
    return votes
  }
}

const zf = (i) => i < 10 ? `0${i}` : i

class VoteManager {
  constructor (client, db) {
    this.client = client
    this.db = db
    this.errors = errors
  }

  _ (vote, guild, validateMessage) {
    let flag
    if (!vote || (guild && (vote.guild !== guild))) return { flag: errors.notExist }
    else if (vote.message === '') flag = errors.noMessage
    else if (vote.isClosed) flag = errors.closed

    return this.client.getMessage(vote.channel, vote.message).then(message => {
      if (!message) {
        if (validateMessage) this.db('votes').where({ id: vote.id }).update({ isClosed: true, message: '' }).then()
        flag = errors.noMessage
      } else return new Vote(this, vote, message, flag)
    })
  }

  get (id, guild, validateMessage) {
    const index = Number(id)
    if (isNaN(index)) return { flag: errors.int }
    return this.db('votes').where({ id: index }).then(result => {
      return this._(result[0], guild, validateMessage)
    })
  }

  getFromMessage (messageID, validateMessage) {
    return this.db('votes').where({ message: messageID }).then(result => {
      return this._(result[0], null, validateMessage)
    })
  }

  getExpires () {
    return this.db('votes')
      .where({ isClosed: false, autoResult: true })
      .andWhere(this.db.raw('expires != -1'))
      .andWhere(this.db.raw('expires <= ?', [Date.now()]))
  }

  update (vote, toPublic) {
    const content = vote.items.map(item => {
      const result = `[${vote.data[item.emoji] ? vote.data[item.emoji].length : 0}]`
      return `${item.emoji} ${item.content}${toPublic ? ` ${result}`: ''}`
    })
    const raw = new Date(vote.expires)
    const date = `${raw.getFullYear()}-${zf(raw.getMonth() + 1)}-${zf(raw.getDate())} ${zf(raw.getHours())}:${zf(raw.getMinutes())}:${zf(raw.getSeconds())}`
    const status = `이 투표는 ${vote.isClosed ? `${date}에 마감되었습니다.` : (vote.expires !== -1 ? `${date}에 마감됩니다.` : '마감되지 않습니다.')}`
    const description = `${vote.content ? `${vote.content}\n` : ''}${content.join('\n')}\n**${status}**`
    if (vote.isClosed && Object.keys(vote.realMessage.reactions)) vote.realMessage.removeReactions()
    return vote.realMessage.edit({ embed: { title: vote.title, description } })
  }
}

module.exports = VoteManager
