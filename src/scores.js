(function(scores) {
  const utils = require('./utils')
  const path = require('./path')
  
  //these are the algorithms we use to calculate our scores - priority will be given to higher numbers
  
  //returns current food scores
  scores.food = (move, game) => {
    try{
      const health = game.you.health
      const max = utils.longest(game)
      
      const hW = utils.reverseInt(1, 100, health)
      
      const fW = utils.reverseInt(1, max, move.spaces)
      
      if(health <= move.spaces) return 1000000000
      
      return hW + fW
    } catch (err) {
      console.error('snake foodWeight - error: ', err);
    }
  }
  
  //returns current meal scores
  scores.meals = (move, game) => {
    try{
      const max = utils.longest(game)
      let score = utils.reverseInt(1, max, move.spaces)
      return score
    } catch (err) {
      console.error('scores.meals - error: ', err);
    }
  }
  
  
  scores.tail = (move, game) => {
    try{
      const max = utils.longest(game)
      let score = move.spaces
      return score
    } catch (err) {
      console.error('weights.tail - error: ', err);
    }
  }
  
  
})( module.exports)