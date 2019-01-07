const assert = require('chai').assert
const testData = require('./test_data')
const _ = require('lodash')

const path = require('../src/path')
const Snake = require('../src/models/Snake')

describe('path.createPath', () => {
  it('returns an array of up to two paths between two points', () => {
    const paths = path.createPath(testData.Snake.head, testData.path.clearPath)
    assert.isArray(paths, "is not an array")
    assert.lengthOf(paths, 2, "does not have correct number of items")
    assert.isTrue(_.every(paths, (point) => {
      return _.has(point,'dir')
    }), "some paths do not have a dir property")
    assert.isTrue(_.every(paths, (point) => {
      return _.has(point,'spaces')
    }), "some paths do not have a spaces property")
  })
})

describe('path.isImmediateCollision', () => {
  const snake = new Snake(testData.game.moveOne_snakesTwo)
  it('returns if a direction will collide with obstacle within one space', () => {
    const down = path.isImmediateCollision("down",snake.obs)
    const left = path.isImmediateCollision("left",snake.obs)
    const up = path.isImmediateCollision("up",snake.obs)
    const right = path.isImmediateCollision("right",snake.obs)
    assert.isFalse(down, "not evaulating down correctly")
    assert.isTrue(right, "not evaulating right correctly")
    assert.isFalse(left, "not evaulating left correctly")
    assert.isFalse(up, "not evaulating up correctly")
  })
})

describe('path.isImmediateWallCollision', () => {
  const snake = new Snake(testData.game.moveOne_snakesTwo)
  it('returns if a direction will collide with obstacle within one space', () => {
    const down = path.isImmediateWallCollision(snake.head,"down",5,5)
    const up = path.isImmediateWallCollision(snake.head,"up",5,5)
    const right = path.isImmediateWallCollision(snake.head,"right",5,5)
    const left = path.isImmediateWallCollision(snake.head,"left",5,5)
    assert.isFalse(down, "not evaulating down correctly")
    assert.isTrue(up, "not evaulating up correctly")
    assert.isFalse(right, "not evaulating right correctly")
    assert.isFalse(left, "not evaulating left correctly")
  })
})

describe('path.getImmediatelyClearDirs', () => {
  const snake = new Snake(testData.game.moveOne_snakesTwo)
  it('returns array of directions that will not collide within one space', () => {
    const clearDirs = path.getImmediatelyClearDirs(snake, 5, 5)
    assert.sameMembers(clearDirs, ["down", "left"], "does not have directions that should be there")
    assert.notSameMembers(clearDirs, ["up", "right"], "has direction that should not be there")
  })
})

describe('path.isTrap', () => {
  it('returns if a direction is a trap', () => {
    const result = path.isTrap({x:0,y:0}, 'down', testData.path.isTrap, 5, 5)
    assert.isTrue(result, "not evaulating correctly")
  })
})

describe('path.createOpenBoardPointsArray', () => {
  it('returns an array of all blank points on the board', () => {
    const outPutArray = path.createOpenBoardPointsArray(testData.game.moveOne_snakesTwo)
    assert.deepEqual(outPutArray, testData.path.createBlankBoardPointsArray, "output array is incorrect")
  })
})