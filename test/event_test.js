require('should');
var _Event = require('../src/promise/event');

describe('Event', function() {
  it('trigger', function() {
    var started = false;
    var e = new _Event();
    e.on('start', function() {
      started = true;
    });
    e.trigger('start');
    started.should.equal(true);
  });
  it('on and off', function() {
    var result = 0;
    var e = new _Event();
    var add = function() {
      result++;
    };
    e.on('add', add);
    result.should.equal(0);
    e.trigger('add');
    result.should.equal(1);
    e.trigger('add');
    e.trigger('add');
    result.should.equal(3);
    e.off('add', add);
    e.trigger('add');
    result.should.equal(3);
    e.off('add', add);
    result = 0;
    e.on('add2', function() {
      result += 2;
    });
    e.on('add3', function() {
      result += 3;
    });
    e.events.should.have.property("add2");
    e.events.should.have.property("add3");
    e.off();
    e.events.should.be.empty();
  });
  it("event arguments", function() {
    var e = new _Event();
    e.on('test', function(a) {
      a.should.equal(1);
    });
    e.trigger('test', 1);
    e.on('test', function(a, b) {
      a.should.equal(1);
      b.should.equal(2);
    });
    e.trigger('test', 1, 2);
    e.on('test', function(a, b, c) {
      a.should.equal(1);
      b.should.equal(2);
      c.should.equal(3);
    });
    e.trigger('test', 1, 2, 3);
    e.on('test', function(a, b, c, d) {
      a.should.equal(1);
      b.should.equal(2);
      c.should.equal(3);
      d.should.equal(4);
    });
    e.trigger('test', 1, 2, 3, 4);
    e.on('more', function(arg) {
      arg = Array.prototype.slice.call(arguments);
      arg.length.should.equal(5);
    });
    e.trigger('more', 1,2,3,4,5);
  });
  it('mixinTo', function() {
    var o = {};
    _Event.mixinTo(o);
    var result = 0;
    o.on('add', function() {
      result += 1;
    });
    o.trigger('add');
    result.should.equal(1);
    o.off('add');
    o.trigger('add');
    result.should.equal(1);
  });
});
