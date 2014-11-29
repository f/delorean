# Dispatchers

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
dispatcher, but it may be desirable to use multiple dispatchers in a larger app,
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

### Callback Registration and Dispatching

#### Action `register`

You can register global callbacks:

```js
TodoDispatcher.register(function (actionName, payload) {
  switch (actionName) {
    case 'todo:add':
      console.log('New todo add dispatched with payload:', payload);
      break;
  }
});
```

And you can say:

```js
TodoDispatcher.dispatch('todo:add', {text: 'Do your homework!'});
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

#### `waitFor([stores], event)`

`waitFor` function takes arguments and the event name, and returns a promise.

```js
TodoDispaatcher.waitFor([todoStore, anotherStore], 'todo:add').then(function () {
  console.log('todoStore and anotherStore are changed now.');
});
```

#### `viewTriggers`

When working in React, view triggers offer a clean and simple API for exposing actions that are intended to be triggered
from a view. This is a React specific feature, as it relies on **`Flux.mixins.storeListener`**. `viewTriggers` is a hash you define on your dispatcher, the keys are trigger names, and the values are handler method names (as strings), which you have defined on the dispatcher. The React **`Flux.mixins.storeListener`** will then expose a `trigger` method on components.
`trigger` takes the trigger name as the first parameter, and `0` - `n` additoinal parameters you want to pass to you handler
method.


```js
var TodoListApp = Flux.createDispatcher({

  viewTriggers: {
    'getTodos': 'getTodos'
  },

  getStores: function () {
    return {
      todoStore: myTodos
    }
  },

  getTodos: function () {
    // code to GET todos
  },

});


var TodoListView = React.createClass({

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return <ul>
      {this.getStore('todoStore').todos.map(function (todo) {
        return <TodoItemView todo={todo}></TodoItemView>
      })}
    </ul>
  },

  componentDidMount: function() {
    // `trigger` method is added by the storeListener mixin
    // The first parameter is the viewTrigger name, additonal optional parameters can be passed after that
    this.trigger('getTodos');
  }

});

```
