const yaml = require('js-yaml')
const fs = require('fs')

const config = yaml.safeLoad(fs.readFileSync('./config/config.yml', 'utf8'))
const targets = {}

for (const target of config.targets) {
  require(`./${target.name}`)(target, fn => {
    targets[target.name] = fn
  })
}

module.exports = targets
