/** @jsx React.DOM */

var React = require('react');
var Flux = require('../../../../').Flux;

var Router = require('director').Router;

/* Generate Generic Store */

var TodoStore = Flux.createStore({

  scheme: {
    firstname: 'John',
    surname: 'Doe',
    fullname: {
      default: 'woot',
      deps: ['firstname', 'surname'],
      calculate: function (value) {
        return value.toUpperCase() + ' ' + this.firstname;
      }
    },
    todos: {
      default: [
        {text: 'b'},
        {text: 'c'},
        {text: 'a'}
      ],
      calculate: function () {
        var self = this;
        return this.todos.map(function (todo) {
          return {text: todo.text.toString().toUpperCase()};
        });
      }
    }
  },

  initialize: function (todos) {
    var self = this;
    if (todos) {
      this.todos = this.set('todos', this.todos.concat(todos));
    }

    // Auto change
    // Array.observe(this.todos, function () {
    //   self.emit('change');
    // });
    this.listenChanges(this.todos);
  },

  actions: {
    'todo:add': 'addTodo',
    'todo:remove': 'removeTodo',
    'todo:reset': 'resetTodos'
  },

  addTodo: function (todo) {
    this.set('todos', this.todos.concat({text: todo.text}));
  },

  removeTodo: function (todoToComplete) {
    var filteredData = this.todos.filter(function (todo) {
      return todoToComplete.text !== todo.text
    });
    this.listenChanges(filteredData);

    this.set('todos', filteredData);
    this.emit('change');
  },

  resetTodos: function (todos) {
    this.set('todos', todos);
    this.listenChanges(this.todos);
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
    }
  }

});

/* Static Dispatcher */

var TodoDispatcher = Flux.createDispatcher({

  getStores: function () {
    return {
      todoStore: myTodos
    }
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

/* React Components */

var TodoItemView = React.createClass({displayName: 'TodoItemView',

  render: function (todo) {
    return React.DOM.li({onClick: this.handleClick}, this.props.todo.text)
  },

  handleClick: function () {
    TodoActionCreator.removeTodo(this.props.todo);
  }

});

var TodoListView = React.createClass({displayName: 'TodoListView',

  mixins: [Flux.mixins.storeListener],

  storeDidChange: function () {
    console.log(arguments);
  },

  render: function () {
    var self = this;

    return React.DOM.ul(null, 
      this.stores.todoStore.store.todos.map(function (todo) {
        return TodoItemView({todo: todo})
      })
    )
  }

});

var TodoFormView = React.createClass({displayName: 'TodoFormView',

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return React.DOM.form({onSubmit: this.handleSubmit}, 
      React.DOM.input({value: this.state.todo, onChange: this.handleChange})
    )
  },

  handleChange: function (e) {
    this.setState({todo: e.target.value});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    TodoActionCreator.addTodo({text: this.state.todo});
    this.setState({todo: ''});
  }

});

var ApplicationView = React.createClass({displayName: 'ApplicationView',

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return React.DOM.div(null, 
      React.DOM.span(null, this.getStore('todoStore').fullname), 
      TodoListView(null), 
      TodoFormView(null), 
      React.DOM.span(null, "There are ", this.getStore('todoStore').todos.length, " todos.")
    )
  }

});

window.mainView = React.renderComponent(ApplicationView({dispatcher: TodoListDispatcher}),
  document.getElementById('main'))

var appRouter = new Router({
  '/': function () {
    TodoActionCreator.addAsyncTodo({text: 'this is async'});
  },
  '/random': function () {
    TodoActionCreator.addTodo({text: Math.random()});
    location.hash = '/';
  }
});

appRouter.init('/');
