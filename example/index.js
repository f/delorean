/** @jsx React.DOM */

var React = require('react');
var Flux = DeLorean.Flux;

/* Generate Generic Store */

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

/* Generate List dispatcher with TodoStore. */

var TodoListDispatcher = Flux.createDispatcher({

  removeTodo: function (todo) {
    if (confirm('Do you really want to delete this todo?')) {
      this.dispatch('todo:remove', todo)
      .then(function () {
        alert('Item is deleted successfully.');
      });
    }
  },

  getStores: function () {
    return {
      todoStore: TodoStore
    }
  }

});

/* Generate Todo Form dispatcher with TodoStore. */

var TodoFormDispatcher = Flux.createDispatcher({

  addTodo: function (todo) {
    this.dispatch('todo:add', todo);
  },

  getStores: function () {
    return {
      todoStore: TodoStore
    }
  }

});

/* Static Dispatcher */

var TodoDispatcher = Flux.createDispatcher({

  getStores: function () {
    return {
      todoStore: TodoStore
    }
  }

});

/* React Components */

var TodoItemView = React.createClass({displayName: 'TodoItemView',

  render: function (todo) {
    return React.DOM.li({onClick: this.handleClick}, this.props.todo.text)
  },

  handleClick: function () {
    this.props.dispatcher.removeTodo(this.props.todo);
  }

});

var TodoListView = React.createClass({displayName: 'TodoListView',

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;

    return React.DOM.ul(null, 
      this.stores.todoStore.store.todos.map(function (todo) {
        return TodoItemView({dispatcher: self.dispatcher, todo: todo})
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
    this.dispatcher.addTodo({text: this.state.todo});
    this.setState({todo: ''});
  }

});

var ApplicationView = React.createClass({displayName: 'ApplicationView',

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return React.DOM.div(null, 
      TodoListView({dispatcher: TodoListDispatcher}), 
      TodoFormView({dispatcher: TodoFormDispatcher}), 
      React.DOM.span(null, "There are ", this.stores.todoStore.store.todos.length, " todos.")
    )
  }

});

React.renderComponent(ApplicationView({dispatcher: TodoDispatcher}), document.getElementById('main'));
