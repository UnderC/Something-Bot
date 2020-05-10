const errors = {
  int: 0,
  notExist: 1,
  closed: 2,
  noMessage: 3
}

class Vote {
  constructor (manager, raw, message) {
    this.id = raw.id
    this.guild = raw.guild
    this.channel = raw.channel
    this.message = raw.message
    this.title = raw.title
    this.content = raw.content
    this.data = raw.data
    this.items = raw.items
    this.expires = raw.expires
    this.isPrivate = raw.isPrivate
    this.allowCancel = raw.allowCancel
    this.isClosed = raw.isClosed
    this.isAdminOnly = raw.isAdminOnly
    this.allowDuplicates = raw.allowDuplicates
    this.manager = manager
    this.realMessage = message
  }

  update () {
    return this.manager.update(this)
  }
}

class VoteManager {
  constructor (client, db) {
    this.client = client
    this.db = db
    this.errors = errors
  }

  get (id, guild, validateMessage) {
    const index = Number(id)
    if (isNaN(index)) return { flag: errors.int }
    return this.db('votes').where({ id: index }).then(result => {
      const vote = result[0]
      if (!vote || (vote.guild !== guild)) return { flag: errors.notExist }
      else if (vote.isClosed) return { flag: closed }

      return this.client.getMessage(vote.channel, vote.message).then(message => {
        if (validateMessage && !message) return { flag: noMessage }
        console.log(this)
        return new Vote(this, vote, message)
      })
    })
  }

  update (vote) {
    const content = vote.items.map(item => `${item.emoji} ${item.content}`)
    const description = `${vote.content ? `${vote.content}\n` : ''}${content.join('\n')}`
    return vote.realMessage.edit({ embed: { title: vote.title, description } })
  }
}

module.exports = VoteManager
