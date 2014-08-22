// # Dispatchers are actually Action sets, it has getStores
// # function. There should be stores for a complete
// # Flux structure.
// {EventEmitter} = require 'events'
// {Promise} = require 'es6-promise'
//
// class Dispatcher extends EventEmitter
//
//   constructor: (@stores)->
//
//   # This method can be called from an action method
//   # Sends action to the all related stores.
//   dispatch: (actionName, data)->
//     deferred = @waitFor (store for storeName, store of @stores)
//     for own storeName, store of @stores
//       store.dispatchAction actionName, data
//
//     return deferred
//
//   waitFor: (stores)->
//     promises = for store in stores
//       new Promise (resolve, reject)->
//         store.once 'change', resolve
//
//     Promise.all(promises).then =>
//       @emit 'change:all'
//
//   # Generates new method on the instance
//   registerAction: (actionName, callback)->
//     @[actionName] = callback.bind this
//
// module.exports = Dispatcher
