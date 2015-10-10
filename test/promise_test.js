var Promise = require('../src/promise.js');
require('should');
var PENDING = undefined,
    REFULFILLED = 1,
    REJECTED = 2;

describe('Promise', function() {
  var promise;
  beforeEach(function() {
   promise = new Promise(function(resolve) {
      process.nextTick(function() {
        resolve(11);
      });
    });
  });
  it('simple example', function(done) {
    var child = promise.then(function(v) {
      v.should.equal(11);
      return 12;
    });
    promise.then(function(v) {
      v.should.equal(11);
    });
    child.then(function(v) {
      v.should.equal(12);
      done();
    });
  });
  it('promise constructor', function(done) {
    var result = 0;
    var promise = new Promise(function(resolve) {
      process.nextTick(function() {
        result += 1;
        resolve(11);
        result.should.equal(1);
      });
    });

    var child = promise.then(function(v) {
      v.should.equal(11);
      result += 1;
      result.should.equal(2);
      return v;
    });
    promise.then(function() {
    });
    promise._subscribes.length.should.equal(6);
    child._subscribes.length.should.equal(0);
    var grandChild = child.then(function(v) {
      v.should.equal(11);
      result += 1;
      result.should.equal(3);
      done();
    });
    child._subscribes.length.should.equal(3);
    grandChild._subscribes.length.should.equal(0);
    promise.constructor.should.equal(Promise);
    result.should.equal(0);
  });
  it('handleMaybeThenable', function(done) {
    promise.then(function(v){
      done();
    });
  })
});
