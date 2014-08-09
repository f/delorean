# Apps are actually Action sets, it has getStores
# function. There should be stores for a complete
# Flux structure.
class App

  constructor: (@stores)->

  # This method can be called from an action method
  # Sends action to the all related stores.
  dispatch: (actionName, data)->
    for own storeName, store of @stores
      store.dispatchAction actionName, data

  # Generates new method on the instance
  registerAction: (actionName, callback)->
    @[actionName] = callback.bind this

module.exports = App
