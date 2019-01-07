/**
 * Python Mode! -This mode directs our snake to attempt to ensnare another snake so that they collide with our body
 */

module.exports = (snake, gameState) => {
  return () => {
    console.log('MODE - Ensnare!')
    return null
  }
}