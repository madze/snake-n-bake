(function(snake) {
  const utils = require('./utils')
  const path = require('./path')
  
  //returns our snake
  exports.trowzer = () => {
    return {
      color: '#ff8cb0',
      secondary_color: '#119cf3',
      name: "trowzerznake",
      taunt: "I'm Coming!",
      head_type: 'safe',
      tail_type: 'freckled'
    }
  }
  
  //Head coords
  const head = (coords) => {
    return coords[0]
  }
  
  //Direction to move to get to tail and how many spaces away tail is
  const tail = (head, coords, game) => {
    const tail = coords[coords.length -1]
    return path.bestMoveTo(head, tail, coords, game)
  }
  
  //Direction to move to get to closest food that's in a clear path and how many spaces away it is
  const food = (head, game) => {
    const food = game.food
    //TODO: wire this up
    return {
      move: "up",
      spaces: 10
    }
  }
  
  //Direction to closest obstruction and how many spaces away it is
  const obs = (head, game) => {
    const closestWalls = path.getNearestWalls(path.getWallDistances(head, game))
    if(closestWalls[0].spaces === closestWalls[1].spaces) {
      return closestWalls[0]
    }
    
    if(closestWalls[0].spaces < closestWalls[1].spaces) {
      return closestWalls[0]
    } else {
      return closestWalls[1]
    }
  }
  
  //Direction to closest snake head that's smaller than us
  const kill = (snake, game) => {
    const mealSnakes = game.snakes.filter((meal) => {
      return meal.coords.length < snake.coords.length
    })
    const minX = mealSnakes.reduce((a, b) => {
      return Math.min(a.coords[0][0], b.coords[0][0]);
    })
    const minY = mealSnakes.reduce((a, b) => {
      return Math.min(a.coords[0][1], b.coords[0][1]);
    })
    let mealSnake;
    if(minX < minY) {
      mealSnake = mealSnakes.find(mealSnakes, (meal) => {
        return meal.coords[0][0] === minX
      })
    } else {
      mealSnake = mealSnakes.find(mealSnakes, (meal) => {
        return meal.coords[0][1] === minY
      })
    }
    return path.bestMoveTo(snake.head, mealSnake.coords[0], snake.coords, game)
  }
  
  //Direction to closest snake head that's bigger than us
  const nope = (snake, game) => {
    const killerSnakes = game.snakes.filter((killer) => {
      return killer.coords.length > snake.coords.length
    })
    const maxX = killerSnakes.reduce((a, b) => {
      return Math.max(a.coords[0][0], b.coords[0][0]);
    })
    const maxY = killerSnakes.reduce((a, b) => {
      return Math.max(a.coords[0][1], b.coords[0][1]);
    })
    let killerSnake;
    if(maxX > maxY) {
      killerSnake = killerSnakes.find(killerSnakes, (killer) => {
        return killer.coords[0][0] === maxX
      })
    } else {
      killerSnake = killerSnakes.find(killerSnakes, (killer) => {
        return killer.coords[0][1] === maxY
      })
    }
    return path.bestMoveTo(snake.head, killerSnake.coords[0], snake.coords, game)
  }
  
  //Return weights based on health, closest food, closest meal, closest obs, closest nope, and tail
  const getWeights = (snake)=> {
    return [
      nopeWeight(snake.nope),
      obsWeight(snake.obs),
      foodWeight(snake.health_points, snake.food),
      killWeight(snake.kill)
    ]
  }
  
  //Best move based on provided weights
  const bestMove = (targets) => {
    const max = targets.reduce((a, b) => {
      return Math.max(a.weight, b.weight);
    })
    return targets.find((target) => {
      return target.weight === max
    }).move
  }
  
  //Parses our snake and preps data for better consumption
  const hatch = (game) => {
    let snake = game.snakes[game.you]
    snake.head = head(snake.coords)
    snake.tail = tail(snake.head, snake.coords, game)
    snake.food = food(snake.head, game)
    snake.obs = obs(snake.head, game)
    snake.kill = kill(snake, game)
    snake.nope = nope(snake, game)
    
    return bestMove(getWeights(snake, game))
  }
  
  function foodWeight(health, food) {
    const hW = utils.reverseItn(1, 100, Math.floor(health / 25))
    const fW = food && food.spaces < 5 ? utils.reverseItn(1,4,food.spaces) : 1
    food.weight = (hW + fW) / 2
    return food
  }
  
  function obsWeight(obs) {
    obs.weight = obs && obs.spaces < 5 ? utils.reverseItn(1,4,obs.spaces) : 1
    return obs
  }
  
  function nopeWeight(nope) {
    nope.weight = nope && nope.spaces < 5 ? utils.reverseItn(1,4,nope.spaces) : 2
    return nope
  }
  
  function killWeight(meal) {
    meal.weight = meal && meal.spaces < 5 ? utils.reverseItn(1,4,meal.spaces) : 1
    return meal
  }
  
  //Returns current move
  exports.getMove = (game) => {
    return hatch(game)
  }
  
})( module.exports)