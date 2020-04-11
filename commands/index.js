module.exports = (client, _c) => {
  const rawCategories = _c.map(v => require(`./${v}`))
  const categories = rawCategories.map(v => new Category(client, v))
  return new Categories(categories)
}

const getCommands = (client, rawCommands) => {
  const commands = new Map()
  Object.values(rawCommands).forEach(RawCommand => {
    const command = new RawCommand(client, client.db)
    console.log(`=========================
* name | ${command.name}
* alias | [${command.alias.join(', ')}]`)
    command.alias.forEach(alias => commands.set(alias, command))
  })
  console.log(`=========================`)

  return commands
}

class Categories {
  constructor (categories) {
    this.categories = Categories
    this.commands = categories.map(v => v.commands).reduce(
      (pre, cur) => new Map([...pre].concat([...cur]))
    )
  }
}

class Category {
  constructor (client, category) {
    this.name = category.name
    this.commands = getCommands(client, category.commands)

    Object.values(this.commands).forEach(command => {
      Object.keys(category.override).forEach(key => {
        command[key] = category.override[key]
      })
    })
  }
}
