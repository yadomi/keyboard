const { Parser } = require('binary-parser')
const { byName } = require('./constants')
const { pick, reduce, compose, toPairs, append } = require('ramda')

const modifiersByKey = {
  LeftControl: byName['LEFT_CONTROL'],
  LeftShift: byName['LEFT_SHIFT'],
  LeftAlt: byName['LEFT_ALT'],
  LeftMeta: byName['LEFT_META'],
  RightControl: byName['RIGHT_CONTROL'],
  RightShift: byName['RIGHT_SHIFT'],
  RightAlt: byName['RIGHT_ALT'],
  RightMeta: byName['RIGHT_META']
}

const Keyboard = new Parser()
  .bit1('RightMeta')
  .bit1('RightAlt')
  .bit1('RightShift')
  .bit1('RightControl')
  .bit1('LeftMeta')
  .bit1('LeftAlt')
  .bit1('LeftShift')
  .bit1('LeftControl')
  .skip(1)
  .array('Codes', { type: 'int8', length: 6 })

const getModifiers = compose(
  reduce(
    (sum, [key, value]) => (value ? append(modifiersByKey[key], sum) : sum),
    []
  ),
  toPairs,
  pick(Object.keys(modifiersByKey))
)

module.exports = {
  modifiersByKey,
  Keyboard,
  getModifiers
}
