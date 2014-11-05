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

### `getState()`

You must define a `getState` method on your store. This method should return an object
containing the state data needed by your view(s). It is called by the React mixin on
`componentDidMount`, and the returned data is placed into `this.state.stores[storeName]` on
React components with the Delorean `storeListener` mixin applied (see the [View (or React Component)](./views.md)
documentation for more).

### Advanced Data Structure with `scheme`

Schemes are simply structure definitions of the DeLorean.

```js
var Artist = Flux.createStore({
  scheme: {
    firstName: {
      default: 'Unknown'
    },
    lastName: {
      default: 'Artist'
    },
    fullName: {
      deps: ['firstName', 'lastName'],
      calculate: function () {
        return this.firstName + ' ' + this.lastName;
      }
    }
  }
});
```

Supported Scheme Options

**`default`**: Value of the specified property will be set to this value, and applied as `state`, even when never manually set.

**`calculate`**: A function that returns a computed value. This feature can be used to generate a value off of two other store
properties, or used to parse data into a more desirable format for your components or views. It is passed the value
passed to `set`, and is called in the context of your store. It is also re-called whenever any of it's dependencies
(`deps`) changes.

**`deps`**: An array of other property names from `scheme`, whose changes should cause the property to recalculate.. `deps`
allows delorean to efficiently recalculate properties only when necessary. The `calculate` function will only be 
called when the store is created, and when one of the property in it's `deps` is `set` or calculated. Note: a calculated
property can be dependent on another calculatd property, but circular dependencies are not supported, so be careful!


For basic schemes, there is a shorthand syntax where you can set the `default` value or `calculate` method 
directly on the property name. Note that when this syntax is used, `calculate` will only be called when the
property is `set` directly. It is best used for parsing (data transforms) on properties or for calculated
properties where dependencies will not change.

```js
var Artist = Flux.createStore({
  scheme: {
    firstName: 'Unknown',
    lastName: 'Artist',
    fullName: function (value) {
      return this.firstName + ' ' + this.lastName;
    }
  }
});

var UserSearch = Flux.createStore({
  scheme: {
    // Defining a scheme property as a function provides a standard way to do data transforms (when required)
    results: function (serverResponse) {
      var user;
      for (var i = 0; i < serverResponse.length; i++) {
        user = serverResponse[i];
        user.fullName = user.firstName + ' ' + user.lastName;
      }
      return serverResposne;
    }
  }
});
```

#### `set` method to change data defined on `scheme`

You must use the `set` method to mutate the data of the scheme. It'll change the
data, recalculate the appropriate properties and calls `emit('change')` so your
views or component update. `set` accepts a key and value, or an object with all the
key/value pairs being set.

```js
var artist = new Artist();
artist.set('firstName', 'Michael');
artist.set('lastName', 'Jackson');

artist.set({
  firstName: 'Salvador',
  lastName: 'Dali'
});
```

*Note: If you try to set a value doesn't exist in `scheme` it'll throw an error.*

In Todo example it may be better:

```js
var TodoStore = Flux.createStore({
  scheme: {
    todos: {
      default: [],
      calculate: function () {
        return this.todos.concat().sort(function (a, b) { return a > b });
      }
    }
  }
});
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
    var self = this;

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
