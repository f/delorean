![DeLorean Logo](https://raw.githubusercontent.com/f/delorean/master/asset/delorean-logo.png)

# DeLorean.js

[![NPM version](https://badge.fury.io/js/delorean.js.svg)](http://badge.fury.io/js/delorean.js)

DeLorean is a tiny Flux pattern implementation.

  - Unidirectional data flow, it makes your app logic simpler than MVC,
  - Automatically listens data changes and keeps your data updated,
  - It uses **`Object.observe`** to listen store changes,
  - Makes data more consistent in your whole application,
  - Too easy to use with **React.js**; just add a mixin,
  - Too easy to use with **Flight.js**
  - It's platform agnostic, completely. There's no dependency.
  - Too small, just **13K**.

## Overview

  - [Try **React.js** example on JSFiddle](http://jsfiddle.net/fkadev/a2ms7rcc/)
  - [Try **Flight.js** example on JSFiddle](http://jsfiddle.net/fkadev/1cw9Leau/)

---

## What is Flux

Data in a Flux application flows in a single direction, in a cycle:

![Flux Diagram](https://raw.githubusercontent.com/f/delorean/master/asset/flux-diagram.png)

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

### `initialize`

You may define an `initialize` function to run something on construction. In construction
status, you may **do server actions**. *But **action creators** are more simple entity to
do server actions.*

```javascript
var TodoStore = Flux.createStore({

  todos: [
    {text: 'hello'},
    {text: 'world'}
  ],

  initialize: function (url) {
    var self = this;

    $.getJSON(url, {}, function (data) {
      self.todos = data.todos;
      self.emit('change');
    });
  }
});

var myTodos = new TodoStore('/todos');
```

#### Using `Array.observe` and `Object.observe`, or `listenChanges`

You don't have to call `emit('change')` everytime. You may use **`observe`** feature
of **ES.next**.

```javascript
var TodoStore = Flux.createStore({

  todos: [
    {text: 'hello'},
    {text: 'world'}
  ],

  initialize: function (url) {
    var self = this;

    // It will update store and Views everytime
    // you changed the data.
    Array.observe(this.todos, function () {
      self.emit('change');
    });

    $.getJSON(url, {}, function (data) {
      self.todos = data.todos;
      // You don't have to emit 'change' event.
    });
  }
});

var myTodos = new TodoStore('/todos');
```

Also you may use **`listenChanges`** method which is doing `Array.observe`
or `Object.observe` already for you.

```javascript
  ...
  initialize: function (url) {
    var self = this;

    // It will basically runs `Array.observe` or `Object.observe`
    this.listenChanges(this.todos);

    $.getJSON(url, {}, function (data) {
      self.todos = data.todos;
    });
  }
  ...
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
      todoStore: myTodos
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
      todoStore: myTodos
    }
  }

});
```

## Action Creators

Action creators are the main controller of the app. **They are simply objects** that
manages everything. It allows you to compose data and logic.

```javascript
var TodoActionCreator = {

  getAllTodos: function () {
    // It's an example for async requests.
    // You can do a server request.
    $.getJSON('/todos', function (data) {
      TodoListDispatcher.reset(data.todos);
    });
  },

  addTodo: function (todo) {
    // It statically calls dispatchers.
    TodoListDispatcher.addTodo(todo);
  },

  removeTodo: function (todo) {
    TodoListDispatcher.removeTodo(todo);
  }

};
```

Then you can just run `TodoActionCreator.getAllTodos()` function **to start Flux cycle**.

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

## Routing

You can use any Router tool with DeLorean. In the example I use `director` as the router.

```js
var Router = require('director').Router;
```

You may trig the action from View. So you can just do something like that:

```js
var mainView = React.renderComponent(<ApplicationView dispatcher={TodoListDispatcher} />,
  document.getElementById('main'))

var appRouter = new Router({
  '/random': function () {
    TodoActionCreator.addTodo({text: Math.random()});
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

## TODO

  - Split README file into chapters.
  - Fix English grammar mistakes in README.
  - Draw the flow with SVG or something else.
  - Build a webpage.
  - Build Backbone.js plugin.
  - Build Flight.js mixin.
  - Seperate React and Flight mixins from source.

## Name

The **flux capacitor** was the core component of Doctor Emmett Brown's time traveling **DeLorean time machine**

## License

[MIT License](http://f.mit-license.org)
