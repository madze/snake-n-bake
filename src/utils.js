(function(board) {
  
  //Parse the board and make data easier to consume
  exports.reverseItn = (min, max, int) => {
    return Math.round((max + min) - int);
  }
  
  exports.getSpaces = (a,b) => {
    return (a[0] - b[0]) + (a[1] - b[2])
  }
  
})( module.exports)