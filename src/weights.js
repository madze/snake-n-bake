(function(weights) {
  const utils = require('./utils')
  const debug = require('./debug-settings')
  
  //these are the algorithms we use to calculate our weights - priority will be given to higher numbers
  
  //returns current food weights
  exports.food = (snake, game) => {
    try{
      debug.log(3, 'weights.food - health is: ', snake.health)
      const health = snake.health
      const food = snake.moves.filter((move) => move.type === "food")
      const max = utils.longest(game)
      
      const hW = utils.reverseInt(1, max, Math.floor(health / (100/max)));
      
      if(!food || food.length === 0) return 1
      let raw = food.map((f) => f.spaces).reduce((a, b) => a + b, 0)
      
      debug.log(3, 'weights.food - raw score: ', raw)
      if(raw >= max) return 1
      const fW = utils.reverseInt(1, max, raw)
      
      return (hW + fW) / 2;
    } catch (err) {
      console.error('snake foodWeight - error: ', err);
    }
  }
  
  //returns current threat weights
  exports.threats = (snake, game) => {
    try{
      const threats = snake.threats
      const max = utils.longest(game)
      if(!threats || threats.length === 0) return 2
      
      debug.log(4,'weights.threats - threats: ', threats)
      
      let score = utils.reverseInt(1, max, threats.spaces)
      
      return score && score > 2 ? score : 2 //we give threats a higher default priority
    } catch (err) {
      console.error('weights.threats - error: ', err);
    }
  }
  
  //returns current meal weights
  exports.meals = (snake, game) => {
    try{
      const meals = snake.moves.filter((move) => move.type === "meal")
      const max = utils.longest(game)
      if(!meals || meals.length === 0) return 1
      
      debug.log(4,'weights.meals - beginning with meals: ', meals)
      let raw = meals.map((meal) => meal.spaces).reduce((a, b) => a + b, 0)
      debug.log(3,'weights.meals - calculated raw score: ', raw);
      if(raw >= max) return 1
      return utils.reverseInt(1, max, raw)
    } catch (err) {
      console.error('weights.meals - error: ', err);
    }
  }
  
  //returns a score based on weights and potential collisions
  exports.weightCalc = (move, weights, obs, game) => {
    try{
      debug.log(2, 'weights.weightCalc - weights are: ', weights)
      debug.log(4,'weights.weightCalc - beginning with: ', weights, ' and move: ', move);
      
      const thisWeight = weights[move.type]
  
      debug.log(5,'weights.weightCalc - thisWeight: ', thisWeight);
      
      if(!obs || obs.length === 0) return thisWeight
  
      const max = utils.longest(game)
      
      const obsWeight = obs.reduce((prevO, currO) => {
        //reduce this based on number of obs on this path and proximity
        currO.score = (utils.reverseInt(1, max, currO.spaces)) + obs.length
        return currO.score > prevO.score ? currO : prevO
      })
  
      return thisWeight + obsWeight
      
    } catch (err) {
      console.error('weights.weightCalc - error: ', err);
    }
  }
  
})( module.exports)