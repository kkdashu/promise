var state =  require('./state'),
    PENDING = state.PENDING,
    FULFILLED = state.FULFILLED,
    REJECTED = state.REJECTED;

var util = require('./util.js'),
    isFunction = util.isFunction,
    objectOrFunction = util.objectOrFunction;

var asap = require('./asap');

function resolve(promise, value) {
  promise._state = FULFILLED;
  promise._result = value;
  asap(publish, promise);
}

function publish(promise) {
  var subscribes = promise._subscribes;
  var value = promise._result;
  if(subscribes.length === 0)  { return; }
  for(var i = 0; i< subscribes.length; i+=3) {
    var child = subscribes[i];
    var callback = subscribes[i + promise._state];
    var v = callback(value);
    if(child) {
      resolve(child, v);
    }
  }
}

function reject(promise, value) {
  promise._state = REJECTED;
  promise._result = value;
}

function initialize(promise, resolver) {
  resolver(function _resolve(value) {
    resolve(promise, value);
  }, function _reject(value) {
    reject(promise, value);
  });
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribes = parent._subscribes,
      len = subscribes.length;
  subscribes[len] = child;
  subscribes[len + 1] = onFulfillment;
  subscribes[len + 2] = onRejection;
}

function noop() { }

function Promise(resolver) {
  if(!isFunction(resolver)) {
    throw new TypeError("Promise resolver " + resolver.toString() +" is not a function");
  }
  var promise = this;
  promise._state = PENDING;
  promise._subscribes = [];
  if(resolver !== noop) {
    initialize(promise, resolver);
  }
}

Promise.prototype.then = function(resolve, reject) {
  var parent = this;
  var child = new Promise(noop);
  //增加观察者
  subscribe(parent, child, resolve, reject);
  return child;
};

module.exports = Promise;
