module.exports = {
  name: 'vote',
  commands: {
    addItem: require('./add'),
    createVote: require('./create'),
    setExpires: require('./setExpires'),
    setting: require('./setting'),
    view: require('./view')
  }, override: {
    checkManager: true
  }
}
