const getGuild = async (db, guild) => {
  const result = (await db('guilds').where({ guild }))[0]
  if (!result) {
    (await db('guilds').insert({ guild, roles: '[]' }))
    return await getGuild(db, guild)
  } else return result
}

module.exports = async (client, message) => {
  if (message.author.bot || !message.member || !message.content.startsWith(client.config.prefix)) return
  message.guild = message.member.guild
  message.guildInf = await getGuild(client.db, message.guild.id)
  message.args = message.content.trim().slice(client.config.prefix.length).split(' ')
  message.ticket = (await client.db('tickets').where({
    uuid: message.channel.topic,
    guild: message.guild.id
  }))[0]

  const command = client.cData.commands.get(message.args[0])
  if (command) {
    console.log(message.args)
    if (
      command.checkManager
      && (
          !message.member.roles.filter(r => message.guildInf.roles.includes(r)).length
          && !message.member.permission.json.administrator
        )
    ) {
      return message.channel.createMessage('명령을 수행하는 데 유저의 권한이 부족합니다.')
    } else if (command.reqTicket && !message.ticket) return message.channel.createMessage('유효하지 않은 티켓입니다.')
    command.run(message)
  }
}
