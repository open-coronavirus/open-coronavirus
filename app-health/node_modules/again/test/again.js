
"use strict";

/**
 * Module dependencies.
 */

var again = require('../');
var should = require('should');

describe('again', function () {
  it('not stop', function (done) {
    var callTimes = 1;
    var func1 = function (data, callback) {
      process.nextTick(function () {
        callback(null, callTimes++);
      });
    }
    var f = again(func1, 10);
    var count = 1;
    f(1, function (err, callTimes) {
      should.not.exist(err);
      count.should.equal(callTimes);
      count++;
      if (count === 20) {
        done();
      }
    });
  });

  it('only one', function (done) {
    var callTimes = 1;
    var func2 = function (data, callback) {
      process.nextTick(function () {
        callback(null, callTimes++);
      });
    }
    var f = again(func2, 100, 1);
    var count = 1;
    f(1, function (err, callTimes) {
      should.not.exist(err);
      count.should.equal(callTimes);
      count++;
    });
    setTimeout(function () {
      count.should.equal(1 + 1);
      done();
    }, 2000)
  });
  it('> 1 times', function (done) {
    var callTimes = 1;
    var func2 = function (data, callback) {
      process.nextTick(function () {
        callback(null, callTimes++);
      });
    }
    var f = again(func2, 100, 2);
    var count = 1;
    f(1, function (err, callTimes) {
      should.not.exist(err);
      count.should.equal(callTimes);
      count++;
    });
    setTimeout(function () {
      count.should.equal(1 + 2);
      done();
    }, 2000)
  });
});