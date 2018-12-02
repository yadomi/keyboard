const OBSWebSocket = require('obs-websocket-js')

module.exports = (config, register) => {
  const obs = new OBSWebSocket()
  obs
    .connect({ address: config.address, password: config.password })
    .then(() => console.error(`[${config.name}]`, 'Connected'))
    .catch(err => console.error(`[${config.name}]`, err.message))

  register((...args) => obs.send(...args))
}
