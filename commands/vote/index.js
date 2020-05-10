module.exports = {
  name: 'vote',
  commands: {
    addItem: require('./add'),
    createVote: require('./create'),
  }, override: {
    checkManager: true
  }
}
