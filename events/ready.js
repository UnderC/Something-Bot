const Knex = require('knex')
const getCnC = require('../commands')
const something = require('../something')

module.exports = (client) => {
  client.db = Knex(client.config.knex)
  client.vote = new something.Vote(client, client.db)
  client.cData = getCnC(client, client.config.categories)

  setInterval(async () => {
    const ends = await client.vote.getExpires()
    for (const end of ends) {
      const vote = await client.vote.get(end.id)
      await vote.close()
    }
  }, 5000)
}
