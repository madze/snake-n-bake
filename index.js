console.log('starting up...');
const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const snake = require('./src/snake')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')
https://git.heroku.com/trowzersnake.git


// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (req, res) => {
  // NOTE: Do something here to start the game
  
  console.log('game starting with data: ', req.body);
  // Response data
  const data = snake.trowzer();

  return res.json(data)
})

// Handle POST request to '/move'
app.post('/move', (req, res) => {
  // NOTE: Do something here to generate your move
  console.log('movement request coming in with data: ', req.body);
  // Response data
  const game = req.body;
  const data = snake.getMove(game)

  return res.status(200).json(data)
})

app.post('/end', (req, res) => {
  // NOTE: Do something to end the game
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
