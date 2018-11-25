const iohook = require('iohook')
const { byCode, byName } = require('./constants')

const PORT = 33333
const HOST = '127.0.0.1'

const dgram = require('dgram')
const client = dgram.createSocket('udp4')

iohook.on('keydown', event => {
  const message = byCode[event.keycode]
  if (!message) return
  client.send(message, 0, message.length, PORT, HOST)
})

iohook.start()
