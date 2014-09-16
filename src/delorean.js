(function (DeLorean) {
  'use strict';

  var Dispatcher, Store;

  // Helper functions
  function __hasOwn(object, prop) {
    return Object.prototype.hasOwnProperty.call(object, prop);
  }

  function __generateActionName(name) {
    return 'action:' + name;
  }

  function __findDispatcher(view) {
    if (!view.props.dispatcher) {
      return __findDispatcher(view._owner);
    }
    return view.props.dispatcher;
  }

  // Dispatcher
  Dispatcher = (function () {
    var __rollbackListener = function (stores) {
      var __listener = function () {
        for (var i in stores) {
          stores[i].listener.emit('__rollback');
        }
      };
      for (var j in stores) {
        stores[j].listener.on('rollback', __listener);
      }
    };

    function Dispatcher(stores) {
      var self = this;
      this.listener = new DeLorean.EventEmitter();
      this.stores = stores;
      __rollbackListener(Object.keys(stores).map(function (key) {
        return stores[key];
      }));
    }

    Dispatcher.prototype.dispatch = function (actionName, data) {
      var self = this, stores, deferred;

      stores = (function () {
        var stores = [], store;
        for (var storeName in self.stores) {
          store = self.stores[storeName];
          if (!store instanceof Store) {
            throw 'Given store is not a store instance';
          }
          stores.push(store);
        }
        return stores;
      }());

      deferred = this.waitFor(stores);
      for (var storeName in self.stores) {
        self.stores[storeName].dispatchAction(actionName, data);
      }
      return deferred;
    };

    Dispatcher.prototype.waitFor = function (stores) {
      var self = this, promises, __rollbackListener;
      promises = (function () {
        var __promises = [], __promiseGenerator, promise;
        __promiseGenerator = function (store) {
          return new DeLorean.Promise(function (resolve, reject) {
            store.listener.once('change', resolve);
          });
        };
        for (var i in stores) {
          promise = __promiseGenerator(stores[i]);
          __promises.push(promise);
        }
        return __promises;
      }());
      return DeLorean.Promise.all(promises).then(function () {
        self.listener.emit('change:all');
      });
    };

    Dispatcher.prototype.registerAction = function (action, callback) {
      if (typeof callback === 'function') {
        this[action] = callback.bind(this.stores);
      } else {
        throw 'Action callback should be a function.';
      }
    };

    Dispatcher.prototype.on = function () {
      return this.listener.on.apply(this.listener, arguments);
    };

    Dispatcher.prototype.off = function () {
      return this.listener.removeListener.apply(this.listener, arguments);
    };

    Dispatcher.prototype.emit = function () {
      return this.listener.emit.apply(this.listener, arguments);
    };

    return Dispatcher;
  }());

  // Store
  Store = (function () {

    function Store(store, args) {
      if (typeof store !== 'object') {
        throw 'Stores should be defined by passing the definition to the constructor';
      }

      this.listener = new DeLorean.EventEmitter();
      this.store = store;
      this.bindActions();
      if (typeof store.initialize === 'function') {
        store.initialize.apply(this.store, args);
      }
    }

    Store.prototype.bindActions = function () {
      var callback;

      this.store.emit = this.listener.emit.bind(this.listener);
      this.store.emitChange = this.listener.emit.bind(this.listener, 'change');
      this.store.emitRollback = this.listener.emit.bind(this.listener, 'rollback');
      this.store.rollback = this.listener.on.bind(this.listener, '__rollback');
      this.store.listenChanges = this.listenChanges.bind(this);

      for (var actionName in this.store.actions) {
        if (__hasOwn(this.store.actions, actionName)) {
          callback = this.store.actions[actionName];
          if (typeof this.store[callback] !== 'function') {
            throw 'Callback should be a method!';
          }
          this.listener.on(__generateActionName(actionName),
                           this.store[callback].bind(this.store));
        }
      }
    };

    Store.prototype.dispatchAction = function (actionName, data) {
      this.listener.emit(__generateActionName(actionName), data);
    };

    Store.prototype.onChange = function (callback) {
      this.listener.on('change', callback);
    };

    Store.prototype.listenChanges = function (object) {
      var self = this, observer;
      if (!Object.observe) {
        console.error('Store#listenChanges method uses Object.observe, you should fire changes manually.');
        return;
      }

      observer = Array.isArray(object) ? Array.observe : Object.observe;

      observer(object, function (changes) {
        self.listener.emit('change', changes);
      });
    };

    return Store;
  }());

  // Flux
  DeLorean.Flux = {
    createStore: function (factoryDefinition) {
      return function () {
        return new Store(factoryDefinition, arguments);
      };
    },
    createDispatcher: function (actionsToDispatch) {
      var actionsOfStores, dispatcher, callback;

      if (typeof actionsToDispatch.getStores === 'function') {
        actionsOfStores = actionsToDispatch.getStores();
      }
      dispatcher = new Dispatcher(actionsOfStores || {});

      for (var actionName in actionsToDispatch) {
        if (__hasOwn(actionsToDispatch, actionName)) {
          if (actionName !== 'getStores') {
            callback = actionsToDispatch[actionName];
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
        var self = this, store, __changeHandler;
        __changeHandler = function (store, storeName) {
          return function () {
            var state, args;
            // call the components `storeDidChanged` method
            if (self.storeDidChange) {
              args = [storeName].concat(Array.prototype.slice.call(arguments, 0));
              self.storeDidChange.apply(self, args);
            }
            // change state
            if (self.isMounted()) {
              self.setState(self.getStoreStates());
            }
          };
        };
        for (var storeName in this.stores) {
          if (__hasOwn(this.stores, storeName)) {
            store = this.stores[storeName];
            store.onChange(__changeHandler(store, storeName));
          }
        }
      },
      componentWillUnmount: function () {
        for (var storeName in this.stores) {
          if (__hasOwn(this.stores, storeName)) {
            var store = this.stores[storeName];
            store.listener.removeAllListeners('change');
          }
        }
      },
      getInitialState: function () {
        var self = this, state;

        // some shortcuts
        this.dispatcher = __findDispatcher(this);
        if (this.storesDidChange) {
          this.dispatcher.on('change:all', function () {
            self.storesDidChange();
          });
        }

        this.stores = this.dispatcher.stores;

        return this.getStoreStates();
      },
      getStoreStates: function () {
        var state = {stores: {}};

        // Set state.stores for all present stores with a setState method defined
        for (var storeName in this.stores) {
          if (__hasOwn(this.stores, storeName)) {
            if (this.stores[storeName]
            && this.stores[storeName].store
            && this.stores[storeName].store.getState) {
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
      define([], function () {
        return DeLorean;
      });
    } else {
      window.DeLorean = DeLorean;
    }
  }

})({});
