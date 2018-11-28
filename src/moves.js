(function(moves) {
  const board = require('./board')
  const util = require('util')
  const utils = require('./utils')
  const path = require('./path')
  const weights = require('./weights')
  const defaultMove = (game) => {
    //TODO: maybe chase tail?
    if(game.straight) {
      return {
        dir: game.straight,
        type: "straight"
      }
    }
  }
  
  moves.getMove = (game) => {
    try{
      game = board.parse(game)
      
      game.straight = getStraight(game)
      
      const allMoves = parsePoints(game.you.head, game.points.filter((point) => point.meal))
      //console.log('moves.getMove - moves: ', allMoves)
      const defaultMoves = ["up", "left","down", "right"].map((dir) => {
        return utils.createDefaultMove(dir,"default")
      })
      //console.log('moves.getMove - default moves: ', defaultMoves);
      const movesForConsideration = allMoves.concat(defaultMoves)
      console.log('moves.getMove - allMoves: ', movesForConsideration);
      const allObs = parsePoints(
        game.you.head,
        game.points.filter((point) => point.obs)).filter((obs) => obs.spaces > 0,
        true)
      console.log('moves.getMove - obs: ', allObs);
      const bestMove =  getBest(movesForConsideration, allObs, game)
      console.log('moves.getMove - BEST MOVE: ', bestMove);
      return {
        move: bestMove.dir
      }
    } catch (err) {
      console.error('moves.getMove - error: ', err);
    }
  }
  
  function getStraight(game) {
    let head = game.you.head
    let neck = game.you.body[1]
    if(neck.x === head.x && neck.y === head.y) return
    let straight = {type:"straight"}
    
    if(neck.x > head.x) {
      straight.dir = "left"
    } else if (neck.y > head.y){
      straight.dir = "up"
    } else if (neck.x < head.x) {
      straight.dir = "right"
    } else {
      straight.dir = "down"
    }
    return straight
  }
  
  
  function getBest(moves, obs, game) {
    try{
      moves = moves.filter((move) => {
        return !willCollide(move, obs, game)
      })
      
      if(!moves || moves.length === 0) {
        console.warn('NOOOOOO!!!!! KABLOOIE!!');
        return {dir:"down"}
      }
      console.log('FIND SCORE OUT OF: ', moves);
      moves[0].score = getScore(moves[0], obs, game)
      return moves.reduce((prev, curr) => {
    
        curr.score = getScore(curr, obs, game)
    
        return curr.score > prev.score ? curr : prev
      })
    } catch (err) {
      console.error('moves getBest - error: ', err);
    }
  }
  
  function getScore(move, obs, game) {
    try{
      let rawScore = 1
      let name = move.type
  
      if(move.type === 'food') {
        rawScore = weights.food(move, game)
      } else if (move.type === 'snake'){
        rawScore = weights.meals(move, game)
      } else if (move.type === 'straight'){
      
      } else if (move.part === 'tail'){
        name = move.part
        //rawScore = weights.tail(move, game)
      }
      
      console.log(name, ' - SCORE: ', rawScore);
  
      return rawScore
    } catch (err) {
      console.error('moves getScore - error: ', err);
    }
    
  }
  
  function willCollide(move, obs, game) {
    try{
      console.log('MOVE TYPE: ', move.type)
      let isTrap = path.isTrap(game.you.head, move.dir, obs, game.board.width, game.board.height)
      console.log('IS TRAP: ', isTrap);
      let isBad = obs.filter((o) => o.spaces === 1 && o.dir === move.dir).length > 0
      console.log('IS BAD: ', isBad);
      let isWall = isWallCollision(move.dir, game)
      console.log('IS WALL: ', isWall);
      let collision = isBad || isWall || isTrap
      //console.log('moves willCollide - collision? ', collision, ' move dir: ', move.dir);
      return collision
    } catch (err) {
      console.error('moves willCollide - error: ', err);
    }
  }
  
  function parsePoints(from, points, getShorter) {
    try{
      //console.log('moves parsePoints - points length: ', points && points.length);
      let result = []
      if(!points || points.length === 0) return result
      
      points.forEach((move) => {
        let dirs = path.getPaths(from, move, getShorter)
        //console.log('moves parsePoints - parsed path: ', dirs);
        if(dirs.length > 1 && !move.obs) {
          dirs.forEach((dir) => {
            newMove = Object.assign(dir, move)
            result.push(newMove)
          })
        } else {
          move.dir = dirs[0].dir
          move.spaces = dirs[0].spaces
          result.push(move)
        }
      })
  
      return result.sort((a,b) => {
        if(a.spaces > b.spaces) return 1
        if(a.spaces < b.spaces) return -1
        return 0
      })
    } catch (err) {
      console.error('moves parsePoints - error: ', err);
    }
  }
  
  function isWallCollision(dir, game) {
    try{
      return dir === "up" && game.you.head.y === 0 ||
        dir === "right" && game.you.head.x === game.board.width - 1 ||
        dir === "down" && game.you.head.y === game.board.height - 1 ||
        dir === "left" && game.you.head.x === 0
    } catch (err) {
      console.error('moves isWallCollision - error: ', err);
    }
  }
  
})( module.exports)