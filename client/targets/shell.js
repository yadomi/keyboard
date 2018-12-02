const { exec } = require('child_process')

const fn = (command, args) => {
  switch (command) {
    case 'exec':
      exec(args)
  }
}

module.exports = (config, register) => {
  register(fn)
}
