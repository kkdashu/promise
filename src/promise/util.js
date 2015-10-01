exports.isFunction = function(fun) {
  return typeof fun === 'function';
};

exports.objectOrFunction = function(obj) {
  return typeof obj === 'function' || (typeof obj === 'object' && obj !== null);
};
