(function(weights) {
  const utils = require('./utils')
  
  //these are the algorithms we use to calculate our weights - priority will be given to higher numbers
  
  //returns current food weights
  weights.food = (move, game) => {
    try{
      const health = game.you.health
      const max = utils.longest(game)
      
      const hW = utils.reverseInt(1, 100, health);
      
      const fW = utils.reverseInt(1, max, move.spaces)
      
      return hW + fW
    } catch (err) {
      console.error('snake foodWeight - error: ', err);
    }
  }
  
  //returns current meal weights
  weights.meals = (move, game) => {
    try{
      const max = utils.longest(game)
      let score = utils.reverseInt(1, max, move.spaces)
      return score
    } catch (err) {
      console.error('weights.meals - error: ', err);
    }
  }
  
  weights.tail = (move, game) => {
    try{
      const max = utils.longest(game)
      let score = move.spaces
      return score
    } catch (err) {
      console.error('weights.tail - error: ', err);
    }
  }
  
  
})( module.exports)