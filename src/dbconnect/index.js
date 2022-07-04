const User = require('./connect')
const UserService = require('./service')

module.exports = UserService(User);