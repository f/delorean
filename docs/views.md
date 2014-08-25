# Views

## Combining to React

You may bring all the flow together with the Views, actually *the Action generators*.
You should use **`Flux.mixins.storeListener`** mixin to get a view into the Flux system.
Also you should pass `dispatcher={DispatcherName}` attribute to *main* React view. It will
pass dispatcher all the child views which have `storeListener` mixin.

```js
// Child views don't have to have storeListener.

var TodoItemView = React.createClass({

  render: function (todo) {
    return <li onClick={this.handleClick}>{this.props.todo.text}</li>
  },

  handleClick: function () {
    TodoActionCreator.removeTodo(this.props.todo);
    // or, this.props.dispatcher.removeTodo(this.props.todo);
  }

});

var TodoListView = React.createClass({

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return <ul>
      {this.stores.todoStore.store.todos.map(function (todo) {
        return <TodoItemView todo={todo}></TodoItemView>
      })}
    </ul>
  }

});
```

### `storeDidChange` and `storesDidChange`

Two functions are triggered when a store changed and all stores are changed. You can use
these functions if your application needs.

```js
var TodoListView = React.createClass({

  mixins: [Flux.mixins.storeListener],

  // when all stores are updated
  storesDidChange: function () {
    console.log("All stores are now updated.");
  },

  // when a store updates
  storeDidChange: function (storeName) {
    console.log(storeName + " store is now updated.");
  },

  render: function () {
    // ...
  }

});
```

## Combining to Flight.js

Since DeLorean.Flux doesn't require React, you can use it everywhere. Also in **Flight.js**

```javascript
var TodoCountUI = flight.component(function () {

  this.render = function () {
    this.$node.html(TodoListDispatcher.stores.todoStore.store.todos.length);
  };

  this.after('initialize', function() {
    // You should listen changes
    TodoListDispatcher.on('change:all', this.render.bind(this));
    this.render();
  });
});
```
