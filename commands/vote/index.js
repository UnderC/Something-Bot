module.exports = {
  name: 'vote',
  commands: {
    update: require('./update'),
    viewItems: require('./items'),
    addItem: require('./add'),
    rmItem: require('./remove'),
    createVote: require('./create'),
    setExpires: require('./setExpires'),
    setting: require('./setting'),
    view: require('./view')
  },
  override: {
    checkManager: true
  }
}
