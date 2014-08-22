// {EventEmitter} = require 'events'
//
// # Stores are simple observable structures.
// class Store extends EventEmitter
//
//   constructor: (@store, args...)->
//     super
//     @bindActions store.actions
//     @store.initialize?.call @store, args...;
//
//   bindActions: (actions)->
//     @store.emit = @emit.bind this
//     @store.listenChanges = @listenChanges.bind this
//
//     for own actionName, callback of actions
//       @on "action:#{actionName}", @store[callback].bind @store
//
//   dispatchAction: (actionName, data)->
//     @emit "action:#{actionName}", data
//
//   onChange: (callback)->
//     @on 'change', callback
//
//   listenChanges: (object)->
//     # Observe changes of the object and
//     # emit change event for every change
//     observer = if Array.isArray object
//       Array.observe
//     else
//       Object.observe
//
//     observer object, => @emit 'change'
//
// module.exports = Store
