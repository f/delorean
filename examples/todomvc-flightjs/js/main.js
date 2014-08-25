var Flux = DeLorean.Flux;

var TodoStore = Flux.createStore({

  todos: [
    {text: 'hello'},
    {text: 'world'}
  ],

  initialize: function (todos) {
    var self = this;
    if (todos) {
      this.todos = this.todos.concat(todos);
      this.emit('change');
    }

    // Auto change
    // Array.observe(this.todos, function () {
    //   self.emit('change');
    // });
    // this.listenChanges(this.todos);
  },

  actions: {
    'todo:add': 'addTodo',
    'todo:remove': 'removeTodo',
    'todo:reset': 'resetTodos'
  },

  addTodo: function (todo) {
    this.todos.push({text: todo.text});
    this.emit('change');
  },

  removeTodo: function (todoToComplete) {
    var filteredData = this.todos.filter(function (todo) {
      return todoToComplete.text !== todo.text
    });
    // this.listenChanges(filteredData);

    this.todos = filteredData;
    this.emit('change');
  },

  resetTodos: function (todos) {
    this.todos = todos;
    // this.listenChanges(this.todos);
    this.emit('change');
  }

});

/* Create a Todo Store with a data */

var myTodos = new TodoStore([
  {text: 'foo'},
  {text: 'bar'}
]);
window.myTodos = myTodos;

/* Generate List dispatcher with TodoStore. */

var TodoListDispatcher = Flux.createDispatcher({

  addTodo: function (todo) {
    this.dispatch('todo:add', todo);
  },

  removeTodo: function (todo) {
    if (confirm('Do you really want to delete this todo?')) {
      this.dispatch('todo:remove', todo)
      .then(function () {
        alert('Item is deleted successfully.');
      });
    }
  },

  reset: function (todos) {
    this.dispatch('todo:reset', todos);
  },

  getStores: function () {
    return {
      todoStore: myTodos
    };
  }

});

/* Action generators are simple functions */

var TodoActionCreator = {

  getAllMessages: function () {
    // It's an example for async requests.
    setTimeout(function () {
      TodoListDispatcher.reset([
        {text: 1},
        {text: 2},
        {text: 3}
      ]);
    }, 1000);
  },

  addTodo: function (todo) {
    TodoListDispatcher.addTodo(todo);
  },

  removeTodo: function (todo) {
    TodoListDispatcher.removeTodo(todo);
  },

  addAsyncTodo: function (todo) {
    setTimeout(function () {
      TodoListDispatcher.addTodo(todo);
    }, 1000);
  }

};

////////////////////////////////////////////

// Flight Components
var TodoListUI = flight.component(function () {

  this.render = function () {
    var self = this;
    this.$node.html('');

    TodoListDispatcher.stores.todoStore.store.todos.forEach(function (todo) {
      var todoItem = $('<li/>').text(todo.text);
      todoItem.data('todo', todo);

      self.$node.append(todoItem);
    });
  };

  this.removeTodo = function (e) {
    TodoActionCreator.removeTodo($(e.target).data('todo'));
  };

  this.addTodo = function (event, todo) {
    TodoActionCreator.addTodo(todo);
  };

  this.after('initialize', function() {
    this.on(document, 'todo:add', this.addTodo);
    this.$node.on('dblclick', this.removeTodo);

    // You should listen changes of all stores
    TodoListDispatcher.on('change:all', this.render.bind(this));
    this.render();

    TodoActionCreator.addAsyncTodo({text: 'this is async'});
  });
});

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

var TodoAddUI = flight.component(function () {

  this.addTodo = function(e) {
    var input = this.$node.find('input');
    this.trigger('todo:add', {text: input.val().trim()});

    input.val('');
    e.preventDefault();
  }

  this.after('initialize', function() {
    this.on('submit', this.addTodo);
  });
});

TodoListUI.attachTo('#todos');
TodoAddUI.attachTo('#new-item');
TodoCountUI.attachTo('#count span');
