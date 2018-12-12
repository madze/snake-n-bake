(function(moves) {
  const board = require('./board')
  const boardState = require('boardstate')
  const util = require('util')
  const utils = require('./utils')
  const path = require('./path')
  const scores = require('./scores')
  const defaultMove = (game) => {
    //TODO: maybe chase tail?
    if(game.straight) {
      return {
        dir: game.straight,
        type: "straight"
      }
    }
  }
  
  //returns a move after calculations
  moves.getMove = (game) => {
    try{
      visualizerOptions = {
        showMySnake: true,
        showBoard: true,
        addPoints: true
      };
      game = boardState.visualize(game,visualizerOptions)
      console.log('game: ', game);
      game.points = game.parsedBoardPoints
      
      game.you.head = game.you.body[0]
      
      game.straight = getStraight(game)
      
      const allMoves = parsePoints(game.you.head, game.points.filter((point) => point.meal))
      //console.log('moves.getMove - moves: ', allMoves)
      const defaultMoves = ["up", "left","down", "right"].map((dir) => {
        return utils.createDefaultMove(dir,"default")
      })
      //console.log('moves.getMove - default moves: ', defaultMoves);
      const movesForConsideration = allMoves.concat(defaultMoves)
      console.log('moves.getMove - allMoves: ', util.inspect(movesForConsideration));
      const allObs = parsePoints(
        game.you.head,
        game.points.filter((point) => point.isCollision)).filter((obs) => obs.spaces > 0,
        true)
      console.log('moves.getMove - obs: ', util.inspect(allObs,{depth:5}));
      const bestMove =  getBest(movesForConsideration, allObs, game)
      console.log('moves.getMove - BEST MOVE: ', bestMove);
      return {
        move: bestMove.dir
      }
    } catch (err) {
      console.error('moves.getMove - error: ', err);
    }
  }
  
  //returns a path object for continuing in the same direction
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
  
  //returns a path object for the best move after filtering and scoring
  function getBest(moves, obs, game) {
    try{
      moves = moves.filter((move) => {
        return !willCollide(move, obs, game)
      })
      
      if(!moves || moves.length === 0) {
        moves = [getOpenMove(obs, game)]
        console.log('open moves: ', moves);
        if(!moves[0].dir) {
          console.warn('KABLOOIE!!!');
          return {dir:"down"}
        }
      }
      if(moves.length === 1) return moves[0]
      console.log('FIND SCORE OUT OF: ', moves);
      
      return moves.reduce((prev, curr) => {
    
        curr.score = getScore(curr, obs, game)
    
        return curr.score > prev.score ? curr : prev
      })
    } catch (err) {
      console.error('moves getBest - error: ', err);
    }
  }
  
  //returns any open spaces to move to
  function getOpenMove(obs, game) {
    let move = {
      type: 'default',
      spaces: 1
    }
    
    if(isPointOpen('up')) move.dir = 'up'
    if(isPointOpen('right')) move.dir = 'right'
    if(isPointOpen('down')) move.dir = 'down'
    if(isPointOpen('left')) move.dir = 'left'
    
    return move
    
    function isPointOpen(dir) {
      return obs.filter((o) => o.dir === dir && o.spaces === 1).length === 0 && !isWallCollision(dir, game)
    }
  }
  
  //returns a score for a given path object
  function getScore(move, obs, game) {
    try{
      let rawScore = 1
      let name = move.type
  
      if(move.type === 'food') {
        rawScore = scores.food(move, game)
      } else if (move.type === 'snake'){
        rawScore = scores.meals(move, game)
      } else if (move.type === 'straight'){
      
      } else if (move.part === 'tail'){
        name = move.part
        rawScore = scores.tail(move, game)
      }
      
      console.log(name, ' - SCORE: ', rawScore);
  
      return rawScore
    } catch (err) {
      console.error('moves getScore - error: ', err);
    }
    
  }
  
  //returns boolean for filtering a path object based on immediate collision potential
  function willCollide(move, obs, game) {
    try{
      console.log('MOVE TYPE: ', move.type)
      let isTrap = path.isTrap(game.you.head, move.dir, obs, game.board.width, game.board.height)
      console.log('IS TRAP: ', isTrap)
      let isBad = obs.filter((o) => (o.spaces === 1 && o.dir === move.dir) || (o.part === 'neck' && o.dir === move.dir)).length > 0
      console.log('IS BAD: ', isBad)
      let isWall = isWallCollision(move.dir, game)
      console.log('IS WALL: ', isWall)
      let collision = isBad || isWall || isTrap
      //console.log('moves willCollide - collision? ', collision, ' move dir: ', move.dir);
      return collision
    } catch (err) {
      console.error('moves willCollide - error: ', err);
    }
  }
  
  //returns an array of modified path obejcts with additional data attached
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
  
  //returns boolean for filtering a path object based on immediate wall collision potential
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