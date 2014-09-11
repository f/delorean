# Action Creators

Action creators are the main controllers of the app. **They are simply objects** that
manage everything. They allow you to compose data and logic.

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

Then you just run `TodoActionCreator.getAllTodos()` method **to start the Flux cycle**.
