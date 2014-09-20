// ## Dependency injection file.

// You can change dependencies using `DeLorean.Flux.define`. There are
// two dependencies now: `EventEmitter` and `Promise`
var requirements;

module.exports = requirements = {
  // DeLorean uses **Node.js native EventEmitter** for event emittion
  EventEmitter: require('events').EventEmitter,
  // and **es6-promise** for Deferred object management.
  Promise: require('es6-promise').Promise
};
// It's better you don't change them if you really need to.

// This library needs to work for Browserify and also standalone.
// If DeLorean is defined, it means it's called from the browser, not
// the browserify.
if (typeof DeLorean !== 'undefined') {
  for (var requirement in requirements) {
    DeLorean.Flux.define(requirement, requirements[requirement]);
  }
}
