Store = require './store'
App = require './app'

class Flux

  # Generates new store using Store class
  # Stores are global and not connected directly
  # to the Views
  @createStore: (store)->
    new Store store

  # Apps are actually Action sets, it has getStores
  # function. There should be stores for a complete
  # Flux structure.
  @createApp: (actions)->
    app = new App actions.getStores?()
    for own action, callback of actions
      unless action is 'getStores'
        app.registerAction action, callback
    app

# Mixins can be defined in `mixin.coffee` file.
Flux.mixin = require './mixin'
module.exports = Flux
