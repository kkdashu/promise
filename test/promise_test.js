var Promise = require('../src/promise.js');
require('should');
var PENDING = undefined,
    REFULFILLED = 1,
    REJECTED = 2;

describe('Promise', function() {
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
});
