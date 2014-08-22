module.exports =
  # It should be inserted to the React components which
  # used in Flux.
  # Simply `mixin: [Flux.mixins.storeListener]` will work.
  storeListener:
    # After the component mounted, listen changes of the related stores
    componentDidMount: ->
      for own storeName, store of @stores
        do (store, storeName) =>
          store.onChange =>
            # call the components `storeDidChanged` method
            @storeDidChange? storeName
            # change state
            if state = store.store.getState?()
              @state.stores[storeName] = state
              @forceUpdate()

    getInitialState: ->
      findDispatcher = (view)->
        unless view.props.dispatcher
          findDispatcher view._owner
        else
          view.props.dispatcher

      # Some shortcuts
      @dispatcher = findDispatcher this
      @dispatcher.on 'change:all', =>
        @storesDidChange?()

      @stores = @dispatcher.stores

      state = stores: {}
      # more shortcuts for the state
      for own storeName of @stores
        state.stores[storeName] = @stores[storeName]?.store?.getState?()
      state
