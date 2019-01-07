const dummyStates = module.exports

const game = {}
const Snake = {}
const path = {}
dummyStates.game = game
dummyStates.Snake = Snake
dummyStates.path = path


/**
* GAME
*/

//Simple game state for basic tests
game.simple = {
  game: { id: '622216f2-4dc4-4360-ae41-0bbd91b65ed8' },
  turn: 0,
  board: {
    height: 5,
    width: 5,
    food: [
      { x: 0, y: 0}
    ],
    snakes: [
      {
        id: 'db20a95d-454d-46ec-a200-90bc368b994f',
        name: 'TEST-YOU',
        health: 100,
        body: [
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 }
        ]
      }
    ]
  },
  you: {
    id: 'db20a95d-454d-46ec-a200-90bc368b994f',
    name: 'TEST-YOU',
    health: 100,
    body: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 }
    ]
  },
  parsedBoardPoints: [ 
    { x: 0, y: 0, type: 'food', meal: true },
    { x: 1, y: 0, type: 'you', isCollision: false, part: 'head' },
    { x: 2, y: 0, type: 'you', isCollision: true, part: 'neck' },
    { x: 3, y: 0, type: 'you', isCollision: true, part: 'tail'}
  ],
  boardArray: 
    [[4, 1, 5, 5, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]]
}

//first of a sequence of moves for testing
game.moveOne_snakesTwo = {
  game: { id: '622216f2-4dc4-4360-ae41-0bbd91b65ed8' },
  turn: 3,
  board: {
    height: 5,
    width: 5,
    food: [
      { x: 0, y: 0},
      {x: 3, y: 1}
    ],
    snakes: [
      {
        id: 'db20a95d-454d-46ec-a200-90bc368b994f',
        name: 'TEST-YOU',
        health: 100,
        body: [
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 4, y: 0 }
        ]
      },
      {
        id: '9046af6e-28fc-4ebb-aa0d-3085d9dc896e',
        name: 'TEST-THEM',
        health: 100,
        body: [
          { x: 3, y: 2 },
          { x: 2, y: 2 },
          { x: 1, y: 2 }
        ]
      }
    ]
  },
  you: {
    id: 'db20a95d-454d-46ec-a200-90bc368b994f',
    name: 'TEST-YOU',
    health: 100,
    body: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 }
    ]
  },
  parsedBoardPoints: [ 
    { x: 0, y: 0, type: 'food', meal: true},
    { x: 3, y: 1, type: 'food', meal: true},
    { x: 1, y: 0, type: 'you', isCollision: false, part: 'head' },
    { x: 2, y: 0, type: 'you', isCollision: true, part: 'neck' },
    { x: 3, y: 0, type: 'you', isCollision: true, },
    { x: 4, y: 0, type: 'you', isCollision: false, part: 'tail' },
    { x: 3, y: 2, type: 'snake', isCollision: false, meal: true, part: 'head', risk: true},
    { x: 2, y: 2, type: 'snake', isCollision: true },
    { x: 1, y: 2, type: 'snake', isCollision: true, part: 'tail' } 
  ],
  boardArray: 
    [[4, 1, 5, 5, 5],
      [0, 0, 0, 4, 0],
      [0, 5, 5, 2, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]]
}

// END OF GAME ----

/**
* SNAKE
*/

//snake.head
Snake.head = { x: 1, y: 0, type: 'you', isCollision: false, part: 'head' }
Snake.neck = { x: 2, y: 0, type: 'you', isCollision: true, part: 'neck', dir: "right", "spaces": 1, "modes": {}}

// Snake.getOpenMoves
Snake.getOpenMoves = [
  {
    dir: "left"
  },
  {
    dir: "down"
  }
]


// END OF SNAKE ----

/**
  * PATH
  */

path.clearPath = { x: 2, y: 2, type: 'snake', isCollision: true }

path.isImmediateCollision = [
  { x: 2, y: 0, type: 'you', isCollision: true, dir:"right", spaces: 1, mode:{} },
  { x: 2, y: 2, type: 'snake', isCollision: true, dir:"right", spaces:3, mode:{} },
  { x: 2, y: 2, type: 'snake', isCollision: true, dir:"down", spaces:3, mode:{} },
  { x: 1, y: 2, type: 'snake', isCollision: true, part: 'tail', dir:"down", spaces:2, mode:{'chasetail': true} } 
]

path.isTrap = [
  { x: 1, y: 1, type: 'snake', isCollision: true},
  { x: 1, y: 2, type: 'snake', isCollision: true},
  { x: 1, y: 3, type: 'snake', isCollision: true},
  { x: 0, y: 3, type: 'snake', isCollision: true}
]

path.createBlankBoardPointsArray = [ 
  { y: 0, x: 0, type: 'open' },
  { y: 0, x: 4, type: 'open' },
  { y: 1, x: 0, type: 'open' },
  { y: 1, x: 1, type: 'open' },
  { y: 1, x: 2, type: 'open' },
  { y: 1, x: 4, type: 'open' },
  { y: 2, x: 0, type: 'open' },
  { y: 2, x: 1, type: 'open' },
  { y: 3, x: 0, type: 'open' },
  { y: 3, x: 1, type: 'open' },
  { y: 3, x: 2, type: 'open' },
  { y: 3, x: 4, type: 'open' },
  { y: 4, x: 0, type: 'open' },
  { y: 4, x: 1, type: 'open' },
  { y: 4, x: 2, type: 'open' },
  { y: 4, x: 3, type: 'open' },
  { y: 4, x: 4, type: 'open' } 
]

  //END OF PATH