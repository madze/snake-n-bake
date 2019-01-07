const score = module.exports
const weights = require('./weights')

let highestWeight = Object.values(weights).reduce((a,b) => {
  return a > b ? a : b
})

const reverseInt = (min, max, int) => {
  return Math.round((max + min) - int);
}
const longest = (width, height) => {
  if(width > height) return width
  return height
}

score.getHighest = (snake, width, height, options) => {
  const scores = score.create(snake, width, height, options) 
  console.log('score.getHighest - calculating score from: ')
  console.dir(scores)
  return scores.reduce((a,b) => {
    return a.score > b.score ? a : b
  }).type
}

score.create = (snake, width, height, options) => {

  return [
    {
      type: "feed",
      score: score.calcHunger(snake.health, width, height)
    },
    {
      type: "kill",
      score: score.calcKiller(snake, options, width, height)
    },
    {
      type: "tailchase",
      score: score.calcTailChase()
    },
    {
      type: "explore",
      score: score.calcExplore()
    }
  ]
}

score.calcHunger = (health, width, height) => {
  let feedScore = 0
  let longestDimension = longest(width, height) + (Math.floor(longest(width, height) * .1))

  if(health > 80) return 5

  if(health < longestDimension) feedScore += highestWeight
  
  
  feedScore += (reverseInt(1, longestDimension, health)) + weights.feed
  

  return feedScore
}

score.calcKiller = (snake, options, width, height) => {
  let killScore = 0
  let nearestKill = options.bestMealSnakes 
  && options.bestMealSnakes.length > 0 
  && options.bestMealSnakes.reduce((a,b) => {
    return a.spaces < b.spaces ? a : b
  })

  if(!nearestKill || nearestKill.length === 0) {
    nearestKill = snake.mealSnakes[0]
  }
  if(!nearestKill) return 0


  nearestKill = nearestKill && nearestKill.spaces ? nearestKill : {spaces:longest(width, height)}

  if(nearestKill.spaces === 2 && snake.health < longest(width, height)) killScore += highestWeight

  killScore += (reverseInt(1, longest(width, height), nearestKill.spaces)) + weights.kill

  return killScore
}

score.calcTailChase = () => {
  return weights.tailChase
}

score.calcExplore = () => {
  return weights.explore
}