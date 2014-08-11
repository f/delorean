{EventEmitter} = require 'events'

# Stores are simple observable structures.
class Store extends EventEmitter

  constructor: (@store)->
    super
    @bindActions store.actions

  bindActions: (actions)->
    @store.emit = @emit.bind this

    for own actionName, callback of actions
      @on "action:#{actionName}", @store[callback].bind @store

  dispatchAction: (actionName, data)->
    @emit "action:#{actionName}", data

  onChange: (callback)->
    @on 'change', callback

module.exports = Store
