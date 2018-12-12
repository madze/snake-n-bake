(function(snake) {
  const utils = require('./utils')
  const board = require('./board')
  const path = require('./path')
  const moves = require('./moves')
  
  //returns our snake
  snake.bake = (game) => {
    try{
      let color = '#ff8cb0'
      if(game.you.name === 'smurf') color = '#119cf3'
      if(game.you.name === 'kermit') color = '#4eb457'
      if(game.you.name === 'prince') color = '#6e1eb4'
      if(game.you.name === 'red') color = '#b42120'
      return {
        color: color,
        head_type: 'safe',
        tail_type: 'freckled'
      }
    } catch (err) {
      console.error('snake.bake - Error: ', err)
    }
  }
  
  //Returns next snake move
  snake.slither = (game) => {
    try{
      console.log('snake.slither - beginning move calculations');
      return moves.getMove(game)
    } catch (err) {
      console.error('snake.slither - error: ', err);
    }
  }
  
})( module.exports)