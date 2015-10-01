var Promise = require('../src/promise.js');
require('should');
var PENDING = undefined,
    REFULFILLED = 1,
    REJECTED = 2;

describe('Promise', function() {
  it('promise constructor', function() {
    var promise = new Promise(function(resolve) {
      process.nextTick(function() {
        resolve(11);
      });
    });

    promise.then(function(v) {
      v.should.equal(11);
    });
    promise.constructor.should.equal(Promise);
  });
});
