const { Client } = require('huejay')
const { without, keys, clamp } = require('ramda')

module.exports = (config, register) => {
  const client = new Client({
    host: config.host,
    username: config.username
  })

  const getGroupByName = name => {
    return client.groups.getAll().then(groups => {
      for (const group of groups) {
        if (group.name === name) return group
      }
      console.error(`Warning: No group with name ${name} was found`)
    })
  }

  const fn = (command, args) => {
    switch (command) {
      case 'SetGroupState':
        getGroupByName(args.name).then(group => {
          for (const key of without(['name'], keys(args))) {
            group[key] = args[key]
          }
          return client.groups.save(group)
        })
        break
      case 'IncrementGroupBrightness':
        client.groups.getById(args.id).then(group => {
          group.brightness = clamp(0, 255, group.brightness + args.step)
          group.on = true
          group.transitionTime = 0.5

          return client.groups.save(group)
        })
        break
      case 'ToggleGroup':
        client.groups.getById(args.id).then(group => {
          group.on = !group.on
          group.transitionTime = 0.5
          if (group.on) group.brightness = 255

          return client.groups.save(group)
        })
        break
    }
  }

  register(fn)
}
