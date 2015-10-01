require('should');
var asap = require('../src/promise/asap.js');

describe("asap", function() {
  it('asap', function() {
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
      console.log(result2.count);
      process.nextTick(function() {
        console.log(result2.count);
      });
    });
  });
});
