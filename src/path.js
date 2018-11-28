(function(path) {
  
  path.getClosest = (point, pointsArry) => {
    return pointsArry.reduce((prev, curr) => {
      let currSum = (Math.abs(curr.x - point.x)) + (Math.abs(curr.y - point.y))
      let prevSum = (Math.abs(prev.x - point.x)) + (Math.abs(prev.y - point.y))
      return currSum < prevSum ? curr : prev
    })
  }
  
  path.getPaths = (a,b, getShorter) => {
    //console.log('path.getPaths - a: ', a, ' and b: ', b);
    let result = []
    let spaces = (Math.abs(a.x - b.x)) + (Math.abs(a.y - b.y))
    
    if(a.x === b.x) {
      //along y axis
      let dir = {spaces}
      if(a.y > b.y) {
        dir.dir = "up"
      } else {
        dir.dir = "down"
      }
      result.push(dir)
    } else if (a.y === b.y) {
      //along x axis
      let dir = {spaces}
      if(a.x > b.x) {
        dir.dir = "left"
      } else {
        dir.dir = "right"
      }
      result.push(dir)
    } else {
      //both axis
      if(a.x > b.x) {
        //left
        result.push({dir:"left", spaces})
        if(a.y > b.y) {
          //left up
          if(getShorter) {
            if(a.y - b.y < a.x - b.x ) {
              //shorter distance is up
              result = [{dir:"up", spaces}]
            }
          } else {
            result.push({dir:"up", spaces})
          }
        } else {
          //left down
          if(getShorter) {
            if(a.y - b.y < a.x - b.x ) {
              //shorter distance is down
              result = [{dir:"down", spaces}]
            }
          } else {
            result.push({dir:"down", spaces})
          }
          
          
        }
      } else {
        //right
        result.push({dir:"right", spaces})
        if(a.y > b.y) {
          //right up
          if(getShorter) {
            if(a.y - b.y < a.x - b.x ) {
              result =  [{dir:"up", spaces}]
            }
          } else {
            result.push({dir:"up", spaces})
          }
        } else {
          //right down
          if(getShorter) {
            if(a.y - b.y < a.x - b.x ) {
              result = [{dir:"down", spaces}]
            }
          } else {
            result.push({dir:"down", spaces})
          }
        }
      }
    }
    
    return result
  }
  
  path.isTrap = (point, dir, obs, width, height) => {
    try{
      let spaces = getSpaces()
      console.log('isTrap SPACES: ', spaces, ' - DIR: ', dir, ' - W: ', width, ' - H: ', height, ' - X: ', point.x, ' - Y: ', point.y);
      
      if(dir === 'up') {
        let rightColObs = obs.filter((o) => o.x === point.x + 1 && point.y > o.y && o.y >= point.y - spaces)
        console.log('isTrap A: ', rightColObs);
        if(point.x === 0 && rightColObs.length >= spaces) return true
    
        let leftColObs = obs.filter((o) => o.x === point.x - 1 && point.y > o.y && o.y >= point.y - spaces)
        console.log('isTrap B: ', leftColObs);
        if(point.x === width - 1 && leftColObs.length >= spaces) return true
    
        //console.log('ASSESSING BOTH COLS - DIR UP - A: ', rightColObs.length, ' B: ', leftColObs.length);
        return rightColObs.length >= spaces && leftColObs.length >= spaces
    
      } else if(dir === 'right') {
        
        let upCols = obs.filter((o) => o.y === point.y - 1 && point.x < o.x && o.x <= point.x + spaces)
        console.log('isTrap A: ', upCols);
        if(point.y === height - 1 && upCols.length >= spaces) return true
    
        let downCols = obs.filter((o) => o.y === point.y + 1 && point.x < o.x && o.x <= point.x + spaces)
        console.log('isTrap B: ', downCols);
        if(point.y === 0 && downCols.length >= spaces) return true
  
        //console.log('ASSESSING BOTH COLS - DIR RIGHT A: ', upCols.length, ' B: ', downCols.length);
        return upCols.length >= spaces && downCols.length >= spaces
    
      } else if(dir === 'down') {
    
        let rightColObs = obs.filter((o) => o.x === point.x + 1 && point.y < o.y && o.y <= point.y + spaces)
        console.log('isTrap A: ', rightColObs);
        if(point.x === 0 && rightColObs.length >= spaces) return true
    
        let leftColObs = obs.filter((o) => o.x === point.x - 1 && point.y < o.y && o.y <= point.y + spaces)
        console.log('isTrap B: ', leftColObs);
        if(point.x === width - 1 && leftColObs.length >= spaces) return true
  
        //console.log('ASSESSING BOTH COLS - DIR DOWN - A: ', rightColObs.length, ' B: ', leftColObs.length);
        return rightColObs.length >= spaces && leftColObs.length >= spaces
    
      } else if(dir === 'left'){
    
        let upCols = obs.filter((o) => o.y === point.y - 1 && point.x > o.x && o.x >= point.x - spaces)
        console.log('isTrap A: ', upCols);
        if(point.y === height - 1 && upCols.length >= spaces) return true
    
        let downCols = obs.filter((o) => o.y === point.y + 1 && point.x > o.x && o.x >= point.x - spaces)
        console.log('isTrap B: ', downCols);
        if(point.y === 0 && downCols.length >= spaces) return true
  
        //console.log('ASSESSING BOTH COLS - DIR LEFT A: ', upCols.length, ' B: ', downCols.length);
        return upCols.length >= spaces && downCols.length >= spaces
    
      }
      
      function getSpaces() {
        if(dir === 'up') {
          let pathObs = obs.filter((o) => o.x === point.x && o.y < point.y)
          console.log('SPACES: ', pathObs.length);
          if(pathObs.length > 0) {
            return point.y - pathObs[0].y
          } else {
            return point.y
          }
        } else if (dir === 'right') {
          let pathObs = obs.filter((o) => o.y === point.y && o.x > point.x)
          console.log('SPACES: ', pathObs.length);
          if(pathObs.length > 0) {
            return pathObs[0].x - point.x
          } else {
            return width - point.x
          }
        } else if (dir === 'down') {
          let pathObs = obs.filter((o) => o.x === point.x && o.y > point.y)
          console.log('SPACES: ', pathObs.length);
          if(pathObs.length > 0) {
            return pathObs[0].y - point.y
          } else {
            return height - point.y
          }
        } else if(dir === 'left') {
          let pathObs = obs.filter((o) => o.y === point.y && o.x < point.x)
          console.log('SPACES: ', pathObs.length);
          if(pathObs.length > 0) {
            return point.x - pathObs[0].x
          } else {
            return point.x
          }
        }
      }
    } catch (err) {
      console.error('path.isTrap - error: ', err);
    }
  }
  
  
})( module.exports)