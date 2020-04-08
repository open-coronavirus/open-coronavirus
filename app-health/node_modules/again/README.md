again
=====

##概况

更加方便灵活地管理一个函数的定时执行和执行次数

##安装

    npm install again
     
##使用
    var again = require('again');
    var callTimes = 0;
    //每执行这个函数都使callTimes 加 1
    var addCallTimes = function (callback) {
      process.nextTick(function () {
        callback(null, callTimes++);
      });
    }
    
    //每个10ms，执行一遍addCallTimes
    var againForever = again(addCallTimes, 10);
    againForever(function (err, data) {
      console.log(data);
    });
    
    //每个10ms，执行一遍addCallTimes,一共执行100词
    var againHundredTimes = again(addCallTimes, 10, 100);
    againHundredTimes(function (err, data) {
      console.log(data);
    });