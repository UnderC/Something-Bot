module.exports = async (client, message, emoji, user) => {
  if (client.user.id === user) return
  const vote = await client.vote.getFromMessage(message.id)
  if (!vote || vote.flag || (vote.guild !== message.channel.guild.id) || vote.isClosed) return
  const dm = await client.getDMChannel(user)
  let emojiID = `${emoji.name}`
  if (emoji.id) emojiID = `<${emoji.animated ? 'a:' : ':'}${emojiID}:${emoji.id}>`

  if (!vote.data[emojiID]) vote.data[emojiID] = []
  if (vote.data[emojiID].includes(user)) {
    if (vote.allowCancel) {
      const index = vote.data[emojiID].indexOf(user)
      vote.data[emojiID].splice(index, 1)
      dm.createMessage(`성공적으로 ${emojiID} 에 투표 취소했습니다.`)
    } else dm.createMessage('투표를 취소할 수 없게 설정되어 있습니다.')
  } else {
    const votes = vote.getDuplicates(user)
    if (votes.length >= vote.allowDuplicates) {
      const content = votes.join(', ')
      dm.createMessage(`[${vote.id}] \`${vote.title}\` 투표에 ${vote.allowDuplicates}개 이상 투표하실 수 없습니다.\n ${content} 이모지에 투표를 하셨습니다.`)
    } else {
      vote.data[emojiID].push(user)
      dm.createMessage(`성공적으로 ${emojiID} 에 투표했습니다.`)
    }
  }

  vote.realMessage.removeReaction(emojiID.includes(':') ? emojiID.replace('<a:', '').replace('<:', '').replace('>', '') : emojiID, user)
  vote.update()
  await client.db('votes').where({ id: vote.id }).update({ data: JSON.stringify(vote.data) })
}
