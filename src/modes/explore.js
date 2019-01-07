/**
 * This mode is for moving into open areas (probably a good default move)
 */

 const utils = require('../utils')
module.exports = (snake, gameState) => {
  return (options) => {
    try {
      console.log('MODE - explore!')
      const openDirs = options.openSpace && options.openSpace.dirs

      console.log('mode.explore - Open dirs: ')
      console.dir(openDirs)


      if(!openDirs) return null

      let move = options.openSpace.dirs[utils.randomInt(options.openSpace.dirs.length)]

      if(!move) return null
    } catch (err) {
      console.error('mode.explore - error: ', err)
      return null
    }
  }
}