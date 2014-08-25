# Stores

Stores contain the application state and logic. Their role is somewhat similar
to a model in a traditional MVC, but they manage the state of many objects —
they are not instances of one object. Nor are they the same as Backbone's
collections. More than simply managing a collection of ORM-style objects,
stores manage the application state for a particular domain within the application.

## `Flux.createStore`

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
