const ensnare = require('./ensnare')
const kill = require('./kill')
const feed = require('./feed')
const explore = require('./explore')
const tailchase = require('./tailchase')

module.exports = () => {
  const modes = {
    //goes through the modesOrdered array and 
    getMode: (modesOrdered, options) => {
      const exclude = options && options.exclude ? options.exclude : []
      exclude.push('getMode')
      let modeName = Object.keys(modes)
      .filter((prop) => !exclude.includes(prop))

      

    },
    python: ensnare(arguments),
    kill: kill(arguments),
    feed: feed(arguments),
    explore: explore(arguments),
    tailchase: tailchase(arguments)
  }

  return modes
}