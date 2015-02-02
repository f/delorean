// ## Dependency injection file.

// You can change dependencies using `DeLorean.Flux.define`. There are
// two dependencies now: `EventEmitter` and `Promise`
var requirements;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = requirements = {
    // DeLorean uses **Node.js native EventEmitter** for event emittion
    EventEmitter: require('events').EventEmitter,
    // and **es6-promise** for Deferred object management.
    Promise: require('es6-promise').Promise
  };
} else if (typeof define === 'function' && define.amd) {
  define(function (require, exports, module) {
    var events = require('events'),
        promise = require('es6-promise');

    // Return the module value - http://requirejs.org/docs/api.html#cjsmodule
    // Using simplified wrapper
    return {
      // DeLorean uses **Node.js native EventEmitter** for event emittion
      EventEmitter: require('events').EventEmitter,
      // and **es6-promise** for Deferred object management.
      Promise: require('es6-promise').Promise
    };
  });
} else {
  window.DeLorean = DeLorean;
}

// It's better you don't change them if you really need to.

// This library needs to work for Browserify and also standalone.
// If DeLorean is defined, it means it's called from the browser, not
// the browserify.

if (typeof DeLorean !== 'undefined') {
  for (var requirement in requirements) {
    DeLorean.Flux.define(requirement, requirements[requirement]);
  }
}
