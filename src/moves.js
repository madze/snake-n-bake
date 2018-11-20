(function(moves) {
  const path = require('./path')
  const weights = require('./weights')
  const debug = require('./debug-settings')
  
  //This is our default move this turn (will do this if can't find any other options)
  const defaultMove = (snake, game) => {
    //TODO: maybe chase tail?
    
    return {dir: snake.straight, type: "default"}
  }
  
  //This parses moves based on direction and assigns them to choices accordingly
  const parsePathsFromMoves = (moves, choices) => {
    try{
      debug.log(4,'moves.parsePathsFromMoves - beginning with moves: ', moves, ' and choices: ', choices);
      if(!moves || moves.length === 0) return;
      
      moves.forEach((move) => {
        debug.log('move: ', move);
        choices[move.dir].push(move)
      })
      
      debug.log(3,'moves.parsePathsFromMoves - finished with choices: ', choices);
    } catch (err) {
      console.error('moves.parsePathsFromMoves - error: ', err);
    }
  }
  
  //returns the obs in a single direction that is 1 space away
  const willCollide = (obs) => {
    if(!obs || obs.length === 0) return false
    return !!obs.find((o) => o.spaces === 1)
  }
  
  //returns one move from all four direction path arrays
  const getBestMoveFromChoices = (moves, wts, snake, game) => {
    debug.log(5,'moves getBestMoveFromChoices - beginning with moves: ', moves);
    debug.log(5,'moves getBestMoveFromChoices - beginning with weights: ', wts);
    
    try{
      
      // 1. remove any choices that are immediate collisions
      let filteredMoves = moves.filter((move) => {
        let obs = getObsByDir(move.dir)
        return !willCollide(obs) && move.dir !== snake.neck.dir
      })
  
      debug.log(4,'moves getBestMoveFromChoices - moves after collision assessment: ', filteredMoves);
  
      // 2. narrow each remaining choice to just one
      let finalMove = filteredMoves.reduce((prev, curr) => {
        return calcScore(curr).score > prev.score ? curr : prev
      })
      
      function getObsByDir(dir) {
        return snake.obs.filter((o) => o.dir === dir)
      }
      
      function calcScore(move) {
        move.score = weights.weightCalc(move, wts, getObsByDir(move.dir), game)
        return move
      }
      
      if(!finalMove && !finalMove.dir) finalMove = defaultMove(snake, game)
      
      debug.log(2,'moves getBestMoveFromChoices - final move: ', finalMove);
  
      return {
        move: finalMove.dir
      }
    } catch (err) {
      console.error('moves getBestMoveFromChoices - error: ', err);
    }
    
  }
  
  const getWeights = (snake, game) => {
    return {
      food: weights.food(snake, game),
      meal: weights.meals(snake, game),
      threat: weights.threats(snake, game)
    }
  }
  
  
  
  exports.calculate = (snake, game) => {
    try{
      // 1. get an array of possible moves in each direction based on: food, meals, and threats
      let wts = getWeights(snake, game)
      
      debug.log(2, 'moves.calculate - weights: ', wts)
      
      // 1. pick one move based on various criteria
      let finalMove = getBestMoveFromChoices(snake.moves, wts, snake, game)
      
      debug.log(2,'moves.calculate - final move is: ', finalMove);
      
      return finalMove
      
    } catch (err) {
      console.error('moves.calculate : ', err);
    }
  }
  
})( module.exports)