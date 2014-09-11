# Dispatcher

The dispatcher is the central hub that manages all data flow in a Flux application.
It is essentially a registry of callbacks into the stores. Each store registers
itself and provides a callback. When the dispatcher responds to an action,
all stores in the application are sent the data payload provided by the
action via the callbacks in the registry.

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
