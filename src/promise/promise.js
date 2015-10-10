var state =  require('./state'),
    PENDING = state.PENDING,
    FULFILLED = state.FULFILLED,
    REJECTED = state.REJECTED;

var util = require('./util.js'),
    isFunction = util.isFunction,
    objectOrFunction = util.objectOrFunction,
    isFunction = util.isFunction;

var asap = require('./asap');

function resolve(promise, value) {
  if(promise === value) {
    reject(promise, value);
  } else if(objectOrFunction(value)) {
    handleMaybeThenable(promise, value);
  } else {
    fulfill(promise, value);
  }
}
function fulfill(promise, value) {
  promise._state = FULFILLED;
  promise._result = value;
  asap(publish, promise);
}

function handleMaybeThenable(promise, maybeThenable) {
  if(isFunction(maybeThenable)) {
    var value = maybeThenable();
    fulfill(promise, value);
  }
}

function reject(promise, value) {
  promise._state = REJECTED;
  promise._result = value;
}

function publish(promise) {
  var subscribes = promise._subscribes;
  var value = promise._result;
  if(subscribes.length === 0)  { return; }
  for(var i = 0; i< subscribes.length; i+=3) {
    var child = subscribes[i];
    var callback = subscribes[i + promise._state];
    var v = callback(value);
    resolve(child, v);
  }
}


function initialize(promise, resolver) {
  try{
    resolver(function _resolve(value) {
      resolve(promise, value);
    }, function _reject(value) {
      reject(promise, value);
    });
  }
  catch(e) {
    reject(promise, e);
  }
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
