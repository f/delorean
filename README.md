![DeLorean Logo](https://raw.githubusercontent.com/f/delorean/master/asset/delorean-logo.png)

# DeLorean.js

DeLorean is a tiny Flux pattern implementation.

## Install

You can install **DeLorean** with Bower:

```bash
bower install delorean
```

You can also install by NPM to use with **Browserify** *(recommended)*

```bash
npm install delorean.js
```

## Usage

```js
var Flux = require('delorean.js').Flux;
```

## Stores

> Stores contain the application state and logic. Their role is somewhat similar
> to a model in a traditional MVC, but they manage the state of many objects —
> they are not instances of one object. Nor are they the same as Backbone's
> collections. More than simply managing a collection of ORM-style objects,
> stores manage the application state for a particular domain within the application.

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

## Dispatcher

Dispatchers are called `Apps` in **DeLorean**. It manages all the logic of the
partial app.

> The dispatcher is the central hub that manages all data flow in a Flux application.
> It is essentially a registry of callbacks into the stores. Each store registers
> itself and provides a callback. When the dispatcher responds to an action,
> all stores in the application are sent the data payload provided by the
> action via the callbacks in the registry.

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

You may bring all the flow together with the Views, actually *the Action generators*.
You should use **`Flux.mixins.storeListener`** mixin to get a view into the Flux system.
Also you should pass `app={AppName}` attribute to React view.

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

## Running an Example

```bash
grunt example
open example/index.html
```

## Todo

  - Improve Readme.

## Name

The **flux capacitor** was the core component of Doctor Emmett Brown's time traveling **DeLorean time machine**

## License

[MIT License](http://f.mit-license.org)
