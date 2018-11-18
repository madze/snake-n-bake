(function(path) {
  
  //closest coordinate to point
  const closest = (point, coords) => {
  
  }
  
  const findObs = (a, b, game) => {
  
  }
  
  const getMoveSpaceFromDirection = (dir, fail1) => {
    let move = ""
    if(dir.isOne) {
      //direction is on only one axis
      if(dir.d[0] > 0) move = {move:"up", spaces: dir.d[0]}
      if(dir.d[1] > 0) move = {move:"left", spaces: dir.d[1]}
      if(dir.d[2] > 0) move = {move:"down", spaces: dir.d[2]}
      if(dir.d[3] > 0) move = {move:"right", spaces: dir.d[3]}
    } else {
      //direction is on both axis
      //TODO: make this smarter
      if(dir.d[0] > 0 && fail1.move !== "up") move = {move:"up", spaces: dir.d[0]}
      if(dir.d[1] > 0 && fail1.move !== "left") move = {move:"left", spaces: dir.d[1]}
      if(dir.d[2] > 0 && fail1.move !== "down") move = {move:"down", spaces: dir.d[2]}
      if(dir.d[3] > 0 && fail1.move !== "right") move = {move:"right", spaces: dir.d[3]}
    }
    return move
  }
  
  const getDirection = (a,b) => {
    const aX = a[0]
    const aY = a[1]
    const bX = b[0]
    const bY = b[1]
    const x = aX - bX
    const y = aY - bY
    const result = {
      isOne: true,
      d: [
        0, //up
        0, //left
        0, //down
        0 //right
      ]
    }
    
    
    if((x  === 1) || (y === 1)) {
      //they're only one space away
      if(aX > bX) result.dir.d[1] = x
      if(aX < bX) result.d[3] = x
      if(aY < bY) result.d[0] = y
      if(aY > bY) result.d[2] = y
    } else {
      //they're more than one space away
      if(x === 0) {
        //only along Y axis
        if(aY < bY) {
          result.d[0] = y
        } else {
          result.d[2] = y
        }
      } else if(y === 0) {
        //only along x axis
        if(aX > bX) {
          result.d[1] = x
        } else {
          result.d[3] = x
        }
      } else {
        //along both axis
        result.isOne = false
        if(aX > bX) {
          //movement is not right
          result.d[1] = x
          if(aY > bY) {
            //movement is left, down
            result.d[2] = y
          } else {
            //movement is left, up
            result.d[0] = y
          }
        } else {
          //movement is not left
          result.d[3] = x
          if(aY > bY) {
            //movement is right, down
            result.d[2] = y
          } else {
            //movement is right, up
            result.d[0] = y
          }
        }
      }
    }
    return result;
  }
  
  exports.getWallDistances = (head, game) => {
    const walls = [
      game.width - head[1],
      game.width - head[0],
      head[1] - game.width,
      head[0] - game.width
    ]
  }
  
  exports.getNearestWalls = (walls) => {
    const firstMin = Math.min.apply(null, walls)
    const secondMin = Math.min.apply(null, walls.filter(n => n != min))
    const result = []
    
    if(walls[0] === firstMin) {
      result[0] = {
        move: "down",
        spaces: firstMin
      }
    }
    
    if(walls[1] === firstMin) {
      result[0] = {
        move: "right",
        spaces: firstMin
      }
    }
    
    if(walls[2] === firstMin) {
      result[0] = {
        move: "up",
        spaces: firstMin
      }
    }
    
    if(walls[3] === firstMin) {
      result[0] = {
        move: "left",
        spaces: firstMin
      }
    }
    
    if(walls[0] === secondMin) {
      result[1] = {
        move: "down",
        spaces: secondMin
      }
    }
  
    if(walls[1] === secondMin) {
      result[1] = {
        move: "right",
        spaces: secondMin
      }
    }
  
    if(walls[2] === secondMin) {
      result[1] = {
        move: "up",
        spaces: secondMin
      }
    }
  
    if(walls[3] === secondMin) {
      result[1] = {
        move: "left",
        spaces: secondMin
      }
    }
    return result
  }
  
  //direction to move to get to point
  exports.bestMoveTo = function(head, b, snakeCoords, game) {
    const nearestSeg = getMoveSpaceFromDirection(getDirection(head, snakeCoords[1]))
    //TODO: know if snake segment is in the way
    return getMoveSpaceFromDirection(getDirection(head, b, nearestSeg))
  }
  
  
})( module.exports)