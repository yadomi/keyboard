const PORT = 33333
const HOST = '127.0.0.1'

const dgram = require('dgram')
const server = dgram.createSocket('udp4')

server.on('message', function(message) {
  const key = message.toString('utf-8')
  console.log(key)
})

server.bind(PORT, HOST)
