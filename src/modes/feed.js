/**
 * This mode is for feeding on the nearest food
 */

 const utils = require('../utils')

module.exports = (snake, gameState) => {
  return (options) => {
    try {
      console.log('MODE - Feed...')

      const bestFood = options.bestFood ? options.bestFood : []

      if(!bestFood || bestFood.length === 0) return null

      let move = bestFood.find(point => options.openSpace.dirs.some(dir => dir === point.dir))

      if(!move) move = bestFood[utils.randomInt(bestFood.length)]

      return move
    } catch (err) {
      console.error('mode.feed - error: ', err)
      return null
    }
  }
}