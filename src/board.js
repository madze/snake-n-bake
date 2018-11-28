(function(board) {
  const util =require('util')
  const utils = require('./utils')
  
  
  board.parse = (game) => {
    try{
      console.log('---------- TURN: ', game.turn, ' \'', game.you.name, '\' Snake - HEALTH: ', game.you.health, ' - LENGTH: ', game.you.body.length, ' ---------');
      
      console.log('board.parse - beginning with state: ', util.inspect(game, {depth:5}));
      
      game.boardArry = []
  
      for(let i = 0; i < game.board.height; i++) {
        game.boardArry.push(rowGen())
      }
  
      game.points = []
      const food = board.parseFood(game)
      //console.log('board.parse - food: ', food);
      const bake = board.parseBake(game)
      //console.log('board.parse - bake: ', bake);
      const snakes = board.parseSnakes(game)
      //console.log('board.parse - snakes: ', snakes);
      game.points = game.points.concat(food)
      game.points = game.points.concat(bake)
      game.points = game.points.concat(snakes)
  
      //console.log('board.parse - points: ', util.inspect(points, {depth:3}));
  
      game.points.forEach((point) => {
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
        return game.boardArry[point.y][point.x] = marker
      })
  
      console.dir(game.boardArry);
  
      game.you.head = game.you.body[0]
      
      return game
      
      
      function rowGen() {
        let boardRow = []
        for(let i = 0; i < game.board.width; i ++) {
          boardRow.push(0)
        }
        return boardRow
      }
      
    } catch (err) {
      console.error('board.parse top level error: ', err);
    }
  }
  
  board.parseFood = (game) => {
    if(!game.board.food) return []
    return game.board.food.map((f) => {
      f.type = 'food'
      f.meal = true
      return f
    })
  }
  
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
  
})(module.exports)