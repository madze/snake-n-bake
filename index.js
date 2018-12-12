const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const snake = require('./src/snake')
const app = express()
const util = require('util')
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')
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
    console.log('game starting with data: ', util.inspect(req.body, {depth:10}));
    // Response data
    const data = snake.bake(req.body)
  
    console.log('Our snake at start: ', util.inspect(data))
  
    return res.status(200).json(data)
    
  } catch (err) {
    console.error('GAME START - Error: ', err);
    return res.status(500)
  }
})

app.post('/move', (req, res) => {
  try{
    console.log('movement request coming in for turn: ', req.body.turn);
    // Response data
    const game = req.body;
    const data = snake.slither(game)
    console.log('move is: ', data);
    return res.status(200).json(data)
    
  } catch (err) {
    console.error('GAME MOVE - Error: ', err);
    return res.status(500)
  }
})

app.post('/end', (req, res) => {
  // NOTE: Do something to end the game
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log( 'Server listening on port %s', app.get('port'))
})
