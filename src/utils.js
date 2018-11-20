(function(utils) {
  const debug = require('./debug-settings')
  
  //Reverses an integer on a give scale (e.g.: 4 would become 2 on scale of 1-5)
  exports.reverseInt = (min, max, int) => {
    return Math.round((max + min) - int);
  }
  
  //returns number of spaces between two points
  exports.getSpaces = (a,b) => {
    return (a[0] - b[0]) + (a[1] - b[2])
  }
  
  //returns largest board dimension
  exports.longest = (game) => {
    if(game.width > game.height) return game.width
    return game.height
  }
  
})( module.exports)