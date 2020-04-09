
/**
 * Module dependencies.
 */
var crypto = require('crypto');
var __program = {};
var __timer = {};


function md5(str){
  var hash = crypto.createHash('md5');
  str += new Date().getTime();
  return hash.update(str, 'utf-8').digest('hex');  
}

function abort(key){
  clearInterval(__program[key]);
  delete __timer[key];
}
function again(func, interval, times){
  interval = interval || 1000;

  var f = function () {
    var that = this;
    var args = f.arguments;
    func.apply(that, args); //执行一次
    var key = md5(func.toString());
    var obj  = {};
    if (times === 1) {
      return;
    }
    if (times > 1) {
      obj.times = times;
      obj.count = 0;
    }
    __timer[key] = obj;
    __program[key] = setInterval(function () {
      func.apply(that, args);
      if (__timer[key] && __timer[key].times) {
        var obj = __timer[key];
        obj.count++;
        if ((obj.times - 1) <= obj.count) {
          abort(key);
        }
      }
    }, interval)
  }
  return f;
}

module.exports = again;