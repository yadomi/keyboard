const OBSWebSocket = require('obs-websocket-js')

const obs = new OBSWebSocket()
obs.connect({ address: 'localhost:4444', password: 'twitchprime' })

module.exports = function(command, args) {
  obs.send(command, args)
}
