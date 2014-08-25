(function (DeLorean) {
  'use strict';

  // Helper functions
  function _generateActionName(name) {
    return "action:" + name;
  }

  function _hasOwn(object, prop) {
    return Object.prototype.hasOwnProperty.call(object, prop);
  }

  function _argsShift(args, from) {
    return Array.prototype.slice.call(args, from);
  }

  // Dispatcher
  var Dispatcher = (function () {
    function Dispatcher(stores) {
      var self = this;
      this.listener = new DeLorean.EventEmitter();
      this.stores = stores;
    }

    Dispatcher.prototype.dispatch = function (actionName, data) {
      var self = this;

      var stores = (function () {
        var stores = [];
        for (var storeName in self.stores) {
          var store = self.stores[storeName];
          if (!store instanceof Store) {
            throw 'Given store is not a store instance';
          }
          stores.push(store);
        }
        return stores;
      }());

      var deferred = this.waitFor(stores);
      for (var storeName in self.stores) {
        self.stores[storeName].dispatchAction(actionName, data);
      };
      return deferred;
    };

    Dispatcher.prototype.waitFor = function (stores) {
      var self = this;
      var promises = (function () {
        var _promises = [];
        for (var i in stores) {
          var promise = (function (store) {
            return new DeLorean.Promise(function (resolve, reject) {
              store.listener.once('change', resolve);
            });
          })(stores[i]);
          _promises.push(promise);
        }
        return _promises;
      }());
      return DeLorean.Promise.all(promises).then(function () {
        self.listener.emit('change:all');
      });
    };

    Dispatcher.prototype.registerAction = function (action, callback) {
      if (typeof callback === 'function') {
        this[action] = callback.bind(this.stores);
      } else {
        throw 'Action callback should be a function.'
      }
    };

    Dispatcher.prototype.on = function () {
      return this.listener.on.apply(this.listener, arguments);
    };

    Dispatcher.prototype.off = function () {
      return this.listener.removeListener.apply(this.listener, arguments);
    };

    return Dispatcher;
  }());

  // Store
  var Store = (function () {

    function Store(store) {
      if (typeof store !== 'object') {
        throw 'Stores should be defined by passing the definition to the constructor';
      }

      this.listener = new DeLorean.EventEmitter();
      this.store = store;
      this.bindActions();
      if (typeof store.initialize === 'function') {
        var args = _argsShift(arguments, 1);
        store.initialize.apply(this.store, args);
      }
    }

    Store.prototype.bindActions = function () {
      this.store.emit = this.listener.emit.bind(this.listener);
      this.store.listenChanges = this.listenChanges.bind(this);

      for (var actionName in this.store.actions) {
        if (_hasOwn(this.store.actions, actionName)) {
          var callback = this.store.actions[actionName];
          if (typeof this.store[callback] !== 'function') {
            throw 'Callback should be a method!';
          }
          this.listener.on(_generateActionName(actionName),
                           this.store[callback].bind(this.store));
        }
      }
    };

    Store.prototype.dispatchAction = function (actionName, data) {
      this.listener.emit(_generateActionName(actionName) , data)
    };

    Store.prototype.onChange = function (callback) {
      this.listener.on('change', callback);
    };

    Store.prototype.listenChanges = function (object) {
      if (!Object.observe) {
        console.error('Store#listenChanges method uses Object.observe, you should fire changes manually.');
        return;
      }
      var self = this;

      var observer = Array.isArray(object) ? Array.observe : Object.observe;

      observer(object, function () {
        self.listener.emit('change');
      });
    };

    return Store;
  }());

  // Flux
  DeLorean.Flux = {
    createStore: function (factoryDefinition) {
      return function () {
        return new Store(factoryDefinition);
      }
    },
    createDispatcher: function (actionsToDispatch) {
      if (typeof actionsToDispatch.getStores === 'function') {
        var actionsOfStores = actionsToDispatch.getStores();
      }
      var dispatcher = new Dispatcher(actionsOfStores || {});

      for (var actionName in actionsToDispatch) {
        if (_hasOwn(actionsToDispatch, actionName)) {
          if (actionName !== 'getStores') {
            var callback = actionsToDispatch[actionName];
            dispatcher.registerAction(actionName, callback.bind(dispatcher));
          }
        }
      }

      return dispatcher;
    },
    // Helper
    define: function (key, value) {
      DeLorean[key] = value;
    }
  };

  // Module Registration
  DeLorean.Dispatcher = Dispatcher;
  DeLorean.Store = Store;

  // React Mixin
  DeLorean.Flux.mixins = {
    // It should be inserted to the React components which
    // used in Flux.
    // Simply `mixin: [Flux.mixins.storeListener]` will work.
    storeListener: {
    // After the component mounted, listen changes of the related stores
      componentDidMount: function () {
        var self = this;
        for (var storeName in this.stores) {
          if (_hasOwn(this.stores, storeName)) {
            var store = this.stores[storeName];
            store.onChange(function () {
              // call the components `storeDidChanged` method
              if (self.storeDidChange) {
                self.storeDidChange(storeName);
              }
              // change state
              if (typeof store.store.getState === 'function') {
                var state = store.store.getState();
                self.state.stores[storeName] = state;
                self.forceUpdate();
              }
            });
          }
        }
      },
      getInitialState: function () {
        var self = this;
        function _findDispatcher(view) {
          if (!view.props.dispatcher) {
            return _findDispatcher(view._owner);
          } else {
            return view.props.dispatcher;
          }
        }

        // some shortcuts
        this.dispatcher = _findDispatcher(this);
        if (this.storesDidChange) {
          this.dispatcher.on('change:all', function () {
            self.storesDidChange();
          });
        }

        this.stores = this.dispatcher.stores;

        var state = {stores: {}};
        // more shortcuts for the state
        for (var storeName in this.stores) {
          if (_hasOwn(this.stores, storeName)) {
            if (this.stores[storeName]
            &&  this.stores[storeName].store
            &&  this.stores[storeName].store.getState) {
              state.stores[storeName] = this.stores[storeName].store.getState();
            }
          }
        }
        return state;
      }
    }
  };

  // Module export
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    DeLorean.Flux.define('EventEmitter', require('events').EventEmitter);
    DeLorean.Flux.define('Promise', require('es6-promise').Promise);
    module.exports = DeLorean;
  } else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return DeLorean;
      });
    } else {
      window.DeLorean = DeLorean;
    }
  }

})({});
