function Event() {
  this.events = {};
}

Event.prototype.getEvents = function(name) {
  if(!name) {
    return this.events;
  } else {
    if(!this.events[name]) {
      this.events[name] = [];
    }
    return this.events[name];
  }
};

Event.prototype.on = function(name, callback) {
  if(!name || !callback) return;
  this.getEvents(name).push(callback);
};

Event.prototype.off = function(name, callback) {
  var events = this.getEvents();
  if(!name) {
    this.events = {};
    return;
  }
  if(!callback) {
    events[name] = [];
    return;
  }
  this.events[name] = events[name].filter(function(call) {
    return call !== callback;
  });
};

Event.prototype.trigger = function() {
  var self = this;
  var args = Array.prototype.slice.call(arguments);
  var funName = args.shift();
  if(!funName) return;
  var events = this.getEvents(funName);
  events.forEach(function(callback) {
    switch(args.length) {
      case   0: callback.call(self); break;
      case   1: callback.call(self, args[0]); break;
      case   2: callback.call(self, args[0], args[1]); break;
      case   3: callback.call(self, args[0], args[1], args[2]); break;
      case   4: callback.call(self, args[0], args[1], args[2], args[3]); break;
      default : callback.apply(self, args);
    }
  });
};

Event.mixinTo = function(obj) {
  obj.events = {};
  obj.getEvents = Event.prototype.getEvents;
  obj.on = Event.prototype.on;
  obj.trigger = Event.prototype.trigger;
  obj.off = Event.prototype.off;
};
module.exports = Event;
