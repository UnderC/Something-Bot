const Knex = require('knex')
const getCnC = require('../commands')
const something = require('../something')

module.exports = (client) => {
  console.log(client)
  client.db = Knex(client.config.knex)
  client.vote = new something.Vote(client, client.db)
  client.cData = getCnC(client, client.config.categories)

}
