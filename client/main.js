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

console.log('Registred targets: ', Object.keys(Targets).join(', '))

const keyboard = yaml.safeLoad(fs.readFileSync('./config/keyboard.yml', 'utf8'))

server.on('message', data => {
  const message = Keyboard.parse(data)
  const input = [...message.Codes, ...getModifiers(message)]
    .map(code => code && byCode[code])
    .filter(Boolean)

  if (input.length <= 0) return
  console.log('INPUT', input)

  try {
    for (const key of input) {
      if (!keyboard.hasOwnProperty(key)) continue
      const match = keyboard[key]

      if (typeof match === 'string') {
        console.log('RUN: ', match)
        exec(match, err => {
          if (err) console.error(err)
        })
      } else {
        const matches = Array.isArray(match) ? match : [match]
        for (const entry of matches) {
          if (!Targets.hasOwnProperty(entry.target)) {
            // prettier-ignore
            console.error(`Warning: Target ${entry.target} was not registered or does not exists`)
            continue
          }

          console.log('RUN', entry.target, entry.command)
          Targets[entry.target](entry.command, entry.args)
        }
      }
    }
  } catch (err) {
    console.error('Main:', err)
  }
})

server.bind(PORT, HOST)
console.log('Ready, listening for keystroke...')
