var len = 0;
var queue = new Array(1000);

var asap = function(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len = len + 2;
  if(len == 2) {
    scheduleFlush();
  }
};

var isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

var scheduleFlush;

function useNextTick() {
  return function() {
    process.nextTick(flush);
  };
}

function useTimeout() {
  return function() {
    window.setTimeout(flush, 0);
  };
}

if(isNode) {
  scheduleFlush = useNextTick();
} else {
  scheduleFlush = useTimeout();
}

function flush() {
  for(var i = 0; i< len; i += 2) {
    var callback = queue[i],
        arg = queue[i + 1];
    callback(arg);
    queue[i] = undefined;
    queue[i + 1] = undefined;
  }
  len =  0;
}

module.exports = asap;
