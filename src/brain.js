const brain = module.exports
const path = require('./path')
const mode = require('./modes')
const score = require('./score')
const utils = require('./utils')

/**
 * Returns the next move (should probably be called by index.js)
 */
brain.getMove = (snake, gameState) => {
  try {
    const boardWidth = gameState.board.width
    const boardHeight = gameState.board.height

    let options = {}

    //These are all of the directions we can go that do not have an obstical or wall in them
    options.immediatelyClearDirs = path.getImmediatelyClearDirs(snake, boardWidth, boardHeight)

    //This should have info about the most open space we can move into
    options.openSpace = path.getMostOpenSpace(snake)

    //This should be all the food points that are safest to head for
    //TODO: sort these by level safety?
    options.bestFood = snake.food && snake.food.filter((point) => {
      return options.immediatelyClearDirs.includes(point.dir) && 
      !path.isTrap(snake.head, point.dir, snake.obs, boardWidth, boardHeight)
    })

    //This should be any meal snakes that are pretty safe to kill
    options.bestMealSnakes =  snake.mealSnakes && snake.mealSnakes.filter((point) => {
      return options.immediatelyClearDirs.includes(point.dir) && 
      !path.isTrap(snake.head, point.dir, snake.obs, boardWidth, boardHeight)
    })

    //This should be the path to our own tail
    options.ourTailMove = snake.tail.reduce((a,b) => {
      return options.immediatelyClearDirs.includes(a.dir) && !path.isTrap(snake.head, a.dir, snake.obs, boardWidth, boardHeight) ? a : b
    })
    if(!options.immediatelyClearDirs.includes(options.ourTailMove.dir)) options.ourTailMove = null

    //Get the mode our snake wants to go with for this turn
    const chosenMode = score.getHighest(snake, boardWidth, boardHeight, options)

    const modes = mode(snake, gameState)

    //get a move direction from our chosen mode
    let move = modes[chosenMode](options)

    console.log('brain.getMove - move returned from mode: ', move)

    let moveDir = move && move.dir ? move.dir : move

    //our fallback in case a mode errors or doesn't return a valid move
    //TODO: choose then runner up mode and then the runner up to that one, etc.
    if(!moveDir) moveDir = options.openSpace && options.openSpace.dirs && options.openSpace.dirs[utils.randomInt(options.openSpace.dirs.length)]

    //this should never happen
    if(!moveDir) moveDir = options.immediatelyClearDirs[utils.randomInt(options.immediatelyClearDirs.length)]

    return {
      move: moveDir
    }
  } catch (err) {
    console.error('brain.getMove - error: ', err)


  }
}