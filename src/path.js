(function(path) {
  const debug = require('./debug-settings')
  
  //returns path from point A to point B on grid - if more than one path it will return the shortest leg
  exports.getDirection = (a,b,type) => {
    
    debug.log(4,'path.getDirection - beginning with a: ', a, ' and b: ', b);
    try{
      const aX = a.x
      const aY = a.y
      const bX = b.x
      const bY = b.y
      const x = Math.abs(aX - bX)
      const y = Math.abs(aY - bY)
      let result = {
        dir: "",
        spaces: ""
      }
      
      if(type) result.type = type
  
      if((x  === 1) || (y === 1)) {
        //they're only one space away
        result.spaces = 1
        if(aX > bX) result.dir = "left"
        if(aX < bX) result.dir = "right"
        if(aY < bY) result.dir = "up"
        if(aY > bY) result.dir = "down"
      } else {
        //they're more than one space away
        if(x === 0) {
          //only along Y axis
          result.spaces = y
          if(aY < bY) {
            result.dir = "up"
          } else {
            result.dir = "down"
          }
        } else if(y === 0) {
          //only along x axis
          result.spaces = x
          if(aX > bX) {
            result.dir = "left"
          } else {
            result.dir = "right"
          }
        } else {
          //along both axis - return both legs
          result = []
          if(x > y) {
            let leg = {
              spaces: y
            }
            if(type) leg.type = type
            if(aY > bY) {
              leg.dir = "down"
            } else {
              leg.dir = "up"
            }
            result.push(leg)
          } else {
            let leg = {
              spaces: x
            }
            if(type) leg.type = type
            if(aX > bX) {
              leg.dir = "left"
            } else {
              leg.dir = "right"
            }
            result.push(leg)
          }
        }
      }
      if(!Array.isArray(result)) result = [result]
  
      debug.log(3,'path getDirection - chose path: ', result);
      
      
      return result;
    } catch (err) {
      console.error('path getDirection - error: ', err);
    }
  }
  
  //Returns path to the two closest walls to a given point
  exports.closestWalls = (point, game) => {
    let walls = {
      x:{
        type: "wall"
      },
      y:{
        type: "wall"
      }
    }
    
    if(game.width - point.x === point.x) {
      //right in the middle of board
      walls.x.dir = "left"
      walls.x.spaces = point.x
    } else if (game.width - point.x < point.x) {
      //closer to right wall
      walls.x.dir = "right"
      walls.x.spaces = (game.width+1) - point.x
    } else {
      //closer to left wall
      walls.x.dir = "left"
      walls.x.spaces = point.x
    }
  
    if(game.height - point.y === point.y) {
      //right in the middle of board
      walls.y.dir = "down"
      walls.y.spaces = point.y
    } else if (game.height - point.y < point.y) {
      //closer to top wall
      walls.y.dir = "up"
      walls.y.spaces = (game.height+1) - point.y
    } else {
      //closer to bottom wall
      walls.y.dir = "down"
      walls.y.spaces = point.y
    }
    
    return walls;
  }
  
  const getAllInDirection = (point, arry, dir, accumilator, type) => {
    debug.log(4,'path getAllInDirection - beginning with direction: ', dir, ' and point: ', point, ' and array: ', arry);
    arry.filter((item) => {
      
      return (
        (dir === "up" && point.x === item.x && point.y < item.y) ||
        (dir === "right" && point.y === item.y && point.x < item.x) ||
        (dir === "down" && point.x === item.x && point.y > item.y) ||
        (dir === "left" && point.y === item.y && point.x > item.x)
      )
      
    }).map((item) => {
      item.dir = dir
      if(!item.type && type) item.type = type
      if(dir === "up" || dir === "down") {
        item.spaces = Math.abs(point.y - item.y)
      } else {
        item.spaces = Math.abs(point.x - item.x)
      }
      return item
    }).forEach((item) => {
      if(!item || item.length === 0) return
      accumilator.push(item)
    })
  }
  
  //Returns path to closest point to given point from array of points
  exports.getClosestFromArray = (point, array, type) => {
    let closest = array.reduce((prev, curr) => {
      let currSum = (Math.abs(curr.x - point.x)) + (Math.abs(curr.y - point.y))
      let prevSum = (Math.abs(prev.x - point.x)) + (Math.abs(prev.y - point.y))
      return currSum < prevSum ? curr : prev
    });
    
    debug.log('path.getNearest - closest: ', closest);
    if(closest.x === point.x) {
      if(closest.y > point.y) {
        closest.dir = "up"
        closest.spaces = closest.y - point.y
      } else {
        closest.dir = "down"
        closest.spaces = point.y - closest.y
      }
    } else {
      if(closest.y === point.y) {
        if(closest.x > point.x) {
          closest.dir = "right"
          closest.spaces = closest.x - point.x
        } else {
          closest.dir = "left"
          closest.spaces = point.x - closest.x
        }
      } else{
        //this is not in the x or y axis path of point
        let xSpace = Math.abs(closest.x - point.x)
        let ySpace = Math.abs(closest.y - point.y)
        if(closest.x > point.x) {
          //to the right
          if(closest.y > point.y) {
            //to the right and up
            if(xSpace > ySpace) {
              //more to the right
              closest.dir = "right"
              closest.spaces = xSpace
            } else {
              //more up
              closest.dir = "up"
              closest.spaces = ySpace
            }
          } else {
            //to the right and down
            if(xSpace > ySpace) {
              //more to the right
              closest.dir = "right"
              closest.spaces = xSpace
            } else {
              //more down
              closest.dir = "down"
              closest.spaces = ySpace
            }
          }
        } else {
          //to the left
          if(closest.y > point.y) {
            //to the left and up
            if(xSpace > ySpace) {
              //more to the left
              closest.dir = "left"
              closest.spaces = xSpace
            } else {
              //more up
              closest.dir = "up"
              closest.spaces = ySpace
            }
          } else {
            //to the left and down
            if(xSpace > ySpace) {
              //more to the left
              closest.dir = "left"
              closest.spaces = xSpace
            } else {
              //more down
              closest.dir = "down"
              closest.spaces = ySpace
            }
          }
        }
      }
    }
    debug.log('path.getNearest - closest after logic: ', closest);
    if(!Array.isArray(closest)) closest = [closest]
    return closest;
  }
  
  exports.getAllInFourLines = (point, arry, type) => {
    try{
      debug.log(4,'path.getAllInFourLines - beginning with array: ', arry);
      let result = []
  
      getAllInDirection(point, arry, "up", result, type)
      getAllInDirection(point, arry, "right", result, type)
      getAllInDirection(point, arry, "down", result, type)
      getAllInDirection(point, arry, "left", result, type)
      
      debug.log(3, 'path.getAllInFourLines - result: ', result)
      return result
    } catch (err) {
      console.error(': ', err);
    }
    
  }
  
  
  /*
  exports.getNearestWalls = (walls) => {
    const firstMin = Math.min.apply(null, walls)
    const secondMin = Math.min.apply(null, walls.filter(n => n != firstMin))
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
    debug.log('path getNearestWalls - walls: ', result);
    return result
  }
  */
  
})( module.exports)