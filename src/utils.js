(function(utils) {
  
  //generate a random integer
  utils.randomInt = (max) => {
    if(!max || max === 0) return 0
    return Math.floor(Math.random() * Math.floor(max));
  }

  //Reverses an integer on a give scale (e.g.: 4 would become 2 on scale of 1-5)
  utils.reverseInt = (min, max, int) => {
    return Math.round((max + min) - int);
  }
  
  //returns number of spaces between two points
  utils.getSpaces = (a,b) => {
    return (a[0] - b[0]) + (a[1] - b[2])
  }
  
  //returns largest board dimension
  utils.longest = (game) => {
    if(game.board.width > game.board.height) return game.board.width
    return game.board.height
  }
  
  utils.createDefaultMove = (dir, type) => {
    return {
      dir: dir,
      type: type,
      spaces:1
    }
  }
  
})( module.exports)