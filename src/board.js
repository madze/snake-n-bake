(function(board) {
  const util =require('util')
  const utils = require('./utils')
  
  //returns the game object with parsed data attached
  board.parse = (game) => {
    try{
      console.log('---------- TURN: ', game.turn, ' \'', game.you.name, '\' Snake - HEALTH: ', game.you.health, ' - LENGTH: ', game.you.body.length, ' ---------');
      
      console.log('board.parse - beginning with state: ', util.inspect(game, {depth:5}));
  
      game.points = []
      const food = board.parseFood(game)
      //console.log('board.parse - food: ', food);
      const bake = board.parseBake(game)
      //console.log('board.parse - bake: ', bake);
      const snakes = board.parseSnakes(game)
      //console.log('board.parse - snakes: ', snakes);
      game.points = game.points.concat(food).concat(bake).concat(snakes)
  
      //console.log('board.parse - points: ', util.inspect(points, {depth:3}));
      let boardArry = createBoardMapArray(game.points, game.board.height, game.board.width)
      
      console.dir(boardArry);
  
      game.you.head = game.you.body[0]
      
      return game
      
    } catch (err) {
      console.error('board.parse - error: ', err);
    }
  }
  
  //returns an array of points representing either food or snakes that can be eaten
  board.parseFood = (game) => {
    if(!game.board.food) return []
    return game.board.food.map((f) => {
      f.type = 'food'
      f.meal = true
      return f
    })
  }
  
  //returns an array of points representing all other snake segments on the board that we might be able to collide with
  board.parseSnakes = (game) => {
    const snakes = []
    if(!game.board.snakes) return []
    
    game.board.snakes.forEach((snake, index) => {
      if(snake.id === game.you.id) return
      snake.body.forEach((seg, i) => {
        seg.type = 'snake'
        seg.obs = true
        if(i === 0) {
          seg.part = 'head'
          if(snake.body.length < game.you.body.length) seg.meal  = true
        }
        return snakes.push(seg)
      })
    })
    
    return snakes.reverse()
  }
  
  //returns an array of points representing our snake
  board.parseBake = (game) => {
    return game.you.body.map((seg, i) => {
      if(i === 0) {
        seg.part = 'head'
      } else if(i === game.you.body.length - 1){
        seg.part = 'tail'
        seg.meal = true
      } else {
        seg.obs = true
      }
      seg.type = 'you'
      return seg
    }).reverse()
    
  }
  
  function parseArry (arry, type) {
    if (!arry) return []
    return arry.map((item) => {
      item.type = type
      return item
    })
  }
  
  //returns an array map of current game state for logging to console
  function createBoardMapArray(points, height, width) {
    try{
      arry = []
  
      for(let i = 0; i < height; i++) {
        arry.push(rowGen())
      }
  
      points.forEach((point) => {
        let marker;
        if(point.type === 'food') {
          marker = 4
        } else if (point.type === 'you') {
          if(point.part === 'head') {
            marker = 1
          } else {
            marker = 5
          }
        } else if (point.type === 'snake') {
          if(point.part === 'head') {
            if(point.meal) {
              marker = 2
            } else {
              marker = 3
            }
          } else {
            marker = 5
          }
        }
        return arry[point.y][point.x] = marker
      })
  
      function rowGen() {
        let boardRow = []
        for(let i = 0; i < width; i ++) {
          boardRow.push(0)
        }
        return boardRow
      }
  
      return arry
    } catch (err) {
      console.error('board createBoardMapArray - error: ', err);
    }
  }
  
})(module.exports)