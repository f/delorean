/** @jsx React.DOM */

var React = require('react');

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

/* Generate List app with TodoStore. */

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

/* Generate Todo Form app with TodoStore. */

var TodoFormApp = Flux.createApp({

  addTodo: function (todo) {
    this.dispatch('todo:add', todo);
  },

  getStores: function () {
    return {
      todoStore: TodoStore
    }
  }

});

/* Static App */

var TodoApp = Flux.createApp({

  getStores: function () {
    return {
      todoStore: TodoStore
    }
  }

});

/* React Components */

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

var TodoFormView = React.createClass({

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return <form onSubmit={this.handleSubmit}>
      <input value={this.state.todo} onChange={this.handleChange} />
    </form>
  },

  handleChange: function (e) {
    this.setState({todo: e.target.value});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    this.app.addTodo({text: this.state.todo});
    this.setState({todo: ''});
  }

});

var ApplicationView = React.createClass({

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return <div>
      <TodoListView app={TodoListApp} />
      <TodoFormView app={TodoFormApp} />
      <span>There are {this.stores.todoStore.store.todos.length} todos.</span>
    </div>
  }

});

React.renderComponent(<ApplicationView app={TodoApp} />, document.getElementById('main'));
