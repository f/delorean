![DeLorean Logo](https://raw.githubusercontent.com/f/delorean/master/asset/delorean-logo.png)

# DeLorean.js

[![NPM version](https://badge.fury.io/js/delorean.js.svg)](http://badge.fury.io/js/delorean.js)

DeLorean is a tiny Flux pattern implementation.

## What is Flux

Data in a Flux application flows in a single direction, in a cycle:

```
Views ---> (actions) ----> Dispatcher ---> (registered callback) ---> Stores -------+
Ʌ                                                                                   |
|                                                                                   V
+-- (Controller-Views "change" event handlers) ---- (Stores emit "change" events) --+
```

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

> The dispatcher is the central hub that manages all data flow in a Flux application.
> It is essentially a registry of callbacks into the stores. Each store registers
> itself and provides a callback. When the dispatcher responds to an action,
> all stores in the application are sent the data payload provided by the
> action via the callbacks in the registry.

### `Flux.createDispatcher`

```js
var TodoListApp = Flux.createDispatcher({

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

#### Action `dispatch`

When an action is dispatched, all the stores know about the status and they
process the data asynchronously. When all of them are finished the dispatcher
emits `change:all` event, also `dispatch` method returns a promise.

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
      todoStore: TodoStore
    }
  }

});
```

## Combining to React

You may bring all the flow together with the Views, actually *the Action generators*.
You should use **`Flux.mixins.storeListener`** mixin to get a view into the Flux system.
Also you should pass `dispatcher={DispatcherName}` attribute to React view.

```js
// Child views don't have to have storeListener.

var TodoItemView = React.createClass({

  render: function (todo) {
    return <li onClick={this.handleClick}>{this.props.todo.text}</li>
  },

  handleClick: function () {
    this.props.dispatcher.removeTodo(this.props.todo);
  }

});

var TodoListView = React.createClass({

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return <ul>
      {this.stores.todoStore.store.todos.map(function (todo) {
        return <TodoItemView dispatcher={self.props.dispatcher} todo={todo}></TodoItemView>
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

## Routing

You can use any Router tool with DeLorean. In the example I use `director` as the router.

```js
var Router = require('director').Router;
```

You may trig the action from View. So you can just do something like that:

```js
var mainView = React.renderComponent(<ApplicationView dispatcher={TodoDispatcher} />,
  document.getElementById('main'))

var appRouter = new Router({
  '/random': function () {
    mainView.dispatcher.dispatch('todo:add', {text: Math.random()});
    location.hash = '/';
  }
});
```

## Running the TodoMVC example

There is a simple TodoMVC example working with DeLorean.js

```bash
cd examples/todomvc
grunt
open index.html
```

## Todo

  - Improve Readme.

## Name

The **flux capacitor** was the core component of Doctor Emmett Brown's time traveling **DeLorean time machine**

## License

[MIT License](http://f.mit-license.org)
