/**
 * This mode will direct the snake to go for a direct kill (eating a smaller snake's head)
 */

module.exports = (snake, gameState) => {
  return () => {
    console.log('MODE - Kill!')

  }
}