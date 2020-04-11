module.exports = {
  name: 'management',
  commands: {
    admins: require('./admins'),
    addAdm: require('./addAdm'),
    rmAdm: require('./rmAdm'),
    monit: require('./monit')
  }, override: {
    checkManager: true
  }
}
