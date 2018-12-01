const PORT = 33333
const HOST = '0.0.0.0'

const yaml = require('js-yaml')
const dgram = require('dgram')
const server = dgram.createSocket('udp4')
const fs = require('fs')

const { byCode } = require('./constants')
const { Keyboard, modifiersByKey, getModifiers } = require('./utils')
const { exec } = require('child_process')
const Targets = require('./targets')

console.log(Targets)

const config = yaml.safeLoad(fs.readFileSync('./config/keyboard.yml', 'utf8'))

server.on('message', data => {
  const message = Keyboard.parse(data)
  const input = [...message.Codes, ...getModifiers(message)]
    .map(code => code && byCode[code])
    .filter(Boolean)

  if (input.length <= 0) return
  console.log(input)

  for (const key of input) {
    if (!config.hasOwnProperty(key)) continue
    const match = config[key]

    if (typeof match === 'string') {
      console.log('RUN: ', match)
      exec(match, err => {
        if (err) console.error(err)
      })
    } else {
      console.log('RUN', match.target)
      if (!Targets.hasOwnProperty(match.target)) continue

      Targets[match.target](match.command, match.args)
    }
  }
})

server.bind(PORT, HOST)
