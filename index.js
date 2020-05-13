const Eris = require('eris')

const config = require('./config.json')
const events = require('./events')

const bot = new Eris(config.token)
bot.config = config

bot.on('ready', events.ready.bind({}, bot))
bot.on('messageCreate', events.message.bind({}, bot))
bot.on('debug', console.log)
bot.on('messageReactionAdd', events.reaction.bind({}, bot))

bot.connect()
