# DeLorean

DeLorean is a tiny Flux pattern implementation.

## Overview

```js
var Flux = require('delorean').Flux;
```

### `Flux.createStore`

```js
var TodoStore = Flux.createStore({

  todos: [
    {text: 'hello'},
    {text: 'world'}
  ],

  actions: {
    'todo:add': 'addTodo',
    'todo:remove': 'removeTodo'
  },

  addTodo: function (todo) {
    this.todos.push({text: todo.text});
    this.emit('change');
  },

  removeTodo: function (todoToComplete) {
    this.todos = this.todos.filter(function (todo) {
      return todoToComplete.text !== todo.text
    });
    this.emit('change');
  },

  getState: function () {
    return {
      todos: this.todos
    }
  }
});
```

### `Flux.createApp`

```js
var TodoListApp = Flux.createApp({

  removeTodo: function (todo) {
    if (confirm('Do you really want to delete this todo?')) {
      this.dispatch('todo:remove', todo);
    }
  },

  getStores: function () {
    return {
      todoStore: TodoStore
    }
  }

});
```

## Combining to React

### `Flux.mixins.storeListener`

```js
// Child views don't have to have storeListener.

var TodoItemView = React.createClass({

  render: function (todo) {
    return <li onClick={this.handleClick}>{this.props.todo.text}</li>
  },

  handleClick: function () {
    this.props.app.removeTodo(this.props.todo);
  }

});

var TodoListView = React.createClass({

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return <ul>
      {this.stores.todoStore.store.todos.map(function (todo) {
        return <TodoItemView app={self.props.app} todo={todo}></TodoItemView>
      })}
    </ul>
  }

});
```

## Todo

  - Improve Readme.

## Name

The **flux capacitor** was the core component of Doctor Emmett Brown's time traveling **DeLorean time machine**

## License

[MIT License](http://f.mit-license.org)
