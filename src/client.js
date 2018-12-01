const PORT = 33333
const HOST = '0.0.0.0'

const yaml = require('js-yaml')
const dgram = require('dgram')
const server = dgram.createSocket('udp4')
const fs = require('fs')

const { byCode } = require('./constants')
const {
  pick,
  reduce,
  compose,
  toPairs,
  append,
  all,
  contains,
  __
} = require('ramda')
const { Keyboard, modifiersByKey } = require('./utils')
const config = yaml.safeLoad(fs.readFileSync('./config/keyboard.yml', 'utf8'))

console.log({ config })

const modifiers = compose(
  reduce(
    (sum, [key, value]) => (value ? append(modifiersByKey[key], sum) : sum),
    []
  ),
  toPairs,
  pick(Object.keys(modifiersByKey))
)

server.on('message', data => {
  const message = Keyboard.parse(data)
  const input = [...message.Codes, ...modifiers(message)]
    .map(code => code && byCode[code])
    .filter(Boolean)

  if (input.length <= 0) return

  for (const key of input) {
    if (!config.hasOwnProperty(key)) continue

    const match = config[key]
    if (typeof match === 'string') console.log(match)

    console.log(match)
  }
})

server.bind(PORT, HOST)
