Store = require './store.coffee'
Dispatcher = require './dispatcher.coffee'

class Flux

  # Generates new store using Store class
  # Stores are global and not connected directly
  # to the Views
  @createStore: (store)->
    new Store store

  # Dispatchers are actually Action sets, it has getStores
  # function. There should be stores for a complete
  # Flux structure.
  @createDispatcher: (actions)->
    dispatcher = new Dispatcher actions.getStores?()
    for own action, callback of actions
      unless action is 'getStores'
        dispatcher.registerAction action, callback
    dispatcher

# Mixins can be defined in `mixin.coffee` file.
Flux.mixins = require './mixin.coffee'
module.exports = Flux
