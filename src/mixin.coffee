module.exports =
  # It should be inserted to the React components which
  # used in Flux.
  # Simply `mixin: [Flux.mixins.storeListener]` will work.
  storeListener:
    # After the component mounted, listen changes of the related stores
    componentDidMount: ->
      for own storeName of @stores
        do (container=@stores[storeName])=>
          container.on 'change', =>
            # call the components `storeDidChanged` method
            @storeDidChanged? storeName
            # change state
            @setState container.store.getState()

    getInitialState: ->
      # Some shortcuts
      @app = @props.app
      @stores = @app.stores

      state = stores: {}
      # more shortcuts for the state
      for own storeName of @stores
        state.stores[storeName] = @stores[storeName].store.getState()
      state
