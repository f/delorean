# Stores

Stores contain the application state and logic. Their role is somewhat similar
to a model in a traditional MVC, but they manage the state of many objects.
Unlike MVC models, they are not instances of one object, nor are they the same as Backbone's
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

You may define an `initialize` function to run setup code on construction. In `initialize`, 
you may **perform server actions**, *but **action creators** are a simpler entity for executing server actions.*

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

### `emitChange()` or `emit('change')`

When your data changes, you need to call `emitChange()` or `emit('change')` to publish
a change signal for views.

### `emitRollback()` or `emit('rollback')`

When something goes wrong with your store, you may want to emit a `rollback` event. When
emitted, it informs other related stores to roll back as well.

#### Using `Array.observe` and `Object.observe`, or `listenChanges`

You don't have to call `emitChange()` or `emit('change')` everytime. You may use the **`observe`** feature
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

Also you may use the **`listenChanges`** method, which intelligently uses `Array.observe`
or `Object.observe` for you.

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

### Protect your state from failures using `rollback`

Sometimes stores may fail, and you will want to revert your data. In these cases, you'll need
a rollback mechanism. When a store says it needs to be rolled back, **every sibling
store on the same dispatcher will be informed**.

```javascript
  ...
  todos: [],

  initialize: function (url) {
    var self = this;

    this.rollback(function () {
      // bring old todos back, also it will tell another stores
      // to be rolled back.
      self.todos = self.oldTodos.slice(0);
      self.emit('change');
    });
  },

  addTodo: function (data) {
    // Let's backup the data
    self.oldTodos = self.todos.slice(0);

    // Now apply the view
    self.todos.push({text: data});
    self.emitChange();

    // Now try to react to the server
    $.post('/todos', {text: data}, function (response) {
      if (response.status === false) {
        // if something goes wrong with the server, emit rollback.
        self.emitRollback();
      }
    }, 'json');
  }
  ...
```
