const iohook = require('iohook')
const { keys, filter } = require('ramda')
const { byCode, byName } = require('./constants')

const RIGHT_META = 'rightMeta'
const RIGHT_ALT = 'rightAlt'
const RIGHT_SHIFT = 'rightShift'
const RIGHT_CONTROL = 'rightControl'
const LEFT_META = 'leftMeta'
const LEFT_ALT = 'leftAlt'
const LEFT_SHIFT = 'leftShift'
const LEFT_CONTROL = 'leftControl'

// prettier-ignore
const MODIFERS_BYTE = [RIGHT_META, RIGHT_ALT, RIGHT_SHIFT, RIGHT_CONTROL, LEFT_META, LEFT_ALT, LEFT_SHIFT, LEFT_CONTROL]

const getModifiers = modifier => {
  const modifiers = keys(filter(Boolean, modifier))
  const value = Array.from(MODIFERS_BYTE)

  for (const index in MODIFERS_BYTE) {
    const key = MODIFERS_BYTE[index]
    value[index] = modifiers.indexOf(key) !== -1 ? 1 : 0
  }

  return Buffer.from(parseInt(value.join(''), 2).toString(16), 'hex')
}

const getReport = message => {
  const modifier = getModifiers(message.modifier)

  const keys = Buffer.alloc(6)
  for (let i = 0; i < 6; i++) {
    if (message.keys[i]) {
      keys[i] = message.keys[i]
    }
  }
  return Buffer.from([...modifier, 0, ...keys])
}

iohook.on('keydown', event => {
  const a = getReport({
    modifier: { rightMeta: true },
    keys: [
      byName['KEY_A'],
      byName['KEY_B'],
      byName['KEY_C'],
      byName['KEY_D'],
      byName['KEY_E'],
      byName['KEY_F']
    ]
  })
  console.log(a)
})

iohook.start()
