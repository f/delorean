/** @jsx React.DOM */

var React = require('react');
var Flux = DeLorean.Flux;
var Router = require('director').Router;

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
        return <TodoItemView dispatcher={self.dispatcher} todo={todo}></TodoItemView>
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
    this.dispatcher.addTodo({text: this.state.todo});
    this.setState({todo: ''});
  }

});

var ApplicationView = React.createClass({

  mixins: [Flux.mixins.storeListener],

  render: function () {
    var self = this;
    return <div>
      <TodoListView dispatcher={TodoListDispatcher} />
      <TodoFormView dispatcher={TodoFormDispatcher} />
      <span>There are {this.stores.todoStore.store.todos.length} todos.</span>
    </div>
  }

});

var mainView = React.renderComponent(<ApplicationView dispatcher={TodoDispatcher} />,
  document.getElementById('main'))

var appRouter = new Router({
  '/random': function () {
    mainView.dispatcher.dispatch('todo:add', {text: Math.random()});
    location.hash = '/';
  }
});

appRouter.init('/');
