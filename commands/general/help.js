const Model = require('../model')

class TicketHelp extends Model {
  constructor (client, db) {
    super({
      client,
      db,
      alias: ['help'],
      name: 'Help'
    })
  }

  async run (message) {
    const p = this.client.config.prefix
    const dm = await message.author.getDMChannel()
    dm.createMessage(`\`\`\`
/* 유저 전용 */
${p}help | 도움말을 DM 채널에 표시합니다.
${p}open (?desc) | 티켓을 생성합니다.
${p}rename (name) | 해당 티켓 채널 이름을 변경합니다.
${p}add (user)... | 해당 티켓에 유저를 추가합니다.
${p}remove (user)... | 해당 티켓에 유저를 제거합니다.

/* 관리자 전용 */
${p}category (categoryID) | 카테고리 하위에 티켓이 생성되도록 합니다.
${p}admins (roleID) | 티켓에 접근할 수 있는 역할들의 인덱스와 ID, 이름을 출력합니다.
${p}addadm (roleID) | 티켓에 접근할 수 있는 역할을 추가합니다.
${p}rmadm (roleIndex) | 티켓에 접근할 수 있는 역할을 제거합니다.
${p}save (?desc) | 해당 티켓을 보존하고 닫습니다.
${p}reopen (?desc) | 보존된 티켓을 다시 엽니다.
${p}close (?desc) | 해당 티켓을 삭제합니다.
${p}monit (user) (event) | 지정한 대상에서 일어나는 특정 이벤트를 추적합니다.
\`\`\``)

    dm.createMessage(`\`\`\`
${p}createvote (channel) (name) | 지정한 채널에 투표를 생성합니다.
${p}items (id) | 해당 투표에 투표가 가능한 항목을 모두 불러옵니다.
${p}additem (id) (emoji) (value) | 해당 투표에 항목을 생성합니다.
${p}voteexpires (id) (date) | 해당 투표에 만료 기한을 지정합니다.
${p}setvote (id) set|view (column) (?value)
${p}updatevote (id) | 해당 투표가 버그로 인해 업데이트가 안됐을 시 강제로 업데이트 합니다.
\`\`\``)
  }
}

module.exports = TicketHelp
