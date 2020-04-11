module.exports = {
  name: 'ticket',
  commands: {
    add: require('./add'),
    remove: require('./remove'),
    rename: require('./rename'),
    open: require('./open'),
    close: require('./close'),
    save: require('./save'),
    reOpen: require('./reOpen'),
    setParent: require('./setParent')
  }, override: {}
}
