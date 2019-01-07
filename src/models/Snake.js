
//our snake model
const path = require('../path')

class Snake {
  constructor(gameState) {
    const self = this

    //returns a snake object for the engine
    self.bake = (function() {
      let name = gameState.you.name
      let color = '#029cfc' //blue

      if(name === "blue") color = '#029cfc' //blue
      if(name === "orange") color = '#fd8400' //orange
      if(name === "pink") color = '#ff00d4' //pink
      if(name === "vomit") color = '#7D7749' //vomit color
      if(name === "purple") color = '#8a30af' //purple
      if(name === "teal") color = '#00c08f' //teal

      return {color}
    })()

    self.health = gameState.you.health

    //attaches the head point of our snake
    self.head = gameState.parsedBoardPoints.reduce((a,b) => {
      return a.type === 'you' && a.part === 'head' ? a : b
    })

    //attaches all open points on the board
    self.openPoints = path.createOpenBoardPointsArray(gameState)

    //creates paths for paths array
    self.paths = []
    
    // console.log('Snake - open board points: ')
    // console.dir(openPoints)

    let parsedPoints = gameState.parsedBoardPoints.concat(self.openPoints)
    parsedPoints
    .filter((point) => { //First we weed out the head point of our snake
      return point.type === 'you' && point.part === 'head' ? false : true
    })
    .forEach((point) => {
      path.createPath(self.head,point).forEach((pointPath) => self.paths.push(pointPath))
    })

    //attaches the neck path of our snake
    self.neck = self.paths.reduce((a, b) => {
      return a.type === 'you' && a.part === 'neck' ? a : b
    })

    //attaches the tail path of our snake
    self.tail = []
    self.paths.forEach((point) => {
      if(point.type === 'you' && point.part === 'tail') self.tail.push(point)
    })

    //attaches all obstacle paths
    self.obs = this.paths.filter((point) => point.isCollision)

    //attaches all food paths
    self.food = this.paths.filter((point) => point.type === 'food')

    //attaches all meal snake head paths
    self.mealSnakes = this.paths.filter((point) => point.type === 'snake' && point.meal)
  }
  
}

module.exports = Snake