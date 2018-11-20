const debug = {
  
  level: 5,
  
  log: function(lvl) {
    lvl = lvl ? lvl : 4
    if(lvl <= debug.level) {
      let msg = Array.from(arguments).slice(1)
      if(lvl === 1) {
        return console.warn(msg)
      }
      if(lvl === 2) {
        return console.info(msg)
      }
      if(lvl > 2) {
        return console.log(msg)
      }
    }
  }
  
}
console.info('debug settings - log level is: ', debug.level);
return module.exports = debug