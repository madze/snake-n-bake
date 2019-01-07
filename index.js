const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

const boardState = require('./src/modules/boardState')
const Snake = require('./src/models/Snake')
const brain = require('./src/brain')

//https://git.heroku.com/trowzersnake.git

console.log( 'shake-n-bake getting high...')
// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

app.post('/start', (req, res) => {
  try{
    console.log('GAME START')
    let gameState = boardState.visualize(req.body,{
      addBoard:true,
      addPoints: true
    })
    const snake = new Snake(gameState)
    const bake = snake.bake
    console.log('Our snake: ', bake)

    return res.json(bake)
    
  } catch (err) {
    console.error('GAME START - Error: ', err);
    return res.status(500)
  }
})

app.post('/move', (req, res) => {
  try{
    console.log('GAME MOVE')
    let gameState = boardState.visualize(req.body,{
      addBoard:true,
      addPoints: true
    })
    const snake = new Snake(gameState)

    const nextMove = brain.getMove(snake, gameState)

    console.log('CHOSEN MOVE: ', nextMove)
    return res.json(nextMove)
    
  } catch (err) {
    console.error('GAME MOVE - Error: ', err);
    return res.status(500)
  }
})

app.post('/end', (req, res) => {
  console.log('GAME END')
  // NOTE: Do something to end the game
})

app.post('/ping', (req, res) => {
  console.log('PING')
  // Used for checking if this snake is still alive.
  return res.json({});
})

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log( 'Server listening on port %s', app.get('port'))
})
