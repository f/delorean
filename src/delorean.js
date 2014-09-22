(function (DeLorean) {
  'use strict';

  // There are two main concepts in Flux structure: **Dispatchers** and **Stores**.
  // Action Creators are simply helpers but doesn't require any framework level
  // abstraction.

  var Dispatcher, Store;

  // ## Private Helper Functions

  // Helper functions are private functions to be used in codebase.
  // It's better using two underscore at the beginning of the function.

  /* `__hasOwn` function is a shortcut for `Object#hasOwnProperty` */
  function __hasOwn(object, prop) {
    return Object.prototype.hasOwnProperty.call(object, prop);
  }

  // Use `__generateActionName` function to generate action names.
  // E.g. If you create an action with name `hello` it will be
  // `action:hello` for the Flux.
  function __generateActionName(name) {
    return 'action:' + name;
  }

  /* It's used by the schemes to save the original version (not calculated)
     of the data. */
  function __generateOriginalName(name) {
    return 'original:' + name;
  }

  // `__findDispatcher` is a private function for **React components**.
  function __findDispatcher(view) {
    /* `view` should be a component instance. If a component don't have
        any dispatcher, it tries to find a dispatcher from the parents. */
    if (!view.props.dispatcher) {
      return __findDispatcher(view._owner);
    }
    return view.props.dispatcher;
  }

  // ## Dispatcher

  // The dispatcher is **the central hub** that **manages all data flow** in
  // a Flux application. It is essentially a _registry of callbacks into the
  // stores_. Each store registers itself and provides a callback. When the
  // dispatcher responds to an action, all stores in the application are sent
  // the data payload provided by the action via the callbacks in the registry.
  Dispatcher = (function () {

    // ### Dispatcher Helpers

    // Rollback listener adds a `rollback` event listener to the bunch of
    // stores.
    function __rollbackListener(stores) {

      function __listener() {
        for (var i in stores) {
          stores[i].listener.emit('__rollback');
        }
      }

      /* If any of them fires `rollback` event, all of the stores
         will be emitted to be rolled back with `__rollback` event. */
      for (var j in stores) {
        stores[j].listener.on('rollback', __listener);
      }
    }

    // ### Dispatcher Prototype
    function Dispatcher(stores) {
      var self = this;
      // `DeLorean.EventEmitter` is `require('events').EventEmitter` by default.
      // you can change it using `DeLorean.Flux.define('EventEmitter', AnotherEventEmitter)`
      this.listener = new DeLorean.EventEmitter();
      this.stores = stores;

      /* Stores should be listened for rollback events. */
      __rollbackListener(Object.keys(stores).map(function (key) {
        return stores[key];
      }));
    }

    // `dispatch` method dispatch the event with `data` (or **payload**)
    Dispatcher.prototype.dispatch = function (actionName, data) {
      var self = this, stores, deferred;

      /* Stores are key-value pairs. Collect store instances into an array. */
      stores = (function () {
        var stores = [], store;
        for (var storeName in self.stores) {
          store = self.stores[storeName];
          /* Store value must be an _instance of Store_. */
          if (!store instanceof Store) {
            throw 'Given store is not a store instance';
          }
          stores.push(store);
        }
        return stores;
      }());

      // Store instances should wait for finish. So you can know if all the
      // stores are dispatched properly.
      deferred = this.waitFor(stores);

      /* Payload should send to all related stores. */
      for (var storeName in self.stores) {
        self.stores[storeName].dispatchAction(actionName, data);
      }

      // `dispatch` returns deferred object you can just use **promise**
      // for dispatching: `dispatch(..).then(..)`.
      return deferred;
    };

    // `waitFor` is actually a _semi-private_ method. Because it's kind of internal
    // and you don't need to call it from outside most of the times. It takes
    // array of store instances (`[Store, Store, Store, ...]`). It will create
    // a promise and return it. _Whenever store changes, it resolves the promise_.
    Dispatcher.prototype.waitFor = function (stores) {
      var self = this, promises;
      promises = (function () {
        var __promises = [], promise;

        /* `__promiseGenerator` generates a simple promise that resolves itself when
            related store is changed. */
        function __promiseGenerator(store) {
          // `DeLorean.Promise` is `require('es6-promise').Promise` by default.
          // you can change it using `DeLorean.Flux.define('Promise', AnotherPromise)`
          return new DeLorean.Promise(function (resolve, reject) {
            store.listener.once('change', resolve);
          });
        }

        for (var i in stores) {
          promise = __promiseGenerator(stores[i]);
          __promises.push(promise);
        }
        return __promises;
      }());
      // When all the promises are resolved, dispatcher emits `change:all` event.
      return DeLorean.Promise.all(promises).then(function () {
        self.listener.emit('change:all');
      });
    };

    // `registerAction` method adds a method to the prototype. So you can just use
    // `dispatcherInstance.actionName()`.
    Dispatcher.prototype.registerAction = function (action, callback) {
      /* The callback must be a function. */
      if (typeof callback === 'function') {
        this[action] = callback.bind(this.stores);
      } else {
        throw 'Action callback should be a function.';
      }
    };

    // `getStore` returns the store from stores hash.
    // You can also use `dispatcherInstance.stores[storeName]` but
    // it checks if the store really exists.
    Dispatcher.prototype.getStore = function (storeName) {
      if (!this.stores[storeName]) {
        throw 'Store ' + storeName + ' does not exist.';
      }
      return this.stores[storeName].store;
    };

    // ### Shortcuts

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

  // ## Store

  // Stores contain the application state and logic. Their role is somewhat similar
  // to a model in a traditional MVC, but they manage the state of many objects.
  // Unlike MVC models, they are not instances of one object, nor are they the
  // same as Backbone's collections. More than simply managing a collection of
  // ORM-style objects, stores manage the application state for a particular
  // domain within the application.
  Store = (function () {

    // ### Store Prototype
    function Store(store, args) {
      /* store parameter must be an `object` */
      if (typeof store !== 'object') {
        throw 'Stores should be defined by passing the definition to the constructor';
      }

      // `DeLorean.EventEmitter` is `require('events').EventEmitter` by default.
      // you can change it using `DeLorean.Flux.define('EventEmitter', AnotherEventEmitter)`
      this.listener = new DeLorean.EventEmitter();

      /* Store is _hygenic_ object. DeLorean doesn't extend it, it uses it. */
      this.store = store;
      this.bindActions();
      this.buildScheme();

      // `initialize` is the construction function, you can define `initialize` method
      // in your store definitions.
      if (typeof store.initialize === 'function') {
        store.initialize.apply(this.store, args);
      }
    }

    // `set` method updates the data defined at the `scheme` of the store.
    Store.prototype.set = function (key, value) {
      var scheme = this.store.scheme, definition;
      if (scheme && this.store.scheme[key]) {
        definition = scheme[key];

        this.store[key] = value || definition.default;

        if (typeof definition.calculate === 'function') {
          this.store[__generateOriginalName(key)] = value;
          this.store[key] = definition.calculate.call(this.store, value);
        }
        this.recalculate();
      } else {
        // Scheme **must** include the key you wanted to set.
        throw 'Scheme should include the key ' + key + ' you wanted to set.';
      }
      return this.store[key];
    };

    // Removes the scheme format and standardizes all the shortcuts.
    // If you run `formatScheme({name: 'joe'})` it will return you
    // `{name: {default: 'joe'}}`. Also if you run `formatScheme({fullname: function () {}})`
    // it will return `{fullname: {calculate: function () {}}}`.
    Store.prototype.formatScheme = function (scheme) {
      var formattedScheme = {};
      for (var keyName in scheme) {
        var definition = scheme[keyName], defaultValue, calculatedValue;

        formattedScheme[keyName] = {default: null};

        /* {key: 'value'} will be {key: {default: 'value'}} */
        defaultValue = (typeof definition === 'object') ?
                        definition.default : definition;
        formattedScheme[keyName].default = defaultValue;

        /* {key: function () {}} will be {key: {calculate: function () {}}} */
        if (typeof definition.calculate === 'function') {
          calculatedValue = definition.calculate;
        } else if (typeof definition === 'function') {
          calculatedValue = definition;
        }
        if (calculatedValue) {
          formattedScheme[keyName].calculate = calculatedValue;
        }
      }
      return formattedScheme;
    };

    /* Applying `scheme` to the store if exists. */
    Store.prototype.buildScheme = function () {

      var scheme, calculatedData, keyName, definition;
      if (typeof this.store.scheme === 'object') {
        /* Scheme must be formatted to standardize the keys. */
        scheme = this.store.scheme = this.formatScheme(this.store.scheme);

        /* Set the defaults first */
        for (keyName in scheme) {
          definition = scheme[keyName];
          this.store[keyName] = definition.default;
        }

        /* Set the calculations */
        for (keyName in scheme) {
          definition = scheme[keyName];
          if (definition.calculate) {
            this.store[__generateOriginalName(keyName)] = definition.default;
            this.store[keyName] = definition.calculate.call(this.store, definition.default);
          }
        }
      }

    };

    Store.prototype.recalculate = function () {
      var scheme = this.store.scheme, definition, keyName;
      for (keyName in scheme) {
        definition = scheme[keyName];
        if (typeof definition.calculate === 'function') {
          this.store[keyName] = definition.calculate.call(this.store,
                                this.store[__generateOriginalName(keyName)] || definition.default);
        }
      }
      this.listener.emit('change');
    };

    // `bindActions` is semi-private method. You'll never need to call it from outside.
    // It powers up the `this.store` object.
    Store.prototype.bindActions = function () {
      var callback;

      // Some required methods can be used in **store definition** like
      // **`emit`**, **`emitChange`**, **`emitRollback`**, **`rollback`**, **`listenChanges`**
      this.store.emit = this.listener.emit.bind(this.listener);
      this.store.emitChange = this.listener.emit.bind(this.listener, 'change');
      this.store.emitRollback = this.listener.emit.bind(this.listener, 'rollback');
      this.store.rollback = this.listener.on.bind(this.listener, '__rollback');
      this.store.listenChanges = this.listenChanges.bind(this);
      this.store.set = this.set.bind(this);

      // Stores must have a `actions` hash of `actionName: methodName`
      // `methodName` is the `this.store`'s prototype method..
      for (var actionName in this.store.actions) {
        if (__hasOwn(this.store.actions, actionName)) {
          callback = this.store.actions[actionName];
          if (typeof this.store[callback] !== 'function') {
            throw 'Callback "' + callback + '" defined for action "' + actionName + '" should be a method defined on the store!';
          }
          /* And `actionName` should be a name generated by `__generateActionName` */
          this.listener.on(__generateActionName(actionName),
                           this.store[callback].bind(this.store));
        }
      }
    };

    // `dispatchAction` called from a dispatcher. You can also call anywhere but
    // you probably won't need to do. It simply **emits an event with a payload**.
    Store.prototype.dispatchAction = function (actionName, data) {
      this.listener.emit(__generateActionName(actionName), data);
    };

    // ### Shortcuts

    // `listenChanges` is a shortcut for `Object.observe` usage. You can just use
    // `Object.observe(object, function () { ... })` but everytime you use it you
    // repeat yourself. DeLorean has a shortcut doing this properly.
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

    // `onChange` simply listens changes and calls a callback. Shortcut for
    // a `on('change')` command.
    Store.prototype.onChange = function (callback) {
      this.listener.on('change', callback);
    };

    return Store;
  }());

  // ### Flux Wrapper
  DeLorean.Flux = {

    // `createStore` **creates a function to create a store**. So it's like
    // a factory.
    createStore: function (factoryDefinition) {
      return function () {
        return new Store(factoryDefinition, arguments);
      };
    },

    // `createDispatcher` generates a dispatcher with actions to dispatch.
    /* `actionsToDispatch` should be an object. */
    createDispatcher: function (actionsToDispatch) {
      var actionsOfStores, dispatcher, callback;

      // If it has `getStores` method it should be get and pass to the `Dispatcher`
      if (typeof actionsToDispatch.getStores === 'function') {
        actionsOfStores = actionsToDispatch.getStores();
      }

      /* If there are no stores defined, it's an empty object. */
      dispatcher = new Dispatcher(actionsOfStores || {});

      /* Now call `registerAction` method for every action. */
      for (var actionName in actionsToDispatch) {
        if (__hasOwn(actionsToDispatch, actionName)) {
          /* `getStores` is the special function, it's not an action. */
          if (actionName !== 'getStores') {
            callback = actionsToDispatch[actionName];
            dispatcher.registerAction(actionName, callback.bind(dispatcher));
          }
        }
      }

      return dispatcher;
    },
    // ### `DeLorean.Flux.define`
    // It's a key to _hack_ DeLorean easily. You can just inject something
    // you want to define.
    define: function (key, value) {
      DeLorean[key] = value;
    }
  };

  // Store and Dispatcher are the only base classes of DeLorean.
  DeLorean.Dispatcher = Dispatcher;
  DeLorean.Store = Store;

  // ## Built-in React Mixin
  DeLorean.Flux.mixins = {
    // It should be inserted to the React components which
    // used in Flux.
    // Simply `mixin: [Flux.mixins.storeListener]` will work.
    storeListener: {

      // After the component mounted, listen changes of the related stores
      componentDidMount: function () {
        var self = this, store;

        /* `__changeHandler` is a **listener generator** to pass to the `onChange` function. */
        function __changeHandler(store, storeName) {
          return function () {
            var state, args;
            // When something changes it calls the components `storeDidChanged` method if exists.
            if (self.storeDidChange) {
              args = [storeName].concat(Array.prototype.slice.call(arguments, 0));
              self.storeDidChange.apply(self, args);
            }
            /* If the component is mounted, change state. */
            if (self.isMounted()) {
              self.setState(self.getStoreStates());
            }
          };
        }

        /* Generate and bind the change handlers to the stores. */
        for (var storeName in this.stores) {
          if (__hasOwn(this.stores, storeName)) {
            store = this.stores[storeName];
            store.onChange(__changeHandler(store, storeName));
          }
        }
      },

      // When a component unmounted, it should stop listening.
      componentWillUnmount: function () {
        for (var storeName in this.stores) {
          if (__hasOwn(this.stores, storeName)) {
            var store = this.stores[storeName];
            /* FIXME: What if another mounted view listening this store? Commenting out for now. */
            store.listener.removeAllListeners('change');
          }
        }
      },

      getInitialState: function () {
        var self = this, state;

        /* The dispatcher should be easy to access and it should use `__findDispatcher`
           method to find the parent dispatchers. */
        this.dispatcher = __findDispatcher(this);

        // If `storesDidChange` method presents, it'll be called after all the stores
        // were changed.
        if (this.storesDidChange) {
          this.dispatcher.on('change:all', function () {
            self.storesDidChange();
          });
        }

        // Since `dispatcher.stores` is harder to write, there's a shortcut for it.
        // You can use `this.stores` from the React component.
        this.stores = this.dispatcher.stores;

        return this.getStoreStates();
      },

      getStoreStates: function () {
        var state = {stores: {}};

        /* Set `state.stores` for all present stores with a `setState` method defined. */
        for (var storeName in this.stores) {
          if (__hasOwn(this.stores, storeName)) {
            if (this.stores[storeName]
            && this.stores[storeName].store
            // If stores has `getState` method, it'll be pushed to the component's state.
            && this.stores[storeName].store.getState) {
              state.stores[storeName] = this.stores[storeName].store.getState();
            } else if (typeof this.stores[storeName].store.scheme === 'object') {
              var scheme = this.stores[storeName].store.scheme;
              for (var keyName in scheme) {
                state.stores[storeName] = this.stores[storeName].store[keyName];
              }
            }
          }
        }
        return state;
      },

      // `getStore` is a shortcut to get the store from the state.
      getStore: function (storeName) {
        return this.state.stores[storeName];
      }
    }
  };

  // ## DeLorean API
  // DeLorean can be used in **CommonJS** projects.
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {

    var requirements = require('./requirements');
    for (var requirement in requirements) {
      DeLorean.Flux.define(requirement, requirements[requirement]);
    }
    module.exports = DeLorean;

  // It can be also used in **AMD** projects, too.
  // And if there is no module system initialized, just pass the DeLorean
  // to the `window`.
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
