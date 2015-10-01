require('should');
var asap = require('../src/promise/asap.js');

describe("asap", function() {
  it('asap', function(done) {
    var result = { count: 0 };
    function add1(result) {
      result.count += 1;
    }
    asap(add1, result);
    asap(add1, result);
    asap(add1, result);
    asap(add1, result);
    result.count.should.equal(0);
    process.nextTick(function() {
      var result2 = { count: 0 };
      asap(add1, result2);
      process.nextTick(function() {
        result2.count.should.equal(1);
        done();
      });
    });
  });
});
