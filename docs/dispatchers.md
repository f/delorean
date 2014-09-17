# Dispatcher

The dispatcher is the central hub that manages all data flow in a Flux application.
It is essentially a registry of callbacks into the stores. Each store registers
itself and provides a callback. When the dispatcher responds to an action,
all stores in the application are sent the data payload provided by the
action via the callbacks in the registry.

When using the React mixin, you attach a component to a specific
dispatcher's stores by passing the dispatcher instance as the `dispatcher` property
to the top level component in the tree. Delorean will then search up the tree for
dispatchers. This means that any component with the Flux React mixin applied,
that is downstream from a component passed a `dispatcher` prop, will get the
`state` of the dispatcher's stores. Small apps generally only require a single
dispatcher, but it may be desirable to use multiple dispathcers in a larger app,
each responsible for data flows in a different section or module.

## `Flux.createDispatcher`

```js
var TodoListApp = Flux.createDispatcher({

  removeTodo: function (todo) {
    if (confirm('Do you really want to delete this todo?')) {
      this.dispatch('todo:remove', todo);
    }
  },

  getStores: function () {
    return {
      todoStore: myTodos
    }
  }

});
```

#### Action `dispatch`

When an action is dispatched, all the stores know about the status and
process the data asynchronously. When all of them are finished, the dispatcher
emits `change:all` event, also the `dispatch` method returns a promise.

```js
var TodoListApp = Flux.createDispatcher({

  removeTodo: function (todo) {
    if (confirm('Do you really want to delete this todo?')) {
      this.dispatch('todo:remove', todo)
      .then(function () {
        // All of the stores finished the process
        // about 'todo:remove' action
        alert('Item removed successfully');
      });
    }
  },

  getStores: function () {
    return {
      todoStore: myTodos
    }
  }

});
```

#### `getStores()`

The `getStores()` method is what hooks up your stores and React components to a dispatcher. This method should return an
object with a key for each store you want to respond to `dispatch` calls. This method is also used by
the React mixin, which uses it to apply state from these stores in your React components (states are
generated from each store's `getState` method).


#### `getStore(storeName)`

`getStore` method is a shortcut to get the related store.

```js
TodoListApp.getStore('todoStore'); // This will return `myTodos.store`
```
