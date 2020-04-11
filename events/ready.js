const Knex = require('knex')
const getCnC = require('../commands')

module.exports = (client) => {
  console.log(client)
  client.db = Knex(client.config.knex)
  client.cData = getCnC(client, client.config.categories)
}
