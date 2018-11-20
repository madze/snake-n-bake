(function(snake) {
  const utils = require('./utils')
  const path = require('./path')
  const moves = require('./moves')
  const debug = require('./debug-settings')
  
  //returns our snake
  exports.bake = () => {
    return {
      color: '#ff8cb0',
      secondary_color: '#119cf3',
      name: "snake-n-bake",
      taunt: "..huh..?",
      head_type: 'safe',
      tail_type: 'freckled'
    }
  }
  
  //returns our snake from current game state
  const getEgg = function(game) {
    
    let snake = game.you
    
    return snake
  }
  
  //returns the head of a snake
  const head = (snake) => {
    return snake.body.data[0]
  }
  
  //returns all segments of snake except for head, neck and first body segment (because we can't collide with this segment)
  const segments = (snake) => {
    debug.log(4, 'snake segments - snake.body.data: ', snake.body.data)
    return snake.body.data.slice(3)
  }
  
  //returns first segment after head
  const neck = (snake) => {
    let neck = snake.body.data[1]
    neck.dir = dir()
    return neck
    
    function dir() {
      if(snake.head.x === neck.x) {
        if(snake.head.y > neck.y) {
          return "down"
        } else {
          return "up"
        }
      } else {
        if(snake.head.x > neck.x) {
          return "left"
        } else {
          return "right"
        }
      }
    }
  }
  
  //returns best path to get to tail and how many spaces away tail is
  const tail = (head, body, game) => {
    try{
      const tail = body.data[body.data.length -1]
      return path.getDirection(head, tail, "tail");
    } catch (err) {
      console.error('snake tail - error: ', err);
    }
  }
  
  //returns path for next move that would be in a straight line from last move
  const straight = (snake) => {
    if(snake.neck.x > snake.head.x) {
      return "left"
    }
    if(snake.neck.y > snake.head.y) {
      return "down"
    }
    if(snake.neck.x === snake.head.x) {
      return "up"
    }
    return "right"
  }
  
  //returns paths to food
  const foods = (snake, game) => {
    try{
      debug.log(4,'snake foods - beginning with food: ', game.food.data)
      
      game.food.data.map((food) => {
        
        debug.log(4,'snake foods - food before conversion: ', food);
        return path.getDirection(snake.head, food, "food")
      }).forEach((food) => {
        if(!food) return
        if(Array.isArray(food)) {
          food.forEach((f) => {
            snake.moves.push(f)
          })
        } else {
          snake.moves.push(food)
        }
      })
  
      debug.log(3,'snake foods - moves: ', snake.moves);
      
    } catch (err) {
      console.error('snake food - error: ', err);
    }
  }
  
  //returns paths to obstacles
  const obs = (snake, game) => {
    try{
      const closestWalls = path.closestWalls(snake.head, game)
      debug.log(5,'snake obs - closest walls: ', closestWalls)
      const allSnakeCoords = exports.getAllSnakeCoords(snake, game)
      debug.log(5,'snake obs - all obs coords: ', allSnakeCoords)
      snake.obs = path.getAllInFourLines(snake.head, allSnakeCoords, "snake")
      debug.log(5,'snake obs - obs: ', snake.obs);
      if(!snake.obs) snake.obs = []
      snake.obs.push(closestWalls.x)
      snake.obs.push(closestWalls.y)
      
      debug.log(3,'snake obs - obs: ', snake.obs);
    } catch (err) {
      console.error('snake obs - error: ', err);
    }
  }
  
  //returns paths to snake heads that are shorter than us
  const meals = (snake, game) => {
    try{
      debug.log(4,'snake meals - beginning with snakes: ', game.snakes.data, ' and snake: ', snake);
      game.snakes.data.filter((meal) => {
        return meal.length < snake.length
      }).map((meal) => {
        debug.log(4,'snake meals - meal snake before conversion: ', meal);
        return path.getDirection(snake.head, meal.body.data[0], "meal")
      }).forEach((meal) => {
        if(!meal) return
        if(Array.isArray(meal)) {
          meal.forEach((m) => {
            snake.moves.push(m)
          })
        } else {
          snake.moves.push(meal)
        }
      });
      debug.log(3,'snake meals - moves: ', snake.moves)
    } catch (err) {
      console.error('snake meals - error: ', err);
    }
  }
  
  //returns paths to snake heads that are longer than us
  const threats = (snake, game) => {
    try{
      snake.threats = []
      
      game.snakes.data.filter((threat) => {
        return threat.length > snake.length
      }).map((threat) => {
        debug.log(4,'snake threats - threat snake: ', threat);
        return path.getDirection(snake.head, threat.body.data[0], "threat")
      }).forEach((t) => {
        if(!t) return
        if(Array.isArray(t)) {
          snake.threats.push(t)
        } else {
          snake.threats.push(t)
        }
      })
      
      debug.log(3,'snake threats - threats: ', snake.threats)
    } catch (err) {
      console.error('snake threats - error: ', err);
    }
  }
  
  //returns all coords of snakes in the game
  exports.getAllSnakeCoords = (snake, game) => {
    try{
      debug.log(5,'snake.allObsCoords - segments: ', snake.segments);
      debug.log(5,'snake.allObsCoords - other snakes: ', game.snakes.data);
      const allObs = []
  
      //get other snake coords
      game.snakes.data.forEach((snake) => {
        snake.body.data.forEach((segment) => {
          send(segment, "snake")
        })
      })
  
      //get our snake coords
      if(snake.segments && snake.segments.length > 0) {
        snake.segments.forEach((segment) => {
          send(segment, "you")
        })
      }
  
      function send(segment, type) {
        let result = {x:segment.x, y:segment.y}
        result.type = type
        allObs.push(result)
        debug.log(3,'snake.allObsCoords - send - allObs: ', allObs);
      }
      return allObs
    } catch (err) {
      console.error('snake.getAllSnakeCoords - error: ', err);
    }
    
  }
  
  //returns snake with additional useful data for consumption
  const hatch = (game) => {
    try{
      let snake = getEgg(game)
      snake.head = head(snake)
      snake.segments = segments(snake)
      snake.neck = neck(snake)
      snake.straight = straight(snake)
      snake.tail = tail(snake.head, snake.body, game)
      snake.moves = []
      debug.log(4,'snake hatch - segments: ', snake.segments)
      obs(snake, game)
      threats(snake, game)
      foods(snake, game)
      meals(snake, game)
  
      debug.log(2,'snake hatch - snake: ', snake)
      return snake
      
    } catch (err) {
      console.error('snake hatch error: ', err);
    }
  }
  
  //Returns next snake move
  exports.slither = (game) => {
    debug.log(2,'snake.slither - beginning move calculations');
    return moves.calculate(hatch(game), game)
  }
  
})( module.exports)