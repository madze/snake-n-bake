const assert = require('chai').assert
const testData = require('./test_data')
const brain = require('../src/brain')
const Snake = require('../src/models/Snake')

describe('brain.getDirection', () => {
  it('returns a valid move object', () => {
    const snake = new Snake(testData.game.moveOne_snakesTwo)
    let nextMove = brain.getMove(snake, testData.game.moveOne_snakesTwo)
    assert.isObject(nextMove, "not a valid object")
    assert.isString(nextMove.move, "does not contain a move property")
  })
})